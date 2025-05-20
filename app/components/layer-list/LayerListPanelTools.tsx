"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

function LayerListPanelTools() {
  return (
    <div className="absolute top-4 right-4">
      <Button variant={"ghost"} size={"icon"}>
        <X className="size-5" />
      </Button>
    </div>
  );
}

export default LayerListPanelTools;
