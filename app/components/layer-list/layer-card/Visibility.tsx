"use client";

import { SetMapLayersContext } from "@/app/providers/contexts";
import {
  ContextMenuCheckboxItem,
  ContextMenuShortcut
} from "@/components/ui/context-menu";
import { MapLayer } from "@/lib/types";
import { memo, useCallback, useContext, useState } from "react";

const Visibility = memo(function Visibility({ layer }: { layer: MapLayer }) {
  const [isVisible, setIsVisible] = useState(() => {
    const initialState = layer.layout?.visibility === "visible" ? true : false;
    return initialState;
  });
  const setMapLayers = useContext(SetMapLayersContext);

  const handleClick = useCallback(() => {
    setMapLayers((pre) => {
      return pre.map((item) => {
        if (layer.id === item.id) {
          return {
            ...item,
            layout: {
              visibility: isVisible ? "none" : "visible"
            }
          } as unknown as MapLayer;
        }
        return item;
      });
    });
  }, [setMapLayers, isVisible, layer.id]);

  return (
    <ContextMenuCheckboxItem
      checked={isVisible}
      onCheckedChange={(value: boolean) => {
        setIsVisible(value);
        handleClick();
      }}
    >
      Visibility
      <ContextMenuShortcut>⌘⇧B</ContextMenuShortcut>
    </ContextMenuCheckboxItem>
  );
});
export default Visibility;
