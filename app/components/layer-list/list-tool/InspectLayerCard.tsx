"use client";

import { useSortable } from "@dnd-kit/sortable";
import React from "react";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";

function InspectLayerCard({
  name,
  type
}: {
  name: string;
  type: "inspect" | "noInspect";
}) {
  const {
    setNodeRef,
    attributes,
    isDragging,
    listeners,
    transform,
    transition
  } = useSortable({ id: name, data: { type } });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform)
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className={cn(
        "p-2 bg-white shadow  rounded-md text-sm truncate w-[158px] ",
        isDragging && "opacity-50 outline-2 outline-dashed outline-sky-500"
      )}
    >
      {name}
    </div>
  );
}

export default InspectLayerCard;

export function InspectLayerCardOverlay({ name }: { name: string }) {
  return (
    <div
      className={cn(
        "p-2  bg-white shadow   rounded-md cursor-pointer text-sm truncate"
      )}
    >
      {name}
    </div>
  );
}
