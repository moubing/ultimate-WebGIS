"use client";

import React, { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SortableLayerObject } from "@/lib/types";
import { layerDescriptionMap } from "@/lib/constants";
import { layerFormMap } from "@/lib/layerFormMap";
import { cn } from "@/lib/utils";

function AddLayerDialog({
  selectedLayerObject,
  setSelectedLayerObject,
  closeAllDialog,
}: {
  selectedLayerObject: SortableLayerObject | null;
  setSelectedLayerObject: React.Dispatch<
    React.SetStateAction<SortableLayerObject | null>
  >;
  closeAllDialog: () => void;
}) {
  const FormComponent = useMemo(() => {
    if (selectedLayerObject) {
      return layerFormMap[selectedLayerObject.id];
    }
  }, [selectedLayerObject]);

  const formDescription = useMemo(() => {
    if (selectedLayerObject) {
      return layerDescriptionMap[selectedLayerObject.id];
    }
  }, [selectedLayerObject]);

  return (
    <Dialog
      open={!!selectedLayerObject}
      onOpenChange={(open) => {
        if (!open) {
          setSelectedLayerObject(null);
        }
      }}
    >
      <DialogContent
        className={cn(
          selectedLayerObject?.id === "GeoJsonLayer" && "max-w-[1600px]"
        )}
      >
        <DialogHeader>
          <DialogTitle>{selectedLayerObject?.id}</DialogTitle>
          <DialogDescription>{formDescription}</DialogDescription>
        </DialogHeader>
        {FormComponent ? (
          <FormComponent closeAllDialog={closeAllDialog} />
        ) : (
          <div>not layer form</div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default AddLayerDialog;
