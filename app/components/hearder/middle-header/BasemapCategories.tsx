"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { BasemapClass } from "@/lib/types";
import React from "react";

export function BasemapCategories({
  currentBasemapClass,
  onValueChange,
}: {
  currentBasemapClass: BasemapClass;
  onValueChange: (value: string) => void;
}) {
  return (
    <ToggleGroup
      value={currentBasemapClass}
      onValueChange={onValueChange}
      type="single"
      orientation={"vertical"}
      className="flex flex-col"
    >
      <ToggleGroupItem
        className="w-full py-1 dark:data-[state=on]:bg-zinc-100 dark:data-[state=on]:text-zinc-700 data-[state=on]:bg-pink-100 data-[state=on]:text-pink-500 rounded-none"
        value="all"
      >
        All basemaps
      </ToggleGroupItem>
      <ToggleGroupItem
        className="w-full py-1 dark:data-[state=on]:bg-zinc-100 dark:data-[state=on]:text-zinc-700 data-[state=on]:bg-pink-100 data-[state=on]:text-pink-500 rounded-none"
        value="world"
      >
        World basemaps
      </ToggleGroupItem>
      <ToggleGroupItem
        className="w-full py-1 dark:data-[state=on]:bg-zinc-100 dark:data-[state=on]:text-zinc-700 data-[state=on]:bg-pink-100 data-[state=on]:text-pink-500 rounded-none"
        value="strict"
      >
        Strict basemaps
      </ToggleGroupItem>
      <ToggleGroupItem
        className="w-full py-1 dark:data-[state=on]:bg-zinc-100 dark:data-[state=on]:text-zinc-700 data-[state=on]:bg-pink-100 data-[state=on]:text-pink-500 rounded-none"
        value="vector"
      >
        Vector basemaps
      </ToggleGroupItem>
      <ToggleGroupItem
        className="w-full py-1 dark:data-[state=on]:bg-zinc-100 dark:data-[state=on]:text-zinc-700 data-[state=on]:bg-pink-100 data-[state=on]:text-pink-500 rounded-none"
        value="raster"
      >
        Raster basemaps
      </ToggleGroupItem>
      <ToggleGroupItem
        className="w-full py-1 dark:data-[state=on]:bg-zinc-100 dark:data-[state=on]:text-zinc-700 data-[state=on]:bg-pink-100 data-[state=on]:text-pink-500 rounded-none"
        value="satellite"
      >
        Satellite basemaps
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

export default BasemapCategories;
