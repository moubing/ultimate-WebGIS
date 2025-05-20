"use client";

import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import InspectConfigurePanel from "./list-tool/InspectConfigurePanel";

function MapLayerListTools() {
  return (
    <div className="flex items-center justify-between pt-4">
      <h1>Map Layers</h1>
      <div className="flex items-center gap-1">
        <InspectConfigurePanel />
        <More />
      </div>
    </div>
  );
}

export default MapLayerListTools;

function More() {
  return (
    <Button variant={"ghost"} size={"icon"}>
      <MoreHorizontal className="size-5" />
    </Button>
  );
}
