"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useMap } from "react-map-gl/maplibre";

type speed = "very slow" | "slow" | "normal" | "fast" | "very fast";

const speedMap: { [key in speed]: number } = {
  "very slow": 1 / 800,
  slow: 1 / 600,
  normal: 1 / 450,
  fast: 1 / 250,
  "very fast": 1 / 100,
} as const;

function ScrollZoom() {
  const [value, setValue] = useState<speed>("normal");
  const { mainMap } = useMap();

  return (
    <Select
      value={value}
      onValueChange={(value: speed) => {
        setValue(value);
        if (mainMap) {
          mainMap.getMap().scrollZoom.setWheelZoomRate(speedMap[value]);
        }
      }}
    >
      <SelectTrigger className="w-[110px] ring-2 px-2 py-1 h-7 ring-zinc-400 focus:ring-zinc-500 focus:ring-2 ">
        <SelectValue placeholder="Select a zoom speed" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Zoom speed</SelectLabel>
          <SelectItem value="very slow">very slow</SelectItem>
          <SelectItem value="slow">slow</SelectItem>
          <SelectItem value="normal">normal</SelectItem>
          <SelectItem value="fast">fast</SelectItem>
          <SelectItem value="very fast">very fast</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default ScrollZoom;
