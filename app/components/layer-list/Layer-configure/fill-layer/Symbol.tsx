"use client";

import {
  CurrentLayerContext,
  MapLayersContext,
} from "@/app/providers/contexts";
import { prefixSymbol } from "@/lib/constants";
import { MapLayer } from "@/lib/types";
import React, { useContext, useMemo } from "react";
import AddSymbol from "./AddSymbol";
import TextField from "./TextField";
import TextSize from "./TextSize";
import TextColor from "./TextColor";
import TextHaloColor from "./TextHaloColor";
import TextHaloWidth from "./TextHaloWidth";

function Symbol() {
  const currentLayer = useContext(CurrentLayerContext) as MapLayer;
  const mapLayers = useContext(MapLayersContext);

  const isExistSymbol = useMemo(() => {
    let boolean = false;
    mapLayers.forEach((layer) => {
      if (layer.id === prefixSymbol + currentLayer.id) boolean = true;
    });
    return boolean;
  }, [mapLayers, currentLayer]);

  return isExistSymbol ? (
    <div className="flex flex-col gap-2">
      <TextField />
      <TextSize />
      <TextColor />
      <TextHaloColor />
      <TextHaloWidth />
    </div>
  ) : (
    <AddSymbol />
  );
}

export default Symbol;
