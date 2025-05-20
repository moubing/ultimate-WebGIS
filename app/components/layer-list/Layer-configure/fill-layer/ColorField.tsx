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
import { getFieldsFromFeatureCollection } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
  getCoreRowModel,
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
import UniqueSelector from "./UniqueSelector";

const categoryCountArr = [
  "1 category",
  "2 categories",
  "3 categories",
  "4 categories",
  "5 categories",
  "6 categories",
  "7 categories",
  "8 categories",
  "9 categories",
  "10 categories",
  "11 categories",
  "12 categories",
  "13 categories",
  "14 categories",
  "15 categories",
  "16 categories",
  "17 categories",
  "18 categories",
  "19 categories",
  "20 categories"
];

function ColorField() {
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
    getFacetedUniqueValues: getFacetedUniqueValues()
  });

  const fields = useMemo(() => {
    if (!data) return [];
    const result = getFieldsFromFeatureCollection(data);
    if (result) return [...result];
    return [];
  }, [data]);

  const [currentSelection, setCurrentSelection] = useState(fields[0]);

  const uniqueValues: [string, number][] = useMemo(() => {
    const map = table
      .getColumn("properties_" + currentSelection)
      ?.getFacetedUniqueValues();
    if (map) return Array.from(map);
    return [];
  }, [table, currentSelection]);

  const [categoryCount, setCategoryCount] = useState(
    uniqueValues.length > 10 ? 10 : uniqueValues.length
  );

  const [currentValues, setCurrentValues] = useState(
    uniqueValues.slice(0, categoryCount)
  );

  useEffect(() => {
    if (uniqueValues.length < categoryCount) {
      setCategoryCount(uniqueValues.length);
      setCurrentValues(uniqueValues);
    } else {
      setCurrentValues(uniqueValues.slice(0, categoryCount));
    }
  }, [uniqueValues, categoryCount]);

  const [defalutColor, setDefalutColor] = useState("#aaaaaa");
  const [currentColorPalette, setCurrentColorPalette] =
    useState<chroma.BrewerPaletteName>(colorMap[0]);

  const [currentColors, setCurrentColors] = useState<string[]>(() =>
    chroma.scale(currentColorPalette).colors(categoryCount, "hex")
  );

  useEffect(() => {
    setCurrentColors(
      chroma.scale(currentColorPalette).colors(categoryCount, "hex")
    );
  }, [categoryCount, currentColorPalette]);

  const trueUniqueValues = useMemo(
    () =>
      uniqueValues.filter((item) => {
        const isFinded = currentValues.find(
          (currentValue) => currentValue[0] === item[0]
        );
        return !isFinded;
      }),
    [uniqueValues, currentValues]
  );

  const changeTextField = useCallback((textField: string) => {
    setCurrentSelection(textField);
    setCategoryCount(10);
  }, []);

  const addCategory = useCallback(() => {
    if (categoryCount >= uniqueValues.length || categoryCount >= 20) {
      toast.warning("already max categories");
      return;
    }
    setCategoryCount((pre) => pre + 1);
  }, [categoryCount, uniqueValues]);

  const changeCategoryCount = useCallback((selection: string) => {
    const count = categoryCountArr.findIndex((item) => item === selection);
    setCategoryCount(count + 1);
  }, []);

  const changeDefalutColor = useCallback((color: string) => {
    setDefalutColor(color);
  }, []);

  const changeColorPalette = useCallback((value: string) => {
    setCurrentColorPalette(value as chroma.BrewerPaletteName);
  }, []);

  const removeCategory = useCallback(() => {
    setCategoryCount((pre) => pre - 1);
  }, []);

  const applyCategory = useCallback(() => {
    setMapLayers((pre) => {
      const arr: string[] = [];
      currentValues.forEach((value, index) => {
        arr.push(value[0]);
        arr.push(currentColors[index]);
      });
      return pre.map((layer) => {
        if (currentLayer.id === layer.id) {
          return {
            ...layer,
            paint: {
              ...layer.paint,
              "fill-color": [
                "match",
                ["get", currentSelection],
                ...arr,
                defalutColor
              ]
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
    currentValues,
    currentLayer,
    defalutColor,
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
              {categoryCount === 1
                ? `${categoryCount} category`
                : `${categoryCount} categories`}
              <ChevronDown className="size-4 text-muted-foreground" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            side="left"
            sideOffset={125}
            className="bg-background/10 backdrop-blur-md p-0 rounded-lg "
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
                    categoryCount === 1
                      ? `${categoryCount} category`
                      : `${categoryCount} categories`
                  }
                  arr={categoryCountArr}
                  updateSelection={changeCategoryCount}
                />
              </div>
              <div className="flex items-center justify-between">
                <Field>Default</Field>
                <ColorPalette
                  initialColor={defalutColor}
                  updateColor={changeDefalutColor}
                />
              </div>
              <div className=" flex flex-col gap-2 overflow-auto max-h-[300px] ">
                {currentValues.map((value, index) => (
                  <div
                    className="flex items-center group pl-2 gap-2 "
                    key={value[0]}
                  >
                    <div className="w-[60px] flex items-center gap-2 ">
                      <Button
                        variant={"outline"}
                        className="opacity-100  size-6 p-0 group-hover:bg-accent "
                        onClick={removeCategory}
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
                    <UniqueSelector
                      uniqueValues={trueUniqueValues}
                      initialSelection={value[0]}
                      updateSelection={(value) => {
                        setCurrentValues((pre) => {
                          return pre.toSpliced(index, 1, value);
                        });
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-end gap-2">
                <Button
                  variant={"outline"}
                  className="text-pink-500"
                  //   disabled={uniqueValues.length <= currentValues.length}
                  onClick={addCategory}
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
          categoryCount={categoryCount}
          initialSelection={currentColorPalette}
          updateSelection={changeColorPalette}
        />
      </div>
    </div>
  );
}

export default ColorField;
