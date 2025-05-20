"use client";

import {
  CurrentLayerContext,
  SetMapLayersContext
} from "@/app/providers/contexts";
import CustomSlider from "@/components/custom-ui/CustomSlider";
import { MapLayer } from "@/lib/types";
import { RasterLayerSpecification } from "maplibre-gl";
import { useCallback, useContext } from "react";
import { Field } from "../../layer-configure-com/Labels";

function Opacity() {
  const setMapLayers = useContext(SetMapLayersContext);
  const currentLayer = useContext(CurrentLayerContext) as MapLayer;

  const changeTextHaloWidth = useCallback(
    (opacity: number) => {
      setMapLayers((pre) => {
        return pre.map((layer) => {
          if (currentLayer.id === layer.id) {
            return {
              ...layer,
              paint: {
                ...layer.paint,
                "raster-opacity": opacity
              }
            } as RasterLayerSpecification;
          }
          return layer;
        });
      });
    },
    [currentLayer, setMapLayers]
  );

  return (
    <div className="flex items-center justify-between pr-0.5">
      <Field>Opacity</Field>
      <CustomSlider
        min={0}
        max={1}
        step={0.01}
        updateOpacity={changeTextHaloWidth}
        initialOpacity={
          ((currentLayer as RasterLayerSpecification)?.paint?.[
            "raster-opacity"
          ] as number) || 1
        }
      />
    </div>
  );
}

export default Opacity;
