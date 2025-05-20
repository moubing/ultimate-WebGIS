"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { customColors } from "@/lib/constants";
import { cn } from "@/lib/utils";
import _ from "lodash";
import { ChevronDown, X } from "lucide-react";
import { memo, useEffect, useMemo, useState } from "react";
import { HexAlphaColorPicker, HexColorInput } from "react-colorful";

const ColorPalette = memo(function ColorPalette({
  initialColor,
  side = "left",
  sideOffset = 125,
  updateColor,
  className = "w-[70%]",
  align = "center",
  type = "button"
}: {
  initialColor?: string;
  side?: "left" | "top" | "bottom" | "right";
  align?: "start" | "end" | "center";
  sideOffset?: number;
  className?: string;
  updateColor: (fillColor: string) => void;
  type?: "button" | "square";
}) {
  const [open, setOpen] = useState(false);
  const [color, setColor] = useState(initialColor || "#aabbcc");

  const deboundedUpdateColor = useMemo(() => {
    return _.debounce(updateColor, 100);
  }, [updateColor]);

  useEffect(() => {
    if (initialColor) setColor(initialColor);
  }, [initialColor]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {type === "button" && (
        <PopoverTrigger asChild>
          <Button
            className={cn(
              " flex items-center justify-between pr-3 bg-transparent",
              className
            )}
            variant={"outline"}
          >
            <div className="flex items-center gap-2">
              <div
                className="size-5 rounded-md cursor-pointer "
                style={{ backgroundColor: color }}
              />
              {color}
            </div>
            <ChevronDown className="size-4 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
      )}
      {type === "square" && (
        <PopoverTrigger>
          <div
            className="size-5 rounded-md cursor-pointer ring-1 ring-slate-500 ring-offset-1 "
            style={{ backgroundColor: color }}
          />
        </PopoverTrigger>
      )}
      <PopoverContent
        className="custom-pointers bg-background/10 backdrop-blur-md p-0 rounded-lg"
        side={side}
        sideOffset={sideOffset}
        align={align}
      >
        <div className="flex flex-col gap-2 bg-background/80 dark:bg-background/90 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <h1>Color palette</h1>
            <Button
              variant={"ghost"}
              size={"icon"}
              onClick={() => setOpen(false)}
            >
              <X className="size-5" />
            </Button>
          </div>
          <div className="grid grid-cols-7 grid-rows-3 gap-y-2 justify-items-center ">
            {customColors.map((color) => (
              <div
                className="size-5 rounded-md cursor-pointer ring-1 ring-slate-500 ring-offset-1"
                style={{ backgroundColor: color }}
                key={color}
                onClick={() => {
                  setColor(color);
                  deboundedUpdateColor(color);
                }}
              />
            ))}
          </div>
          <HexAlphaColorPicker
            color={color}
            onChange={(color) => {
              setColor(color);
              deboundedUpdateColor(color);
            }}
          />
          <div className="flex items-center  justify-between">
            <h1 className="text-sm text-muted-foreground">Hex color input:</h1>
            <HexColorInput
              className="flex h-9 w-[50%] rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              prefixed
              color={color}
              onChange={(color) => {
                setColor(color);
                deboundedUpdateColor(color);
              }}
              alpha
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
});

export default ColorPalette;
