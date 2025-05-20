"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { ChevronDown } from "lucide-react";

function Melt() {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"ghost"}
          className="text-lg font-black gap-0 flex items-center focus-visible:ring-0 px-2"
        >
          Melt <ChevronDown className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" sideOffset={15} className=" w-[230px]">
        <DropdownMenuItem className="flex relative items-center justify-between">
          Home
          <DropdownMenuShortcut></DropdownMenuShortcut>
        </DropdownMenuItem>
        <Separator />
        <DropdownMenuItem className="flex relative items-center justify-between">
          Quick actions
          <DropdownMenuShortcut>ctrl+K</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex relative items-center justify-between">
          Done editing
          <DropdownMenuShortcut>ctrl+E</DropdownMenuShortcut>
        </DropdownMenuItem>
        <Separator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>File</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent className="w-64" sideOffset={10}>
              <DropdownMenuItem>New map</DropdownMenuItem>
              <DropdownMenuItem>Move map...</DropdownMenuItem>
              <DropdownMenuItem>Duplicate map</DropdownMenuItem>
              <DropdownMenuItem>Delete map</DropdownMenuItem>
              <Separator />
              <DropdownMenuItem className="flex relative items-center justify-between">
                Upload Anything...
                <DropdownMenuShortcut>ctrl+U</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex relative items-center justify-between">
                Upload from URL...
                <DropdownMenuShortcut>ctrl+shift+U</DropdownMenuShortcut>
              </DropdownMenuItem>
              <Separator />
              <DropdownMenuItem>Export view</DropdownMenuItem>
              <DropdownMenuItem>Export selected</DropdownMenuItem>
              <DropdownMenuItem>Export all elements</DropdownMenuItem>
              <Separator />
              <DropdownMenuItem>Share...</DropdownMenuItem>
              <DropdownMenuItem>Embed</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Edit</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent className="w-64" sideOffset={10}>
              <DropdownMenuItem>
                Undo
                <DropdownMenuShortcut>ctrl+/Z</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                Redo
                <DropdownMenuShortcut>ctrl+shift+Z</DropdownMenuShortcut>
              </DropdownMenuItem>
              <Separator />
              <DropdownMenuItem disabled>
                Cut
                <DropdownMenuShortcut>ctrl+X</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                Copy
                <DropdownMenuShortcut>ctrl+C</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                Paste
                <DropdownMenuShortcut>ctrl+V</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                Duplicate
                <DropdownMenuShortcut>ctrl+D</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                Delete
                <DropdownMenuShortcut>del</DropdownMenuShortcut>
              </DropdownMenuItem>

              <Separator />
              <DropdownMenuItem>
                Select all
                <DropdownMenuShortcut>ctrl+A</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                Lock
                <DropdownMenuShortcut>ctrl+shift+L</DropdownMenuShortcut>
              </DropdownMenuItem>
              <Separator />

              <DropdownMenuItem>Group</DropdownMenuItem>
              <DropdownMenuItem>Arrange</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>View</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent className="w-64" sideOffset={10}>
              <DropdownMenuItem>
                Undo
                <DropdownMenuShortcut>ctrl+/Z</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                Redo
                <DropdownMenuShortcut>ctrl+shift+Z</DropdownMenuShortcut>
              </DropdownMenuItem>
              <Separator />
              <DropdownMenuItem disabled>
                Cut
                <DropdownMenuShortcut>ctrl+X</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                Copy
                <DropdownMenuShortcut>ctrl+C</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                Paste
                <DropdownMenuShortcut>ctrl+V</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                Duplicate
                <DropdownMenuShortcut>ctrl+D</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                Delete
                <DropdownMenuShortcut>del</DropdownMenuShortcut>
              </DropdownMenuItem>

              <Separator />
              <DropdownMenuItem>
                Select all
                <DropdownMenuShortcut>ctrl+A</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                Lock
                <DropdownMenuShortcut>ctrl+shift+L</DropdownMenuShortcut>
              </DropdownMenuItem>
              <Separator />

              <DropdownMenuItem>Group</DropdownMenuItem>
              <DropdownMenuItem>Arrange</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Transform</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent className="w-64" sideOffset={10}>
              <DropdownMenuItem>
                Undo
                <DropdownMenuShortcut>ctrl+/Z</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                Redo
                <DropdownMenuShortcut>ctrl+shift+Z</DropdownMenuShortcut>
              </DropdownMenuItem>
              <Separator />
              <DropdownMenuItem disabled>
                Cut
                <DropdownMenuShortcut>ctrl+X</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                Copy
                <DropdownMenuShortcut>ctrl+C</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                Paste
                <DropdownMenuShortcut>ctrl+V</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                Duplicate
                <DropdownMenuShortcut>ctrl+D</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                Delete
                <DropdownMenuShortcut>del</DropdownMenuShortcut>
              </DropdownMenuItem>

              <Separator />
              <DropdownMenuItem>
                Select all
                <DropdownMenuShortcut>ctrl+A</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                Lock
                <DropdownMenuShortcut>ctrl+shift+L</DropdownMenuShortcut>
              </DropdownMenuItem>
              <Separator />

              <DropdownMenuItem>Group</DropdownMenuItem>
              <DropdownMenuItem>Arrange</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Help and account</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent className="w-64" sideOffset={10}>
              <DropdownMenuItem>
                Undo
                <DropdownMenuShortcut>ctrl+/Z</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                Redo
                <DropdownMenuShortcut>ctrl+shift+Z</DropdownMenuShortcut>
              </DropdownMenuItem>
              <Separator />
              <DropdownMenuItem disabled>
                Cut
                <DropdownMenuShortcut>ctrl+X</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                Copy
                <DropdownMenuShortcut>ctrl+C</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                Paste
                <DropdownMenuShortcut>ctrl+V</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                Duplicate
                <DropdownMenuShortcut>ctrl+D</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                Delete
                <DropdownMenuShortcut>del</DropdownMenuShortcut>
              </DropdownMenuItem>

              <Separator />
              <DropdownMenuItem>
                Select all
                <DropdownMenuShortcut>ctrl+A</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                Lock
                <DropdownMenuShortcut>ctrl+shift+L</DropdownMenuShortcut>
              </DropdownMenuItem>
              <Separator />

              <DropdownMenuItem>Group</DropdownMenuItem>
              <DropdownMenuItem>Arrange</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default Melt;
