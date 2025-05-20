"use client";

import CustomTooltip from "@/components/custom-ui/CustomTooltip";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  CloudUpload,
  Database,
  ExternalLink,
  FileUp,
  Link2,
} from "lucide-react";
import Image from "next/image";

function Upload() {
  return (
    <DropdownMenu modal={false}>
      <CustomTooltip content="Upload data" sideOffset={5}>
        <DropdownMenuTrigger asChild>
          <Button
            variant={"ghost"}
            size={"icon"}
            className="hover:bg-pink-100 hover:text-pink-500"
          >
            <CloudUpload className="size-6" />
          </Button>
        </DropdownMenuTrigger>
      </CustomTooltip>
      <DropdownMenuContent sideOffset={15} className="text-sm w-[290px]">
        <DropdownMenuItem className="flex relative items-center justify-between">
          <FileUp /> Upload file...
          <DropdownMenuShortcut>ctrl+U</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex relative items-center justify-between">
          <Link2 /> From URL...
          <DropdownMenuShortcut>ctrl+shift+U</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex relative items-center justify-between">
          <Database /> Connect cloud source...
          <DropdownMenuShortcut></DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex relative items-center justify-between">
          <ExternalLink /> From QGIS...
          <DropdownMenuShortcut></DropdownMenuShortcut>
        </DropdownMenuItem>
        <Separator />
        <div className="p-4 flex-col items-center flex justify-center ">
          <Image
            height={164}
            width={484}
            alt="upload"
            src={"/image/upload.png"}
          />
          <h1 className="text-lg leading-10">Upload Anything to Melt</h1>
          <p className="text-muted-foreground">
            <span className=" underline">Read our guide</span> on what&apos;s
            possible!
          </p>
          <p className="text-xs leading-5 text-neutral-400">
            .shp,.geojson,.csv,.tiff,.jpg and more
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default Upload;
