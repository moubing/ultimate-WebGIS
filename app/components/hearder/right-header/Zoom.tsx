"use client";

import {
  CurrentModeContext,
  SetCurrentModeContext,
  SetViewStateContext,
  ViewStateContext
} from "@/app/providers/contexts";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { initialView } from "@/lib/constants";
import { Mode } from "@/lib/types";
import {
  ChevronDown,
  Fullscreen,
  ScanSearch,
  ZoomIn,
  ZoomOut
} from "lucide-react";
import { useContext, useState } from "react";

function Zoom() {
  const viewState = useContext(ViewStateContext);
  const setViewState = useContext(SetViewStateContext);

  const currentMode = useContext(CurrentModeContext);
  const setCurrentMode = useContext(SetCurrentModeContext);

  const [open, setOpen] = useState(false);

  const handleSelect = (value: string, e: Event) => {
    e.preventDefault();
    e.stopPropagation();

    setCurrentMode(value as Mode);
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        <Button className="w-18" variant={"ghost"}>
          {viewState?.zoom.toFixed(1)} <ChevronDown className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent sideOffset={15} className=" w-[230px]">
        <DropdownMenuLabel>DATA</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuCheckboxItem checked>
            Legend
            <DropdownMenuShortcut>shift+3</DropdownMenuShortcut>
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>
            Table
            <DropdownMenuShortcut>shift+4</DropdownMenuShortcut>
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked>
            Comment
            <DropdownMenuShortcut>shift+5</DropdownMenuShortcut>
          </DropdownMenuCheckboxItem>
        </DropdownMenuGroup>
        <Separator />

        <DropdownMenuLabel>Zoom</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <ZoomIn />
            Zoom in
            <DropdownMenuShortcut>+</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <ZoomOut />
            Zoom out
            <DropdownMenuShortcut>-</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <ScanSearch />
            Zoom fit
            <DropdownMenuShortcut>alt+f</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setViewState(initialView)}>
            <Fullscreen />
            Reset view
            <DropdownMenuShortcut>0</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuLabel>View</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={currentMode}>
          <DropdownMenuRadioItem
            value="overview"
            onSelect={(e) => handleSelect("overview", e)}
          >
            Overview
            <DropdownMenuShortcut></DropdownMenuShortcut>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="side-by-side"
            onSelect={(e) => handleSelect("side-by-side", e)}
          >
            Side
            <DropdownMenuShortcut></DropdownMenuShortcut>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="split-screen"
            onSelect={(e) => handleSelect("split-screen", e)}
          >
            Split
            <DropdownMenuShortcut></DropdownMenuShortcut>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default Zoom;
