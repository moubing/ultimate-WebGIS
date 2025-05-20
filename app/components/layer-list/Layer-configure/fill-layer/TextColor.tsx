"use client";

import {
  CurrentLayerContext,
  MapLayersContext,
  SetMapLayersContext
} from "@/app/providers/contexts";
import ColorPalette from "@/components/custom-ui/ColorPalette";
import { prefixSymbol } from "@/lib/constants";
import { MapLayer } from "@/lib/types";
import { SymbolLayerSpecification } from "maplibre-gl";
import { useCallback, useContext, useMemo } from "react";
import { Field } from "../../layer-configure-com/Labels";

function TextColor() {
  const setMapLayers = useContext(SetMapLayersContext);
  const currentLayer = useContext(CurrentLayerContext) as MapLayer;
  const mapLayers = useContext(MapLayersContext);

  const symbolLayer = useMemo(() => {
    return mapLayers.find(
      (layer) => layer.id === prefixSymbol + currentLayer.id
    );
  }, [mapLayers, currentLayer]);

  const changeTextColor = useCallback(
    (textColor: string) => {
      setMapLayers((pre) => {
        return pre.map((layer) => {
          if (prefixSymbol + currentLayer.id === layer.id) {
            return {
              ...layer,
              paint: {
                ...layer.paint,
                "text-color": textColor
              }
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
      <Field>Color</Field>
      <ColorPalette
        updateColor={changeTextColor}
        initialColor={
          (symbolLayer as SymbolLayerSpecification)!.paint![
            "text-color"
          ] as string
        }
      />
    </div>
  );
}

export default TextColor;
