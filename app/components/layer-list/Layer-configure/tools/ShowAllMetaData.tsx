"use client";

import CustomTooltip from "@/components/custom-ui/CustomTooltip";
import Highlighter from "@/components/custom-ui/Highlighter";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { GdalInfoResponse } from "@/lib/types";

import { FileJson } from "lucide-react";
import { memo } from "react";

const ShowAllMetaData = memo(function ShowAllMetaData({
  data
}: {
  data: GdalInfoResponse;
}) {
  return (
    <Popover modal>
      <CustomTooltip content="Show raw meta data">
        <PopoverTrigger asChild>
          <Button variant={"ghost"} size={"icon"}>
            <FileJson className="size-5" />
          </Button>
        </PopoverTrigger>
      </CustomTooltip>
      <PopoverContent
        className=" bg-background/10 backdrop-blur-md p-0 rounded-lg"
        side="left"
        sideOffset={75}
        align="start"
      >
        <div className=" flex flex-col gap-2 bg-background/80 dark:bg-background/90 p-3 rounded-lg text-xs">
          <h1 className=" text-base text-sky-500">Meta data</h1>
          <Separator />
          <ScrollArea className="h-72 pr-2 ">
            {data && <Highlighter data={data} />}
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
});

export default ShowAllMetaData;
