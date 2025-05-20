"use client";

import React, { useContext, useEffect, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
  CurrentLayerContext,
  SetCurrentLayerContext
} from "@/app/providers/contexts";
import { otherConfigure } from "@/lib/types";
import { Field } from "./Labels";

const transformArr = [
  "Bounding",
  "Buffer",
  "Centroid",
  "Disslove",
  "BezierSpline",
  "Simplify",
  "Explode",
  "Dbscan",
  "Kmeans",
  "Concave",
  "Convex",
  "Voronoi",
  "Interpolate",
  "TIN",
  "RandomPolygon",
  "RandomPoint",
  "RandomLineString",
  "Sample",
  "Difference",
  "PointsWithinPolygon",
  "Intersect",
  "Tag",
  "Collect"
];

function SearchTransform() {
  const [open, setOpen] = useState(false);

  const currentLayerObject = useContext(CurrentLayerContext);
  const setCurrentLayerObject = useContext(SetCurrentLayerContext);

  useEffect(() => {
    const handleChangeTransform = (e: KeyboardEvent) => {
      if (e.key === "i" && e.ctrlKey) {
        setOpen((pre) => !pre);
      }
    };
    document.addEventListener("keydown", handleChangeTransform);

    return () => {
      document.removeEventListener("keydown", handleChangeTransform);
    };
  });
  return (
    <div className="pr-6 flex items-center justify-between">
      <Field>Quick change</Field>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className=" w-[60%] flex items-center justify-between bg-transparent"
          >
            {currentLayerObject ? (
              <>{currentLayerObject}</>
            ) : (
              <div className="text-muted-foreground">Select value</div>
            )}
            <ChevronDown className="size-4 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="end">
          <Command>
            <CommandInput placeholder="Search unique value..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {transformArr.map((item) => (
                  <CommandItem
                    key={item}
                    value={item}
                    onSelect={() => {
                      setCurrentLayerObject(item as otherConfigure);
                      setOpen(false);
                    }}
                  >
                    <h1>{item}</h1>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default SearchTransform;
