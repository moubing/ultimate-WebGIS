import { ModeToggleButton } from "@/components/custom-ui/ModeToggleButton";
import React from "react";
import ScrollZoom from "./right-header/ScrollZoom";
import UserButton from "./right-header/UserButton";
import Zoom from "./right-header/Zoom";

function RightHeader() {
  return (
    <div className="flex items-center gap-2 place-self-end">
      <Zoom />
      <ScrollZoom />
      <ModeToggleButton />
      <UserButton />
    </div>
  );
}

export default RightHeader;
