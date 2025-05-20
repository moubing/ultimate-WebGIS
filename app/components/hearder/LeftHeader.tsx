"use client";

import Category from "./left-header/Category";
import Melt from "./left-header/Melt";
import Project from "./left-header/Project";

function LeftHeader() {
  return (
    <div className="flex items-center">
      <Melt />
      <Category />
      <Project />
    </div>
  );
}

export default LeftHeader;
