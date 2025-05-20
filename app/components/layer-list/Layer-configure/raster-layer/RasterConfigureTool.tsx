"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { GdalInfoResponse } from "@/lib/types";
import { MoreHorizontal } from "lucide-react";
import BandCalc from "../tools/BandCalc";
import BandDisplay from "../tools/BandDisplay";
import ShowAllMetaData from "../tools/ShowAllMetaData";
import ZoomToFit from "../tools/ZoomToFit";

function RasterConfigureTool({ data }: { data: GdalInfoResponse }) {
  return (
    <div className="flex flex-col gap-2 pr-6">
      <div className="flex items-center justify-between ">
        <div>
          <ZoomToFit />
          <ShowAllMetaData data={data} />
          <BandDisplay data={data} />
          <BandCalc data={data} />
        </div>
        <Button variant={"ghost"} size={"icon"}>
          <MoreHorizontal className="size-5" />
        </Button>
      </div>
      <Separator />
    </div>
  );
}

export default RasterConfigureTool;
