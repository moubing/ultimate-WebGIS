"use client";

import React, { memo } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const CustomTooltip = memo(function CustomTooltip({
  children,
  content,
  side = "top",
  sideOffset = 0,
  align = "center",
  delayDuration = 700,
}: {
  children: React.ReactNode;
  content: string | React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  align?: "start" | "center" | "end";
  delayDuration?: number;
}) {
  return (
    <Tooltip delayDuration={delayDuration}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent align={align} side={side} sideOffset={sideOffset}>
        {content}
      </TooltipContent>
    </Tooltip>
  );
});

export default CustomTooltip;
