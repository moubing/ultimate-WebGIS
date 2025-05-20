"use client";

import CustomTooltip from "@/components/custom-ui/CustomTooltip";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Brush,
  Circle,
  HighlighterIcon,
  LinkIcon,
  MapPin,
  NotepadTextIcon,
  Pentagon,
  PenTool,
  Slash,
  Spline,
  SquarePlay,
  Type
} from "lucide-react";

function Annotate() {
  return (
    <DropdownMenu modal={false}>
      <CustomTooltip content="Annotate tools" sideOffset={5}>
        <DropdownMenuTrigger asChild>
          <Button
            variant={"ghost"}
            size={"icon"}
            className="hover:bg-pink-100 hover:text-pink-500"
          >
            <Brush className="size-6" />
          </Button>
        </DropdownMenuTrigger>
      </CustomTooltip>
      <DropdownMenuContent sideOffset={15} className=" w-[230px]">
        <DropdownMenuLabel>DATA</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem className="flex relative items-center justify-between">
            <MapPin /> Pin
            <DropdownMenuShortcut>P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex relative items-center justify-between">
            <Slash /> Line
            <DropdownMenuShortcut>L</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex relative items-center justify-between">
            <Spline /> Route
            <DropdownMenuShortcut>R</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex relative items-center justify-between">
            <Pentagon /> Polygon
            <DropdownMenuShortcut>O</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex relative items-center justify-between">
            <Circle /> Circle
            <DropdownMenuShortcut>I</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <Separator />
        <DropdownMenuLabel>ANNOTATIONS</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem className="flex relative items-center justify-between">
            <PenTool /> Marker
            <DropdownMenuShortcut>M</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex relative items-center justify-between">
            <HighlighterIcon /> Highlighter
            <DropdownMenuShortcut>H</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex relative items-center justify-between">
            <Type /> Text
            <DropdownMenuShortcut>T</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex relative items-center justify-between">
            <NotepadTextIcon /> Note
            <DropdownMenuShortcut>N</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex relative items-center justify-between">
            <LinkIcon /> Link
            <DropdownMenuShortcut>K</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex relative items-center justify-between">
            <SquarePlay /> Video
            <DropdownMenuShortcut>V</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default Annotate;
