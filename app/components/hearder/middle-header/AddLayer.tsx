"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Layers2 } from "lucide-react";
import React, { useCallback, useState } from "react";
import LayerDashboard from "./LayerDashboard";
import CustomTooltip from "@/components/custom-ui/CustomTooltip";

function AddLayer() {
  const [open, setOpen] = useState(false);

  const closeDialog = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <CustomTooltip content="Add layer" sideOffset={5}>
        <DialogTrigger asChild>
          <Button
            variant={"ghost"}
            size={"icon"}
            className="hover:bg-pink-100 hover:text-pink-500"
          >
            <Layers2 className="size-6" />
          </Button>
        </DialogTrigger>
      </CustomTooltip>
      <DialogContent className="w-fit max-w-fit">
        <DialogHeader>
          <DialogTitle> Add Custom Layer</DialogTitle>
          <DialogDescription>
            Upload or connect external data sources to overlay custom layers on
            the map. Support formats: GeoJSON, KML, CSV and so on.
          </DialogDescription>
        </DialogHeader>
        <LayerDashboard closeDialog={closeDialog} />
        <DialogFooter>
          <Button variant={"secondary"}>close</Button>
          <Button>apply</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddLayer;
