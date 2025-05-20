"use client";

import {
  CurrentLayerContext,
  MapLayersContext,
  SetMapLayersContext,
} from "@/app/providers/contexts";
import CustomSlider from "@/components/custom-ui/CustomSlider";
import { prefixSymbol } from "@/lib/constants";
import { MapLayer } from "@/lib/types";
import { SymbolLayerSpecification } from "maplibre-gl";
import { useCallback, useContext, useMemo } from "react";
import { Field } from "../../layer-configure-com/Labels";

function TextHaloWidth() {
  const setMapLayers = useContext(SetMapLayersContext);
  const currentLayer = useContext(CurrentLayerContext) as MapLayer;
  const mapLayers = useContext(MapLayersContext);

  const symbolLayer = useMemo(() => {
    return mapLayers.find(
      (layer) => layer.id === prefixSymbol + currentLayer.id
    );
  }, [mapLayers, currentLayer]);

  const changeTextHaloWidth = useCallback(
    (textHaloWidth: number) => {
      setMapLayers((pre) => {
        return pre.map((layer) => {
          if (prefixSymbol + currentLayer.id === layer.id) {
            return {
              ...layer,
              paint: {
                ...layer.paint,
                "text-halo-width": textHaloWidth,
              },
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
      <Field>Halo width</Field>
      <CustomSlider
        min={0}
        max={5}
        step={0.1}
        updateOpacity={changeTextHaloWidth}
        initialOpacity={
          (symbolLayer as SymbolLayerSpecification)!.paint![
            "text-halo-width"
          ] as number
        }
      />
    </div>
  );
}

export default TextHaloWidth;
