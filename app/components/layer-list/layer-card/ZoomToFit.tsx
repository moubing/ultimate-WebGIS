"use client";

import {
  ContextMenuItem,
  ContextMenuShortcut
} from "@/components/ui/context-menu";
import { layerBounds } from "@/lib/constants";
import { fitOption, MapLayer } from "@/lib/types";
import React, { memo, useCallback, useState } from "react";
import { useMap } from "react-map-gl/maplibre";
import { toast } from "sonner";
import FitOption from "./FitOption";
import { getFitOption, setFitOption } from "@/lib/variable";

const ZoomToFit = memo(function ZoomToFit({ layer }: { layer: MapLayer }) {
  const { mainMap } = useMap();
  const [selection, setSelection] = useState<fitOption>(getFitOption());

  const handleClick = useCallback(() => {
    if ((layer as MapLayer).source) {
      const bounds = layerBounds[(layer as MapLayer).source as string];
      if (selection === "jumpTo") {
        mainMap?.getMap().fitBounds(bounds, {
          padding: 100,
          linear: true,
          duration: 0
        });
      } else if (selection === "easeTo") {
        mainMap?.getMap().fitBounds(bounds, {
          padding: 100,
          linear: true
        });
      } else {
        mainMap?.getMap().fitBounds(bounds, {
          padding: 100
        });
      }
      toast.success(`zoom to ${layer.id}`);
    }
  }, [layer, mainMap, selection]);

  return (
    <>
      <ContextMenuItem inset onClick={handleClick}>
        Zoom to fit
        <ContextMenuShortcut>⌘[</ContextMenuShortcut>
      </ContextMenuItem>
      <FitOption
        selection={selection}
        setSelection={(value: string) => {
          setSelection(value as fitOption);
          setFitOption(value as fitOption);
        }}
      />
    </>
  );
});

export default ZoomToFit;
