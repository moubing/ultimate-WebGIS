"use client";

import { Fill } from "./Fill";
import Opacity from "./Opacity";

function SimpleFill() {
  return (
    <div className="flex flex-col gap-2 ">
      <Fill />
      <Opacity />
    </div>
  );
}

export default SimpleFill;
