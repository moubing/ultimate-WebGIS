"use client";

import {
  CurrentLayerContext,
  SetMapLayersContext,
} from "@/app/providers/contexts";
import CustomSlider from "@/components/custom-ui/CustomSlider";
import { MapLayer } from "@/lib/types";
import { FillLayerSpecification } from "maplibre-gl";
import { useCallback, useContext } from "react";
import { Field } from "../../layer-configure-com/Labels";

function Opacity() {
  const currentLayer = useContext(
    CurrentLayerContext
  ) as FillLayerSpecification;

  const setMapLayers = useContext(SetMapLayersContext);

  const changeOpacity = useCallback(
    (opacity: number) => {
      setMapLayers((pre) => {
        const newMapLayers = pre.map((layer) => {
          if ((currentLayer as MapLayer).id === layer.id) {
            return {
              ...layer,
              paint: {
                ...layer.paint,
                "fill-opacity": opacity,
              },
            } as FillLayerSpecification;
          }
          return layer;
        });
        return newMapLayers;
      });
    },
    [setMapLayers, currentLayer]
  );

  return (
    <div className="flex items-center justify-between">
      <Field>Opacity</Field>

      <CustomSlider
        updateOpacity={changeOpacity}
        initialOpacity={currentLayer.paint!["fill-opacity"] as number}
      />
    </div>
  );
}

export default Opacity;
