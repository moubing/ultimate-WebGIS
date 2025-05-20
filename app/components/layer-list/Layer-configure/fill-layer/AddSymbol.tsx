"use client";

import {
  CurrentLayerContext,
  SetMapLayersContext
} from "@/app/providers/contexts";
import { Button } from "@/components/ui/button";
import { prefixSymbol } from "@/lib/constants";
import { MapLayer } from "@/lib/types";
import { Plus } from "lucide-react";
import { useContext, useMemo } from "react";
import { SymbolLayerSpecification, useMap } from "react-map-gl/maplibre";
import { Field } from "../../layer-configure-com/Labels";

function AddSymbol() {
  const currentLayer = useContext(CurrentLayerContext) as MapLayer;
  const { mainMap } = useMap();
  const setMapLayers = useContext(SetMapLayersContext);

  const currentSource = useMemo(() => {
    return mainMap?.getMap().getLayer(currentLayer.id)!.source;
  }, [mainMap, currentLayer]);

  return (
    <div className="flex items-center justify-between">
      <Field>No Symbol</Field>
      <Button
        variant={"outline"}
        className="text-pink-500 flex gap-0.5 hover:text-pink-500"
        onClick={() => {
          setMapLayers((pre) => {
            return [
              ...pre,
              {
                id: prefixSymbol + currentLayer.id,
                source: currentSource,
                type: "symbol",
                layout: {
                  "text-size": 14
                },
                paint: {
                  "text-color": "#333333",
                  "text-halo-color": "#ffffff",
                  "text-halo-width": 2
                }
              } as SymbolLayerSpecification
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

export default AddSymbol;
