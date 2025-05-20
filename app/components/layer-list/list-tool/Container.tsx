"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import React from "react";
import InspectLayerCard from "./InspectLayerCard";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";

export function InspectContainer({
  inspectLayers
}: {
  inspectLayers: string[];
}) {
  const {
    setNodeRef,
    attributes,
    isDragging,
    listeners,
    transform,
    transition
  } = useSortable({
    id: "Inspected",
    data: { type: "container", arr: inspectLayers }
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform)
  };
  return (
    <ScrollArea
      style={style}
      ref={setNodeRef}
      className={cn(
        "h-72 rounded-lg bg-sky-100",
        isDragging && "opacity-50 border-2 border-dashed border-sky-500"
      )}
    >
      <div className="flex flex-col gap-2 p-4">
        <h1 className="text-pink-500 " {...listeners} {...attributes}>
          Inspected
        </h1>
        <SortableContext items={inspectLayers}>
          {inspectLayers?.map((layer) => (
            <InspectLayerCard type={"inspect"} key={layer} name={layer} />
          ))}
        </SortableContext>
      </div>
    </ScrollArea>
  );
}

export function NoInspectContainer({
  noInspectLayers
}: {
  noInspectLayers: string[];
}) {
  const {
    setNodeRef,
    attributes,
    isDragging,
    listeners,
    transform,
    transition
  } = useSortable({
    id: "Uninspected",
    data: { type: "container", arr: noInspectLayers }
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform)
  };

  return (
    <ScrollArea
      style={style}
      ref={setNodeRef}
      className={cn(
        "h-72 rounded-lg bg-sky-100",
        isDragging && "opacity-50 border-2 border-dashed border-sky-500"
      )}
    >
      <div className="flex flex-col gap-2  p-4">
        <h1 className="text-pink-500 " {...listeners} {...attributes}>
          Uninspected
        </h1>

        <SortableContext items={noInspectLayers}>
          {noInspectLayers?.map((layer) => (
            <InspectLayerCard type={"noInspect"} key={layer} name={layer} />
          ))}
        </SortableContext>
      </div>
    </ScrollArea>
  );
}

export function ContainerOverlay({
  arr,
  name
}: {
  arr: string[];
  name: string;
}) {
  return (
    <div className=" h-72 bg-sky-100 rounded-lg cursor-pointer">
      <div className="flex flex-col gap-2  p-4">
        <h1 className="text-pink-500 ">{name}</h1>

        {arr?.map((item) => (
          <InspectLayerCard type={"noInspect"} key={item} name={item} />
        ))}
      </div>
    </div>
  );
}
