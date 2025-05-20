"use client";

import {
  CurrentLayerContext,
  MapSourcesContext,
  MapLayersContext,
  SetMapSourcesContext,
  SetMapLayersContext
} from "@/app/providers/contexts";
import { Block, BlockTitle } from "@/components/custom-ui/Block";
import CustomInput from "@/components/custom-ui/CustomInput";
import CustomSelect from "@/components/custom-ui/CustomSelect";
import CustomTooltip from "@/components/custom-ui/CustomTooltip";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { generateDisplayApi } from "@/lib/fetchUtils";
import { generateImageSource, generateRasterLayer } from "@/lib/transformUtils";
import { GdalInfoResponse } from "@/lib/types";
import { Monitor } from "lucide-react";
import { RasterLayerSpecification, MapSourceDataEvent } from "maplibre-gl";
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
import { stretchArr, stretchMap, stretchType } from "@/lib/constants";

const BandDisplay = memo(function BandDisplay({
  data
}: {
  data: GdalInfoResponse;
}) {
  const [outputName, setOutputName] = useState("");
  const [stretch, setStretch] = useState<stretchType>("linear 2%");
  const [redBand, setRedBand] = useState("none");
  const [greenBand, setGreenBand] = useState("none");
  const [blueBand, setBlueBand] = useState("none");

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

  const changeRedBand = useCallback((value: string) => {
    setRedBand(value);
  }, []);
  const changeGreenBand = useCallback((value: string) => {
    setGreenBand(value);
  }, []);
  const changeBlueBand = useCallback((value: string) => {
    setBlueBand(value);
  }, []);

  const changeOutputName = useCallback((value: string) => {
    setOutputName(value);
  }, []);
  const changeStretch = useCallback((value: string) => {
    setStretch(value as stretchType);
  }, []);

  const commitBand = useCallback(async () => {
    if (outputName === "") {
      toast.error("output is null");
      return;
    }
    if (redBand === "none") {
      toast.error("red band is null");
      return;
    }
    if (greenBand === "none") {
      toast.error("green band is null");
      return;
    }
    if (blueBand === "none") {
      toast.error("blue band is null");
      return;
    }

    const api = generateDisplayApi(
      currentLayer.source,
      outputName,
      stretchMap[stretch].toString(),
      redBand,
      greenBand,
      blueBand
    );
    toast.loading(`generate image layer for ${outputName}`, {
      id: "display"
    });

    try {
      const res = await fetch(api);
      const { id, url, coordinates } = await res.json();
      const newImageSource = generateImageSource(id, url, coordinates);

      if (mapSources.find((source) => source.id === newImageSource.id)) {
        toast.warning(`${newImageSource.id} is already exist`);
        return;
      }
      setMapSources((pre) => [...pre, newImageSource]);
    } catch (e) {
      toast.error(JSON.stringify(e), { id: "display" });
    }
  }, [
    blueBand,
    currentLayer.source,
    greenBand,
    mapSources,
    outputName,
    redBand,
    setMapSources,
    stretch
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
      toast.success("change display success", { id: "display" });
    }
  }, [isSourceLoaded, mapLayers, outputName, setMapLayers]);

  return (
    <Popover>
      <CustomTooltip content="Band display">
        <PopoverTrigger asChild>
          <Button variant={"ghost"} size={"icon"}>
            <Monitor className="size-5" />
          </Button>
        </PopoverTrigger>
      </CustomTooltip>
      <PopoverContent
        className=" bg-background/10 backdrop-blur-md p-0 rounded-lg"
        side="left"
        sideOffset={110}
        align="start"
      >
        <div className=" flex flex-col gap-2 bg-background/80 dark:bg-background/90 p-3 rounded-lg text-xs">
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
            <BlockTitle>Band display</BlockTitle>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Field>Red</Field>
                <CustomSelect
                  arr={bands}
                  initialSelection={redBand}
                  updateSelection={changeRedBand}
                />
              </div>
              <div className="flex items-center justify-between">
                <Field>Green</Field>
                <CustomSelect
                  arr={bands}
                  initialSelection={greenBand}
                  updateSelection={changeGreenBand}
                />
              </div>
              <div className="flex items-center justify-between">
                <Field>Blue</Field>
                <CustomSelect
                  arr={bands}
                  initialSelection={blueBand}
                  updateSelection={changeBlueBand}
                />
              </div>
            </div>
          </Block>
          <Button onClick={commitBand}>Apply</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
});
export default BandDisplay;
