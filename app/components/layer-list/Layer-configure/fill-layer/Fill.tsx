"use client";

import {
  CurrentLayerContext,
  MapLayersContext,
  SetMapLayersContext
} from "@/app/providers/contexts";
import ColorPalette from "@/components/custom-ui/ColorPalette";
import { MapLayer } from "@/lib/types";
import { FillLayerSpecification } from "maplibre-gl";
import { useCallback, useContext, useMemo } from "react";
import { Field } from "../../layer-configure-com/Labels";

export function Fill() {
  const setMapLayers = useContext(SetMapLayersContext);
  const currentLayer = useContext(
    CurrentLayerContext
  ) as FillLayerSpecification;
  const mapLayers = useContext(MapLayersContext);

  const tureCurrentLayer = useMemo(() => {
    return mapLayers.find((layer) => layer.id === currentLayer.id);
  }, [mapLayers, currentLayer]);

  const changeFillColor = useCallback(
    (fillColor: string) => {
      setMapLayers((pre) => {
        return pre.map((layer) => {
          if ((currentLayer as MapLayer).id === layer.id) {
            return {
              ...layer,
              paint: {
                ...layer.paint,
                "fill-color": fillColor
              }
            } as FillLayerSpecification;
          }
          return layer;
        });
      });
    },
    [setMapLayers, currentLayer]
  );
  return (
    <div className="flex items-center justify-between">
      <Field>Fill</Field>
      <ColorPalette
        initialColor={
          (tureCurrentLayer as FillLayerSpecification)!.paint![
            "fill-color"
          ] as string
        }
        updateColor={changeFillColor}
      />
    </div>
  );
}
