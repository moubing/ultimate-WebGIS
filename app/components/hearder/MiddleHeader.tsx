"use client";

import React from "react";
import BasemapLibrary from "./middle-header/BasemapLibrary";
import AddLayer from "./middle-header/AddLayer";
import Annotate from "./middle-header/Annotate";
import Upload from "./middle-header/Upload";
import Transform from "./middle-header/Transform";
import Component from "./middle-header/Component";
import Setting from "./middle-header/Setting";

function MiddleHeader() {
  return (
    <div className="flex items-center gap-2 place-self-center">
      <Annotate />
      <BasemapLibrary />
      <AddLayer />
      <Upload />
      <Transform />
      <Component />
      <Setting />
    </div>
  );
}

export default MiddleHeader;
