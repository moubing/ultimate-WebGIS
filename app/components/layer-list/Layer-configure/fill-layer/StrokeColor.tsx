"use client";

import {
  CurrentLayerContext,
  MapLayersContext,
  SetMapLayersContext
} from "@/app/providers/contexts";
import ColorPalette from "@/components/custom-ui/ColorPalette";
import { prefixStroke } from "@/lib/constants";
import { MapLayer } from "@/lib/types";
import { LineLayerSpecification } from "maplibre-gl";
import { useCallback, useContext, useMemo } from "react";
import { Field } from "../../layer-configure-com/Labels";

function StrokeColor() {
  const setMapLayers = useContext(SetMapLayersContext);
  const currentLayer = useContext(CurrentLayerContext) as MapLayer;
  const mapLayers = useContext(MapLayersContext);

  const strokeLayer = useMemo(() => {
    return mapLayers.find(
      (layer) => layer.id === prefixStroke + currentLayer.id
    );
  }, [mapLayers, currentLayer]);

  const changeStrokeColor = useCallback(
    (strokeColor: string) => {
      setMapLayers((pre) => {
        return pre.map((layer) => {
          if (prefixStroke + currentLayer.id === layer.id) {
            return {
              ...layer,
              paint: {
                ...layer.paint,
                "line-color": strokeColor
              }
            } as LineLayerSpecification;
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
        updateColor={changeStrokeColor}
        initialColor={
          (strokeLayer as LineLayerSpecification)!.paint![
            "line-color"
          ] as string
        }
      />
    </div>
  );
}

export default StrokeColor;
