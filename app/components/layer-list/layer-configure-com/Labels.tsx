"use client";

import { cn } from "@/lib/utils";
import React from "react";

export function Header({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) {
  return (
    <h1 className={cn("font-bold text-sm text-foreground", className)}>
      {children}
    </h1>
  );
}

export function Field({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) {
  return (
    <p className={cn(" text-sm text-muted-foreground", className)}>
      {children}
    </p>
  );
}
