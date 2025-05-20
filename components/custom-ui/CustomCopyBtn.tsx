"use client";

import React, { memo } from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Copy } from "lucide-react";
import { cn } from "@/lib/utils";

const CustomCopyBtn = memo(function CustomCopyBtn({
  copyContent,
  className = ""
}: {
  copyContent: string;
  className?: string;
}) {
  return (
    <Button
      onClick={() => {
        navigator.clipboard.writeText(copyContent || "error");
        toast.success(`copied: ${copyContent}`);
      }}
      className={cn(
        "absolute top-0 right-0 opacity-0 group-hover:opacity-50 transition-all duration-200 hover:bg-transparent hover:text-pink-500 z-50 focus:ring-0",
        className
      )}
      variant={"ghost"}
      size={"icon"}
    >
      <Copy className="size-4" />
    </Button>
  );
});

export default CustomCopyBtn;
