"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";

function Project({ name }: { name?: string }) {
  const [isClicked, setIsClicked] = useState(false);
  const [projectName, setProjectName] = useState(
    name || "Example: Hurricane Sandy Inundation"
  );

  return (
    <Button
      className="w-fit cursor-pointer px-3 py-1 relative"
      onClick={() => setIsClicked(true)}
      variant={"ghost"}
    >
      {projectName}

      {isClicked && (
        <Input
          autoFocus
          type="text"
          className="px-3 py-1 focus:border-none absolute top-0 left-0 w-full h-full focus-visible:ring-2 focus-visible:ring-pink-500"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          onBlur={() => setIsClicked(false)}
        />
      )}
    </Button>
  );
}

export default Project;
