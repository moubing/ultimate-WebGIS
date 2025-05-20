"use client";

import {
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger
} from "@/components/ui/context-menu";
import { memo, useState } from "react";

const FitOption = memo(function FitOption({
  selection,
  setSelection
}: {
  selection: string;
  setSelection: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);

  const handleSelect = (value: string, e: Event) => {
    e.preventDefault();
    e.stopPropagation();

    setSelection(value);
    setOpen(false);
  };

  return (
    <ContextMenuSub open={open} onOpenChange={setOpen}>
      <ContextMenuSubTrigger inset>Fit options</ContextMenuSubTrigger>
      <ContextMenuSubContent sideOffset={10} className="w-48 ">
        <ContextMenuRadioGroup value={selection}>
          {["flyTo", "easeTo", "jumpTo"].map((value) => (
            <ContextMenuRadioItem
              key={value}
              value={value}
              onSelect={(e: Event) => handleSelect(value, e)}
              onClick={(e) => e.stopPropagation()}
              className=" capitalize"
            >
              {value}
            </ContextMenuRadioItem>
          ))}
        </ContextMenuRadioGroup>
      </ContextMenuSubContent>
    </ContextMenuSub>
  );
});

export default FitOption;
