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

function Contrast() {
  const setMapLayers = useContext(SetMapLayersContext);
  const currentLayer = useContext(CurrentLayerContext) as MapLayer;

  const changeTextHaloWidth = useCallback(
    (contrast: number) => {
      setMapLayers((pre) => {
        return pre.map((layer) => {
          if (currentLayer.id === layer.id) {
            return {
              ...layer,
              paint: {
                ...layer.paint,
                "raster-contrast": contrast
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
      <Field>Contrast</Field>
      <CustomSlider
        min={-1}
        max={1}
        step={0.01}
        updateOpacity={changeTextHaloWidth}
        initialOpacity={
          ((currentLayer as RasterLayerSpecification)?.paint?.[
            "raster-contrast"
          ] as number) || 0
        }
      />
    </div>
  );
}

export default Contrast;
