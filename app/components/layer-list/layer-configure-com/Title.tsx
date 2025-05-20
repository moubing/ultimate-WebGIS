"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";

function Title({ name }: { name?: string }) {
  const [isClicked, setIsClicked] = useState(false);
  const [layerName, setLayerName] = useState(
    name || "Example: Hurricane Sandy Inundation"
  );

  useEffect(() => {
    if (name) setLayerName(name);
  }, [name]);

  return isClicked ? (
    <Input
      autoFocus
      type="text"
      className="px-3 py-1 focus:border-none focus-visible:ring-2 focus-visible:ring-pink-500 max-w-[250px] font-normal -ml-3  md:text-base"
      value={layerName}
      onChange={(e) => setLayerName(e.target.value)}
      onBlur={() => setIsClicked(false)}
    />
  ) : (
    <Button
      className="w-fit cursor-pointer px-3 py-1 truncate relative max-w-[250px] -ml-3 text-base"
      onClick={() => setIsClicked(true)}
      variant={"ghost"}
    >
      {layerName}
    </Button>
  );
}

export default Title;
