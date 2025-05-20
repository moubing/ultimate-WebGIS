"use client";

import {
  CurrentLayerContext,
  MapLayersContext,
  SetMapLayersContext
} from "@/app/providers/contexts";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import chroma from "chroma-js";
import { Palette } from "lucide-react";
import { FillLayerSpecification } from "maplibre-gl";
import { useContext, useEffect, useMemo, useState } from "react";
import { Field, Header } from "../layer-configure-com/Labels";
import CategoryFill from "./fill-layer/CategoryFill";
import ColorRangeFill from "./fill-layer/ColorRangeFill";
import SimpleFill from "./fill-layer/SimpleFill";
import Stroke from "./fill-layer/Stroke";
import Symbol from "./fill-layer/Symbol";

type fillType = "Simple" | "Category" | "ColorRange" | "Heat";

function CircleLayerConfigure() {
  const [selectedType, setSelectedType] = useState<fillType>("Simple");
  const currentLayer = useContext(
    CurrentLayerContext
  ) as FillLayerSpecification;
  const mapLayers = useContext(MapLayersContext);

  const setMapLayers = useContext(SetMapLayersContext);
  const tureCurrentLayer = useMemo(() => {
    return mapLayers.find((layer) => layer.id === currentLayer.id);
  }, [mapLayers, currentLayer]);

  useEffect(() => {
    const value = (tureCurrentLayer as FillLayerSpecification)!.paint![
      "fill-color"
    ];
    if (typeof value === "string") {
      setSelectedType("Simple");
    } else if (Array.isArray(value) && value[0] === "match") {
      setSelectedType("Category");
    } else {
      setSelectedType("ColorRange");
    }
  }, [currentLayer, tureCurrentLayer]);

  return (
    <ScrollArea className="h-[550px] pr-6">
      <div className="flex flex-col gap-2">
        <Header>General</Header>
        <div className="flex items-center justify-between">
          <Field>Type</Field>
          <Select
            value={selectedType}
            onValueChange={(value: fillType) => {
              setSelectedType(value);
              if (value === "Simple") {
                setMapLayers((pre) => {
                  return pre.map((layer) => {
                    if (layer.id === currentLayer.id) {
                      return {
                        ...layer,
                        paint: {
                          ...layer.paint,
                          "fill-color": chroma.random().hex()
                        }
                      } as FillLayerSpecification;
                    }
                    return layer;
                  });
                });
              }
            }}
          >
            <SelectTrigger className="w-[70%]">
              <div className="flex items-center gap-2">
                <Palette /> {selectedType}
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Simple">Simple</SelectItem>
              <SelectItem value="Category">Category</SelectItem>
              <SelectItem value="ColorRange">ColorRange</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {selectedType === "Simple" && <SimpleFill />}
        {selectedType === "Category" && <CategoryFill />}
        {selectedType === "ColorRange" && <ColorRangeFill />}
        <Separator />
        <Header>Storke</Header>
        <Stroke />
        <Separator />
        <Header>Symbol</Header>
        <Symbol />
      </div>
    </ScrollArea>
  );
}

export default CircleLayerConfigure;
