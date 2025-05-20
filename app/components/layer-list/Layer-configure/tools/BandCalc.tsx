"use client";

import {
  CurrentLayerContext,
  MapLayersContext,
  MapSourcesContext,
  SetMapLayersContext,
  SetMapSourcesContext
} from "@/app/providers/contexts";
import { Block, BlockTitle } from "@/components/custom-ui/Block";
import CustomSelect from "@/components/custom-ui/CustomSelect";
import CustomTextArea from "@/components/custom-ui/CustomTextArea";
import CustomTooltip from "@/components/custom-ui/CustomTooltip";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { baseUrl, stretchArr, stretchMap, stretchType } from "@/lib/constants";
import { generateImageSource, generateRasterLayer } from "@/lib/transformUtils";
import { GdalInfoResponse } from "@/lib/types";
import { Calculator, Plus, Trash2Icon } from "lucide-react";
import { MapSourceDataEvent, RasterLayerSpecification } from "maplibre-gl";
import {
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { useMap } from "react-map-gl/maplibre";
import { toast } from "sonner";
import { Field } from "../../layer-configure-com/Labels";
import CustomInput from "@/components/custom-ui/CustomInput";

type variableType = { var: string; band: string };

const keyArr = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "0",
  "+",
  "-",
  "*",
  "/",
  ".",
  "(",
  ")",
  ">",
  "<",
  "=",
  "A",
  "B",
  "C",
  "D",
  "E"
];

const letters = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z"
];

const BandCalc = memo(function BandCalc({ data }: { data: GdalInfoResponse }) {
  const [stretch, setStretch] = useState<stretchType>("linear 2%");
  const [varialbeArr, setVarialbeArr] = useState<variableType[]>([
    {
      var: "A",
      band: "1"
    }
  ]);
  const [expression, setExpression] = useState("");
  const [outputName, setOutputName] = useState("");

  const [isSourceLoaded, setIsSourceLoaded] = useState(false);

  const currentLayer = useContext(
    CurrentLayerContext
  ) as RasterLayerSpecification;
  const mapSources = useContext(MapSourcesContext);
  const mapLayers = useContext(MapLayersContext);
  const setMapSources = useContext(SetMapSourcesContext);
  const setMapLayers = useContext(SetMapLayersContext);
  const { mainMap } = useMap();

  const bands = useMemo(() => {
    const arr = data.bands.map((band) => band.band.toString());
    return ["none", ...arr];
  }, [data]);

  const commitCalc = useCallback(async () => {
    if (outputName === "") {
      toast.error("output is null");
      return;
    }
    if (varialbeArr.length === 0) {
      toast.error("bands is null");
      return;
    }
    if (expression === "") {
      toast.error("expression is null");
      return;
    }

    const obj = {
      calcBands: varialbeArr,
      inputFileName: currentLayer.source,
      outputFileName: outputName,
      expression,
      linear: stretchMap[stretch]
    };
    toast.loading(`generate image layer for ${outputName}`, {
      id: "rasterCalc"
    });
    try {
      const res = await fetch(`${baseUrl}/rasterCalc`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(obj)
      });
      const { id, url, coordinates } = await res.json();

      const newImageSource = generateImageSource(id, url, coordinates);

      if (mapSources.find((source) => source.id === newImageSource.id)) {
        toast.warning(`${newImageSource.id} is already exist`);
        return;
      }
      setMapSources((pre) => [...pre, newImageSource]);
    } catch (e) {
      toast.error(JSON.stringify(e), { id: "rasterCalc" });
    }
  }, [
    currentLayer.source,
    expression,
    mapSources,
    outputName,
    setMapSources,
    stretch,
    varialbeArr
  ]);

  useEffect(() => {
    if (!mainMap) return;

    const handleSourceLoaded = (e: MapSourceDataEvent) => {
      if (e.sourceId === `${outputName}.tif` && e.isSourceLoaded) {
        setIsSourceLoaded(true);
      }
    };

    mainMap?.getMap().on("sourcedata", handleSourceLoaded);

    return () => {
      mainMap.getMap().off("sourcedata", handleSourceLoaded);
    };
  }, [mainMap, outputName]);

  useEffect(() => {
    if (isSourceLoaded) {
      const newImage = generateRasterLayer(outputName + ".tif", outputName);
      if (mapLayers.find((layer) => layer.id === newImage.id)) {
        return;
      }
      setMapLayers((pre) => [...pre, newImage]);
      setIsSourceLoaded(false);
      toast.success("change display success", { id: "rasterCalc" });
    }
  }, [isSourceLoaded, mapLayers, outputName, setMapLayers]);

  const changeExpressionByInput = useCallback((value: string) => {
    setExpression(value);
  }, []);

  const addVariable = useCallback(() => {
    const letter = letters.find(
      (l) => !varialbeArr.find((variable) => variable.var === l)
    );
    setVarialbeArr((pre) => {
      return [
        ...pre,
        {
          var: letter!,
          band: "none"
        } as variableType
      ];
    });
  }, [varialbeArr]);

  const removeVariable = useCallback(() => {
    setVarialbeArr((pre) => {
      const newArr = [...pre];
      newArr.pop();
      return newArr;
    });
  }, []);

  const changeOutputName = useCallback((value: string) => {
    setOutputName(value);
  }, []);
  const changeStretch = useCallback((value: string) => {
    setStretch(value as stretchType);
  }, []);

  return (
    <Popover>
      <CustomTooltip content="Band display">
        <PopoverTrigger asChild>
          <Button variant={"ghost"} size={"icon"}>
            <Calculator className="size-5" />
          </Button>
        </PopoverTrigger>
      </CustomTooltip>
      <PopoverContent
        className=" bg-background/10 backdrop-blur-md p-0 rounded-lg"
        side="left"
        sideOffset={145}
        align="start"
      >
        <div className=" flex flex-col gap-2 bg-background/80 dark:bg-background/90 p-3 rounded-lg ">
          <Block>
            <BlockTitle>Options</BlockTitle>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Field>Output</Field>
                <CustomInput
                  placeholder="input output name..."
                  initialValue={outputName}
                  updateValue={changeOutputName}
                />
              </div>
              <div className="flex items-center justify-between">
                <Field>stretch</Field>
                <CustomSelect
                  arr={stretchArr}
                  initialSelection={stretch}
                  updateSelection={changeStretch}
                />
              </div>
            </div>
          </Block>
          <Block>
            <BlockTitle>Variables</BlockTitle>
            <div className="flex flex-col gap-2 max-h-48 overflow-auto">
              {varialbeArr.map((variable, index) => (
                <div key={variable.var} className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col">
                    <Field>Variable</Field>
                    <CustomInput
                      className="w-full"
                      initialValue={variable.var}
                      updateValue={(value: string) => {
                        setVarialbeArr((pre) => {
                          const newArr = [...pre];
                          newArr[index].var = value;
                          return newArr;
                        });
                      }}
                    />
                  </div>
                  <div className="flex flex-col">
                    <Field>Band</Field>
                    <CustomSelect
                      className="w-full"
                      arr={bands}
                      initialSelection={variable.band}
                      updateSelection={(value: string) => {
                        setVarialbeArr((pre) => {
                          const newArr = [...pre];
                          newArr[index].band = value;
                          return newArr;
                        });
                      }}
                    />
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-2 justify-end ">
                <Button
                  size={"icon"}
                  variant={"destructive"}
                  onClick={removeVariable}
                >
                  <Trash2Icon className="size-5" />
                </Button>
                <Button size={"icon"} onClick={addVariable}>
                  <Plus className="size-5" />
                </Button>
              </div>
            </div>
          </Block>
          <Block>
            <BlockTitle>Calculator</BlockTitle>
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-5 gap-1 place-items-center">
                {keyArr.map((key) => (
                  <Button
                    key={key}
                    variant={"outline"}
                    size={"icon"}
                    onClick={() => setExpression((pre) => `${pre}${key}`)}
                  >
                    {key}
                  </Button>
                ))}
              </div>
              <CustomTextArea
                initialValue={expression}
                updateValue={changeExpressionByInput}
                placeholder="input your expression..."
              />
              <p className="text-xs text-muted-foreground">
                Support numpy syntax. For example, numpy.where(),
                numpy.sqrt()....
              </p>
            </div>
          </Block>
          <Button onClick={commitCalc}>Apply</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
});
export default BandCalc;
