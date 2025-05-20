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

function TextHaloColor() {
  const setMapLayers = useContext(SetMapLayersContext);
  const currentLayer = useContext(CurrentLayerContext) as MapLayer;
  const mapLayers = useContext(MapLayersContext);

  const symbolLayer = useMemo(() => {
    return mapLayers.find(
      (layer) => layer.id === prefixSymbol + currentLayer.id
    );
  }, [mapLayers, currentLayer]);

  const changeTextHaloColor = useCallback(
    (textHaloColor: string) => {
      setMapLayers((pre) => {
        return pre.map((layer) => {
          if (prefixSymbol + currentLayer.id === layer.id) {
            return {
              ...layer,
              paint: {
                ...layer.paint,
                "text-halo-color": textHaloColor
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
      <Field>Halo color</Field>
      <ColorPalette
        updateColor={changeTextHaloColor}
        initialColor={
          (symbolLayer as SymbolLayerSpecification)!.paint![
            "text-halo-color"
          ] as string
        }
      />
    </div>
  );
}

export default TextHaloColor;
