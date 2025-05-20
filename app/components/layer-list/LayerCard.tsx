"use client";

import { SetCurrentLayerContext } from "@/app/providers/contexts";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger
} from "@/components/ui/context-menu";
import { layerIconMap } from "@/lib/layerIconMap";
import { DeckLayer, layerTypeId, MapLayer } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CircleHelp, Eye, MoreHorizontal } from "lucide-react";
import { memo, useContext, useMemo } from "react";
import Remove from "./layer-card/Remove";
import ViewTable from "./layer-card/ViewTable";
import Visibility from "./layer-card/Visibility";
import ZoomToFit from "./layer-card/ZoomToFit";

// todo 以后这个组件有较大的变化，因为它有很多种情况，比如说它所代表的图层，不同的图层就会有不同的样式，就比如这个附属图层应该与原图层有某种样式上的联动，让人知道这个附属图层是附属于那个图层的

const LayerCard = memo(function LayerCard({
  layer
}: {
  layer: DeckLayer | MapLayer;
}) {
  // const inspectLayers = useContext(InspectLayersContext);
  // const isInspected = useMemo(() => {
  //   return inspectLayers.includes(layer.id);
  // }, [inspectLayers, layer.id]);

  const {
    setNodeRef,
    attributes,
    isDragging,
    listeners,
    transform,
    transition
  } = useSortable({ id: layer.id, data: layer });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform)
  };

  const setCurrentLayer = useContext(SetCurrentLayerContext);
  const layerType = useMemo(() => {
    if (!layer) {
      return null;
    } else if ("paint" in layer) {
      return layer.type;
    } else {
      return layer.constructor.layerName as layerTypeId;
    }
  }, [layer]);
  const Icon = useMemo(() => {
    if (layerType) {
      if (layerIconMap[layerType]) return layerIconMap[layerType];
    }
    return CircleHelp;
  }, [layerType]);

  return (
    <ContextMenu modal={false}>
      <ContextMenuTrigger asChild>
        <Card
          onClick={() => {
            setCurrentLayer(layer);
          }}
          className={cn(
            "h-12 p-2 cursor-pointer  flex items-center justify-between group bg-transparent",
            isDragging && "opacity-50 outline-2 outline-dashed outline-sky-500"
          )}
          ref={setNodeRef}
          style={style}
          {...listeners}
          {...attributes}
        >
          <div className="truncate w-[70%] flex items-center justify-start gap-2">
            <Icon className="size-5 text-zinc-500" /> {layer.id}
          </div>
          <div className=" opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all">
            <Button className="p-0.5" variant={"ghost"} size={"icon"}>
              <MoreHorizontal className="size-4" />
            </Button>
            <Button className="p-0.5" variant={"ghost"} size={"icon"}>
              <Eye className="size-4" />
            </Button>
          </div>
        </Card>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64 ">
        <ZoomToFit layer={layer as MapLayer} />
        <ContextMenuSeparator />
        <ViewTable layer={layer as MapLayer} />
        <Remove layer={layer as MapLayer} />
        <Visibility layer={layer as MapLayer} />
        <ContextMenuSub>
          <ContextMenuSubTrigger inset>More Tools</ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem>
              Save Page As...
              <ContextMenuShortcut>⇧⌘S</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>Create Shortcut...</ContextMenuItem>
            <ContextMenuItem>Name Window...</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem>Developer Tools</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuCheckboxItem checked>
          Inspect
          <ContextMenuShortcut>⌘⇧B</ContextMenuShortcut>
        </ContextMenuCheckboxItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger inset>Export</ContextMenuSubTrigger>
          <ContextMenuSubContent sideOffset={10} className="w-48 ">
            <ContextMenuRadioGroup>
              {["flyTo", "easeTo", "jumpTo"].map((value) => (
                <ContextMenuRadioItem
                  key={value}
                  value={value}
                  className=" capitalize"
                >
                  {value}
                </ContextMenuRadioItem>
              ))}
            </ContextMenuRadioGroup>
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuContent>
    </ContextMenu>
  );
});

export default LayerCard;

export function LayerCardOverlay({ layer }: { layer: DeckLayer | MapLayer }) {
  return (
    <Card
      className={cn(
        "h-12 p-2 cursor-pointer flex items-center justify-between group"
      )}
    >
      <div className="">🥳 {layer.id}</div>
      <div className="hidden">
        <Button className="p-0.5" variant={"ghost"} size={"icon"}>
          <MoreHorizontal className="size-4" />
        </Button>
        <Button className="p-0.5" variant={"ghost"} size={"icon"}>
          <Eye className="size-4" />
        </Button>
      </div>
    </Card>
  );
}
