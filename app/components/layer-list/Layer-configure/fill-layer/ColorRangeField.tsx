"use client";

import {
  CurrentLayerContext,
  MapSourcesContext,
  SetMapLayersContext
} from "@/app/providers/contexts";
import ColorPalette from "@/components/custom-ui/ColorPalette";
import CustomSelect from "@/components/custom-ui/CustomSelect";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { colorMap } from "@/lib/constants";
import { getPropertiesColumnDefFromData } from "@/lib/tableUtils";
import { getNumberFieldsFromFeatureCollection, getSteps } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  useReactTable
} from "@tanstack/react-table";
import chroma from "chroma-js";
import { FeatureCollection } from "geojson";
import { Check, ChevronDown, Minus, Plus, X } from "lucide-react";
import {
  FillLayerSpecification,
  GeoJSONSourceSpecification
} from "maplibre-gl";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Field } from "../../layer-configure-com/Labels";
import ColormapSelect from "./ColormapSelect";
import CustomNumberInput from "@/components/custom-ui/CustomNumberInput";
import { PiWaveSineBold } from "react-icons/pi";
import CustomMultiSlider from "@/components/custom-ui/CustomMultiSlider";

const stepCountArr = [
  "1 step",
  "2 steps",
  "3 steps",
  "4 steps",
  "5 steps",
  "6 steps",
  "7 steps",
  "8 steps",
  "9 steps",
  "10 steps",
  "11 steps",
  "12 steps",
  "13 steps",
  "14 steps",
  "15 steps",
  "16 steps",
  "17 steps",
  "18 steps",
  "19 steps",
  "20 steps"
];

function ColorRangeField() {
  const [open, setOpen] = useState(false);

  const currentLayer = useContext(
    CurrentLayerContext
  ) as FillLayerSpecification;

  const setMapLayers = useContext(SetMapLayersContext);
  const mapSources = useContext(MapSourcesContext);

  const currentSource = useMemo(() => {
    return mapSources.find(
      (source) => source.id === currentLayer.source
    ) as GeoJSONSourceSpecification & { id: string };
  }, [mapSources, currentLayer]);

  const isUrlData = useMemo(() => {
    if (!currentSource) return false;
    if (typeof currentSource?.data === "string") return true;
    return false;
  }, [currentSource]);

  const { data } = useQuery({
    queryKey: [currentSource.id],
    queryFn: async () => {
      if (!isUrlData) return currentSource.data;
      const res = await fetch(currentSource.data as string);
      return await res.json();
    }
  });

  const columns = useMemo(() => {
    return getPropertiesColumnDefFromData((data as FeatureCollection).features);
  }, [data]);

  const table = useReactTable({
    data: (data as FeatureCollection).features,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    getFacetedUniqueValues: getFacetedUniqueValues()
  });

  const fields = useMemo(() => {
    if (!data) return [];
    const result = getNumberFieldsFromFeatureCollection(data);
    if (result) return [...result];
    return [];
  }, [data]);

  const [currentSelection, setCurrentSelection] = useState(fields[0]);

  const uniqueValues: [number, number][] = useMemo(() => {
    const map = table
      .getColumn("properties_" + currentSelection)
      ?.getFacetedUniqueValues();
    if (map) return Array.from(map);
    return [];
  }, [table, currentSelection]);

  const MinMaxValues = useMemo(() => {
    const minMax = table
      .getColumn("properties_" + currentSelection)
      ?.getFacetedMinMaxValues();
    if (minMax) return minMax;
    return [-1, 1];
  }, [table, currentSelection]);

  const [stepCount, setStepCount] = useState(5);

  const [currentSteps, setCurrentSteps] = useState(
    getSteps(MinMaxValues[0], MinMaxValues[1], stepCount)
  );

  useEffect(() => {
    setCurrentSteps(getSteps(MinMaxValues[0], MinMaxValues[1], stepCount));
  }, [MinMaxValues, stepCount]);

  const [currentColorPalette, setCurrentColorPalette] =
    useState<chroma.BrewerPaletteName>(colorMap[0]);

  const [currentColors, setCurrentColors] = useState<string[]>(() =>
    chroma.scale(currentColorPalette).colors(stepCount + 1, "hex")
  );

  useEffect(() => {
    setCurrentColors(
      chroma.scale(currentColorPalette).colors(stepCount + 1, "hex")
    );
  }, [stepCount, currentColorPalette]);

  const changeTextField = useCallback((textField: string) => {
    setCurrentSelection(textField);
    setStepCount(5);
  }, []);

  const addStep = useCallback(() => {
    if (stepCount >= 20) {
      toast.warning("already max steps");
      return;
    }
    setStepCount((pre) => pre + 1);
  }, [stepCount]);

  const changeStepCount = useCallback((selection: string) => {
    const count = stepCountArr.findIndex((item) => item === selection);
    setStepCount(count + 1);
  }, []);

  const changeColorPalette = useCallback((value: string) => {
    setCurrentColorPalette(value as chroma.BrewerPaletteName);
  }, []);

  const removeStep = useCallback(() => {
    setStepCount((pre) => pre - 1);
  }, []);

  const applyCategory = useCallback(() => {
    setMapLayers((pre) => {
      const arr: (number | string)[] = [currentColors[0]];
      currentSteps.forEach((value, index) => {
        arr.push(value);
        arr.push(currentColors[index + 1]);
      });

      return pre.map((layer) => {
        if (currentLayer.id === layer.id) {
          return {
            ...layer,
            paint: {
              ...layer.paint,
              "fill-color": ["step", ["get", currentSelection], ...arr]
            }
          } as unknown as FillLayerSpecification;
        }
        return layer;
      });
    });
    toast.success(`change ${currentLayer.id} fill color`);
  }, [
    setMapLayers,
    currentColors,
    currentSteps,
    currentLayer,
    currentSelection
  ]);

  useEffect(() => {
    setOpen((pre) => !pre);
  }, [currentSelection, currentColorPalette]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <Field>Color by</Field>
        <CustomSelect
          arr={fields}
          initialSelection={currentSelection}
          updateSelection={changeTextField}
        />
      </div>
      <div className="flex items-center justify-between">
        <Field>Showing</Field>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              className="w-[70%] flex items-center justify-between pr-3 bg-transparent"
              variant={"outline"}
            >
              {stepCount === 1 ? `${stepCount} step` : `${stepCount} steps`}
              <ChevronDown className="size-4 text-muted-foreground" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            side="left"
            sideOffset={125}
            className="bg-background/10 backdrop-blur-md p-0 rounded-lg w-[430px]"
          >
            <div className="flex flex-col gap-3 bg-background/80 dark:bg-background/90 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <h1>Set category</h1>
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  onClick={() => setOpen(false)}
                >
                  <X className="size-5" />
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <Field>Showing</Field>
                <CustomSelect
                  initialSelection={
                    stepCount === 1 ? `${stepCount} step` : `${stepCount} steps`
                  }
                  arr={stepCountArr}
                  updateSelection={changeStepCount}
                />
              </div>

              <CustomMultiSlider
                min={MinMaxValues[0]}
                max={MinMaxValues[1]}
                initialValues={currentSteps}
                updateValues={setCurrentSteps}
                currentColors={currentColors}
                uniqueValues={uniqueValues}
              />
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center justify-between">
                  <Field>Min</Field>
                  <Button
                    className="w-[70%] bg-transparent flex items-center justify-start "
                    variant={"outline"}
                  >
                    {MinMaxValues[0].toFixed(5)}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <Field>Max</Field>
                  <Button
                    className="w-[70%] bg-transparent flex items-center justify-start "
                    variant={"outline"}
                  >
                    {MinMaxValues[1].toFixed(5)}
                  </Button>
                </div>
              </div>
              <div className=" flex flex-col gap-2 overflow-auto max-h-[300px] ">
                {currentColors.map((value, index) => (
                  <div
                    className="flex items-center group pl-2 gap-2 justify-between"
                    key={value}
                  >
                    <div className="w-[60px] flex items-center gap-2 ">
                      <Button
                        variant={"outline"}
                        className="opacity-100  size-6 p-0 group-hover:bg-accent "
                        onClick={removeStep}
                      >
                        <Minus className="size-4" />
                      </Button>
                      <ColorPalette
                        type="square"
                        initialColor={currentColors[index]}
                        updateColor={(color) => {
                          setCurrentColors((pre) => {
                            return pre.toSpliced(index, 1, color as string);
                          });
                        }}
                        sideOffset={80}
                      />
                    </div>
                    {index === 0 ? (
                      <div className="flex items-center gap-2 w-[85%]">
                        <Button variant={"outline"} className="w-[43%]">
                          -Infinity
                        </Button>
                        <Button variant={"outline"} size={"icon"}>
                          <PiWaveSineBold />
                        </Button>
                        <CustomNumberInput
                          className="w-[43%] bg-background/50 text-muted-foreground shadow-sm hover:bg-accent hover:text-accent-foreground"
                          initialValue={currentSteps[index]}
                          updateValue={(value: number) =>
                            setCurrentSteps((pre) => {
                              return pre.toSpliced(index, 1, value);
                            })
                          }
                        />
                      </div>
                    ) : index === currentColors.length - 1 ? (
                      <div className="flex items-center gap-2 w-[85%]">
                        <CustomNumberInput
                          className="w-[43%] bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"
                          initialValue={currentSteps[index - 1]}
                          updateValue={(value: number) => {
                            setCurrentSteps((pre) => {
                              return pre.toSpliced(index - 1, 1, value);
                            });
                          }}
                        />
                        <Button variant={"outline"} size={"icon"}>
                          <PiWaveSineBold />
                        </Button>
                        <Button
                          variant={"outline"}
                          className="w-[43%] bg-background/50 text-muted-foreground"
                        >
                          Infinity
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 w-[85%]">
                        <CustomNumberInput
                          className="w-[43%] bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"
                          initialValue={currentSteps[index - 1]}
                          updateValue={(value: number) => {
                            setCurrentSteps((pre) => {
                              return pre.toSpliced(index - 1, 1, value);
                            });
                          }}
                        />
                        <Button variant={"outline"} size={"icon"}>
                          <PiWaveSineBold />
                        </Button>
                        <CustomNumberInput
                          className="w-[43%] bg-background/50 text-muted-foreground shadow-sm hover:bg-accent hover:text-accent-foreground"
                          initialValue={currentSteps[index]}
                          updateValue={(value: number) => {
                            setCurrentSteps((pre) => {
                              return pre.toSpliced(index, 1, value);
                            });
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-end gap-2">
                <Button
                  variant={"outline"}
                  className="text-pink-500"
                  //   disabled={uniqueValues.length <= currentValues.length}
                  onClick={addStep}
                  size={"sm"}
                >
                  <Plus className="size-4" />
                  New
                </Button>
                <Button onClick={applyCategory} size={"sm"}>
                  <Check className="size-4" />
                  Apply
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex items-center justify-between">
        <Field>Palette</Field>
        <ColormapSelect
          currentColors={currentColors}
          categoryCount={stepCount + 1}
          initialSelection={currentColorPalette}
          updateSelection={changeColorPalette}
        />
      </div>
    </div>
  );
}

export default ColorRangeField;
