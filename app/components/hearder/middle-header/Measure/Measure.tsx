"use client";

import { SetCurrentLayerContext } from "@/app/providers/contexts";
import CustomTooltip from "@/components/custom-ui/CustomTooltip";
import {
  DropdownMenuItem,
  DropdownMenuShortcut
} from "@/components/ui/dropdown-menu";
import { Ruler } from "lucide-react";
import Image from "next/image";
import React, { useContext } from "react";

function Measure() {
  const setCurrentLayer = useContext(SetCurrentLayerContext);

  return (
    <CustomTooltip
      delayDuration={0}
      side="right"
      sideOffset={17}
      align="start"
      content={
        <div className="p-1 flex flex-col gap-2  ">
          <Image
            className="w-[203px] h-[114px] rounded-md object-cover ring-2 dark:ring-pink-200 ring-zinc-200 object-center"
            height={228}
            width={406}
            alt="measure"
            src={"/image/measure.png"}
          />
          <h1 className="text-white dark:text-black w-[203px] ">
            Allow viewers to measure boardsdistance and area
          </h1>
        </div>
      }
    >
      <DropdownMenuItem
        className="flex relative items-center justify-between"
        onSelect={() => {
          setCurrentLayer("Measure");
        }}
      >
        <Ruler /> Measure
        <DropdownMenuShortcut></DropdownMenuShortcut>
      </DropdownMenuItem>
    </CustomTooltip>
  );
}

export default Measure;
