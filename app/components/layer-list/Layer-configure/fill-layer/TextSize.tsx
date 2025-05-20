"use client";

import {
  CurrentLayerContext,
  MapLayersContext,
  SetMapLayersContext,
} from "@/app/providers/contexts";
import CustomSelect from "@/components/custom-ui/CustomSelect";
import { prefixSymbol } from "@/lib/constants";
import { MapLayer } from "@/lib/types";
import { SymbolLayerSpecification } from "maplibre-gl";
import { useCallback, useContext, useMemo } from "react";
import { Field } from "../../layer-configure-com/Labels";

const textSizeArr = ["xs", "sm", "base", "lg", "xl", "2xl"] as const;
type textSizeType = (typeof textSizeArr)[number];
const textSizeMap: { [key in textSizeType]: number | undefined } = {
  xs: 8,
  sm: 12,
  base: 14,
  lg: 16,
  xl: 20,
  "2xl": 24,
};

function TextSize() {
  const setMapLayers = useContext(SetMapLayersContext);
  const currentLayer = useContext(CurrentLayerContext) as MapLayer;

  const mapLayers = useContext(MapLayersContext);

  const currentSelection = useMemo(() => {
    const symbolLayer = mapLayers.find(
      (layer) => layer.id === prefixSymbol + currentLayer.id
    );

    const value = (symbolLayer as SymbolLayerSpecification)!.layout![
      "text-size"
    ] as number | undefined;

    if (!value) return "none";

    const currnetKey = Object.keys(textSizeMap).find((key) => {
      const resValue = textSizeMap[key as textSizeType] as number;
      if (resValue === value) return true;
      return false;
    });

    return currnetKey as textSizeType;
  }, [mapLayers, currentLayer]);

  const changeTextSize = useCallback(
    (textSize: string) => {
      setMapLayers((pre) => {
        return pre.map((layer) => {
          if (prefixSymbol + currentLayer.id === layer.id) {
            return {
              ...layer,
              layout: {
                ...layer.layout,
                "text-size": textSizeMap[textSize as textSizeType],
              },
            } as SymbolLayerSpecification;
          }
          return layer;
        });
      });
    },
    [currentLayer, setMapLayers]
  );
  return (
    <div className="flex items-center justify-between">
      <Field>Size</Field>

      <CustomSelect
        arr={[...textSizeArr]}
        initialSelection={currentSelection}
        updateSelection={changeTextSize}
      />
    </div>
  );
}

export default TextSize;
