"use client";

import {
  CurrentLayerContext,
  MapLayersContext,
} from "@/app/providers/contexts";
import { MapLayer } from "@/lib/types";
import { useContext, useMemo } from "react";
import AddStroke from "./AddStroke";
import StrokeColor from "./StrokeColor";
import StrokeWidth from "./StrokeWidth";
import StrokOpacity from "./StrokeOpacity";
import StrokeDash from "./StrokeDash";

function Stroke() {
  const currentLayer = useContext(CurrentLayerContext) as MapLayer;
  const mapLayers = useContext(MapLayersContext);

  const isExistStroke = useMemo(() => {
    let boolean = false;
    mapLayers.forEach((layer) => {
      if (layer.id === "STROK-" + currentLayer.id) boolean = true;
    });
    return boolean;
  }, [mapLayers, currentLayer]);

  return isExistStroke ? (
    <div className="flex flex-col gap-2">
      <StrokeColor />
      <StrokeWidth />

      <StrokOpacity />
      <StrokeDash />
    </div>
  ) : (
    <AddStroke />
  );
}

export default Stroke;
