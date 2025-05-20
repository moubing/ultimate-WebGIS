"use client";

import React from "react";
import Opacity from "./Opacity";
import ColorRangeField from "./ColorRangeField";

function ColorRangeFill() {
  return (
    <div className="flex flex-col gap-2">
      <ColorRangeField />
      <Opacity />
    </div>
  );
}

export default ColorRangeFill;
