"use client";

import React, { useCallback, useContext, useMemo } from "react";
import { Field } from "../../layer-configure-com/Labels";
import CustomSlider from "@/components/custom-ui/CustomSlider";
import {
  CurrentLayerContext,
  MapLayersContext,
  SetMapLayersContext,
} from "@/app/providers/contexts";
import { FillLayerSpecification, LineLayerSpecification } from "maplibre-gl";
import { prefixStroke } from "@/lib/constants";

function StrokOpacity() {
  const currentLayer = useContext(
    CurrentLayerContext
  ) as FillLayerSpecification;
  const setMapLayers = useContext(SetMapLayersContext);
  const mapLayers = useContext(MapLayersContext);

  const strokeLayer = useMemo(() => {
    return mapLayers.find(
      (layer) => layer.id === prefixStroke + currentLayer.id
    );
  }, [mapLayers, currentLayer]);

  const changeStrokeWidth = useCallback(
    (strokeOpacity: number) => {
      setMapLayers((pre) => {
        return pre.map((layer) => {
          if (prefixStroke + currentLayer.id === layer.id) {
            return {
              ...layer,
              paint: {
                ...layer.paint,
                "line-opacity": strokeOpacity,
              },
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
      <Field>Opacity</Field>
      <CustomSlider
        updateOpacity={changeStrokeWidth}
        initialOpacity={
          (strokeLayer as LineLayerSpecification)!.paint![
            "line-opacity"
          ] as number
        }
      />
    </div>
  );
}

export default StrokOpacity;
