"use client";

import React, { useContext, useMemo } from "react";
import { Field } from "../../layer-configure-com/Labels";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  CurrentLayerContext,
  SetMapLayersContext
} from "@/app/providers/contexts";
import { LineLayerSpecification, useMap } from "react-map-gl/maplibre";
import { MapLayer } from "@/lib/types";
import { prefixStroke } from "@/lib/constants";
import chroma from "chroma-js";

function AddStroke() {
  const currentLayer = useContext(CurrentLayerContext) as MapLayer;
  const { mainMap } = useMap();
  const setMapLayers = useContext(SetMapLayersContext);

  const currentSource = useMemo(() => {
    return mainMap?.getMap().getLayer(currentLayer.id)!.source;
  }, [mainMap, currentLayer]);

  return (
    <div className="flex items-center justify-between">
      <Field>No Stroke</Field>
      <Button
        variant={"outline"}
        className="text-pink-500 flex gap-0.5 hover:text-pink-500"
        onClick={() => {
          setMapLayers((pre) => {
            return [
              ...pre,
              {
                id: prefixStroke + currentLayer.id,
                source: currentSource,
                type: "line",
                paint: {
                  "line-color": chroma.random().hex(),
                  "line-opacity": 0.5,
                  "line-width": 4
                },
                layout: {
                  visibility: "visible",
                  "line-cap": "round",
                  "line-join": "round"
                }
              } as LineLayerSpecification
            ];
          });
        }}
      >
        <Plus className="size-4" />
        ADD
      </Button>
    </div>
  );
}

export default AddStroke;
