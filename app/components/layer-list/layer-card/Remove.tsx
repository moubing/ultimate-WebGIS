"use client";

import {
  CurrentLayerContext,
  SetCurrentLayerContext,
  SetDeckLayersContext,
  SetMapLayersContext
} from "@/app/providers/contexts";
import {
  ContextMenuItem,
  ContextMenuShortcut
} from "@/components/ui/context-menu";
import { determineLayerType } from "@/lib/typeGarud";
import { DeckLayer, MapLayer } from "@/lib/types";
import { useCallback, useContext } from "react";

function Remove({ layer }: { layer: MapLayer }) {
  const setDeckLayers = useContext(SetDeckLayersContext);
  const setMapLayers = useContext(SetMapLayersContext);
  const currentLayer = useContext(CurrentLayerContext);
  const setCurrentLayer = useContext(SetCurrentLayerContext);

  const handleClick = useCallback(() => {
    const currentLayerResult = determineLayerType(currentLayer);
    if (currentLayerResult === "MapLayer") {
      if ((currentLayer as MapLayer).id === layer.id) {
        setCurrentLayer(null);
      }
    }
    if (currentLayerResult === "DeckLayer") {
      if ((currentLayer as DeckLayer).id === layer.id) {
        setCurrentLayer(null);
      }
    }

    const layerResult = determineLayerType(layer);
    if (layerResult === "MapLayer") {
      setMapLayers((pre) => pre.filter((item) => layer.id !== item.id));
    }

    if (layerResult === "DeckLayer") {
      setDeckLayers((pre) => pre.filter((item) => layer.id !== item.id));
    }
  }, [setMapLayers, layer, currentLayer, setCurrentLayer, setDeckLayers]);

  return (
    <ContextMenuItem inset onClick={handleClick}>
      Remove
      <ContextMenuShortcut>⌘R</ContextMenuShortcut>
    </ContextMenuItem>
  );
}

export default Remove;
