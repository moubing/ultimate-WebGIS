"use client";

import { DrawFeaturesContext } from "@/app/providers/contexts";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useContext } from "react";
import MeasureTool from "./MeasureTool";

function MeasurePanel() {
  const drawFeatures = useContext(DrawFeaturesContext);
  console.log(drawFeatures, "draw features");

  return (
    <>
      <MeasureTool />
      <ScrollArea className="h-[550px] pr-6">
        <div className="flex flex-col gap-2"></div>
      </ScrollArea>
    </>
  );
}

export default MeasurePanel;
