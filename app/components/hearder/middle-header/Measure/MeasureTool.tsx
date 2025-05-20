"use client";

import CustomTooltip from "@/components/custom-ui/CustomTooltip";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Circle, MoreHorizontal, Trash2 } from "lucide-react";
import { BiShapePolygon } from "react-icons/bi";
import { IoAnalyticsOutline } from "react-icons/io5";
import { MdAdsClick } from "react-icons/md";
import { PiCursorClickBold } from "react-icons/pi";

function MeasureTool() {
  return (
    <div className="flex flex-col gap-2 pr-6">
      <div className="flex items-center justify-between ">
        <div>
          <CustomTooltip content="Simple select">
            <Button variant={"ghost"} size={"icon"} onClick={() => {}}>
              <PiCursorClickBold className="size-5" />
            </Button>
          </CustomTooltip>
          <CustomTooltip content="Direct select">
            <Button variant={"ghost"} size={"icon"}>
              <MdAdsClick className="size-5" />
            </Button>
          </CustomTooltip>
          <CustomTooltip content="Draw polygon">
            <Button variant={"ghost"} size={"icon"} onClick={() => {}}>
              <BiShapePolygon className="size-5" />
            </Button>
          </CustomTooltip>
          <CustomTooltip content="Draw line">
            <Button variant={"ghost"} size={"icon"}>
              <IoAnalyticsOutline className="size-5" />
            </Button>
          </CustomTooltip>
          <CustomTooltip content="Draw point">
            <Button variant={"ghost"} size={"icon"}>
              <Circle className="size-5" />
            </Button>
          </CustomTooltip>
          <CustomTooltip content="Trash">
            <Button variant={"ghost"} size={"icon"} onClick={() => {}}>
              <Trash2 className="size-5" />
            </Button>
          </CustomTooltip>
        </div>
        <Button variant={"ghost"} size={"icon"}>
          <MoreHorizontal className="size-5" />
        </Button>
      </div>
      <Separator />
    </div>
  );
}

export default MeasureTool;
