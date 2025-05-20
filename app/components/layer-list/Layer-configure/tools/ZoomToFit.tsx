"use client";

import { CurrentLayerContext } from "@/app/providers/contexts";
import CustomTooltip from "@/components/custom-ui/CustomTooltip";
import { Button } from "@/components/ui/button";
import { layerBounds } from "@/lib/constants";
import { MapLayer } from "@/lib/types";
import { ScanSearch } from "lucide-react";
import { memo, useCallback, useContext } from "react";
import { useMap } from "react-map-gl/maplibre";

const ZoomToFit = memo(function ZoomToFit() {
  const currentLayer = useContext(CurrentLayerContext);
  const { mainMap } = useMap();
  const handleClick = useCallback(() => {
    const bounds = layerBounds[(currentLayer as MapLayer).source as string];
    mainMap?.getMap().fitBounds(bounds, {
      padding: 100,
      linear: true,
      duration: 0
    });
  }, [currentLayer, mainMap]);

  return (
    <CustomTooltip content="Zoom to fit">
      <Button variant={"ghost"} size={"icon"} onClick={handleClick}>
        <ScanSearch className="size-5" />
      </Button>
    </CustomTooltip>
  );
});

export default ZoomToFit;
