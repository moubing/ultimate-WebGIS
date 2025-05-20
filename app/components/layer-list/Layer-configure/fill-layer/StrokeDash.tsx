"use client";

import {
  CurrentLayerContext,
  MapLayersContext,
  SetMapLayersContext,
} from "@/app/providers/contexts";
import CustomSelect from "@/components/custom-ui/CustomSelect";
import { prefixStroke } from "@/lib/constants";
import { FillLayerSpecification, LineLayerSpecification } from "maplibre-gl";
import { useCallback, useContext, useMemo } from "react";
import { Field } from "../../layer-configure-com/Labels";

const dashArr = ["none", "dense", "normal", "loose"] as const;
type dashArrType = (typeof dashArr)[number];
const dashArrayMap: { [key in dashArrType]: [number, number] | undefined } = {
  none: undefined,
  dense: [3, 3],
  normal: [5, 5],
  loose: [8, 8],
};

function StrokeDash() {
  const setMapLayers = useContext(SetMapLayersContext);
  const currentLayer = useContext(
    CurrentLayerContext
  ) as FillLayerSpecification;
  const mapLayers = useContext(MapLayersContext);

  const currentSelection = useMemo(() => {
    const strokeLayer = mapLayers.find(
      (layer) => layer.id === prefixStroke + currentLayer.id
    );

    const value = (strokeLayer as LineLayerSpecification)!.paint![
      "line-dasharray"
    ] as [number, number] | undefined;

    if (!value) return "none";

    const currnetKey = Object.keys(dashArrayMap).find((key) => {
      if (!dashArrayMap[key as dashArrType]) return false;
      const resValue = dashArrayMap[key as dashArrType] as [number, number];
      if (resValue[0] === value[0]) return true;
      return false;
    });
    return currnetKey as dashArrType;
  }, [mapLayers, currentLayer]);

  const changeStrokeDash = useCallback(
    (strokeDash: string) => {
      setMapLayers((pre) => {
        return pre.map((layer) => {
          if (prefixStroke + currentLayer.id === layer.id) {
            return {
              ...layer,
              paint: {
                ...layer.paint,
                "line-dasharray": dashArrayMap[strokeDash as dashArrType],
              },
            } as LineLayerSpecification;
          }
          return layer;
        });
      });
    },
    [setMapLayers, currentLayer]
  );

  return (
    <div className="flex items-center justify-between">
      <Field>Dash</Field>
      <CustomSelect
        initialSelection={currentSelection}
        arr={[...dashArr]}
        updateSelection={changeStrokeDash}
      />
    </div>
  );
}

export default StrokeDash;
