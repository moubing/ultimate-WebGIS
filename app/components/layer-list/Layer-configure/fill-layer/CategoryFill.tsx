"use client";

import React from "react";
import Opacity from "./Opacity";
import ColorField from "./ColorField";

function CategoryFill() {
  return (
    <div className="flex flex-col gap-2">
      <ColorField />
      <Opacity />
    </div>
  );
}

export default CategoryFill;
