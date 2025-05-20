"use client";

import { Input } from "@/components/ui/input";
import { Table } from "@tanstack/react-table";
import { SearchIcon } from "lucide-react";
import React from "react";

function GlobalFliter<TData>({ table }: { table: Table<TData> }) {
  return (
    <div className="w-[50%] relative flex items-center ">
      <Input
        className="focus-visible:ring-2 focus-visible:ring-pink-500 pl-8 ring-pink-200 ring-1 dark:ring-slate-200 dark:focus-visible:ring-slate-500"
        placeholder="Global search..."
        value={table.getState().globalFilter ?? ""}
        onChange={(e) => {
          table.setGlobalFilter(e.target.value);
        }}
      />
      <SearchIcon className="absolute size-5 left-2 text-muted-foreground" />
    </div>
  );
}

export default GlobalFliter;
