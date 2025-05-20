"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Column, Table } from "@tanstack/react-table";
import NumberFilterCard from "./column-filter/NumberFilterCard";
import StringFilterCard from "./column-filter/StringFilterCard";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Braces, ListRestart } from "lucide-react";
import { Button } from "@/components/ui/button";
import CustomTooltip from "@/components/custom-ui/CustomTooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { useContext } from "react";
import {
  SetSortingStateContext,
  SetColumnFiltersStateContext,
  SetVisibilityStateContext,
  SetPaginationStateContext,
  SetRowSelectionStateContext
} from "@/app/providers/tabelContext";
import Highlighter from "@/components/custom-ui/Highlighter";
import { Separator } from "@/components/ui/separator";

function ColumnsFilter<TData>({ table }: { table: Table<TData> }) {
  const setSorting = useContext(SetSortingStateContext);
  const setColumnFilters = useContext(SetColumnFiltersStateContext);
  const setVisibility = useContext(SetVisibilityStateContext);
  const setPagination = useContext(SetPaginationStateContext);
  const setRowSelection = useContext(SetRowSelectionStateContext);
  return (
    <Card className="min-w-[280px] w-[280px] flex-grow-0 border-0 shadow-none p-0 ">
      <CardHeader className=" p-0 pb-2 relative ">
        <CardTitle>Columns filter</CardTitle>
        <CardDescription>filter your data</CardDescription>
        <div className="absolute -top-1.5 right-4 gap-2 flex items-center ">
          <CustomTooltip content="reset all filter">
            <Button
              variant={"outline"}
              size={"icon"}
              onClick={() => {
                table.reset();
                setSorting([]);
                setColumnFilters([]);
                setVisibility({});
                setPagination({ pageIndex: 0, pageSize: 20 });
                setRowSelection({});
              }}
            >
              <ListRestart className="size-5" />
            </Button>
          </CustomTooltip>
          <Popover modal>
            <CustomTooltip content="view filter in json">
              <PopoverTrigger asChild>
                <Button variant={"outline"} size={"icon"}>
                  <Braces className="size-5" />
                </Button>
              </PopoverTrigger>
            </CustomTooltip>
            <PopoverContent align="start" className=" p-3 flex flex-col gap-2">
              <h1 className=" text-base text-sky-500">Filter json</h1>
              <Separator />
              <ScrollArea className="h-72 pr-2">
                <Highlighter data={table.getState().columnFilters} />
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      <ScrollArea className="h-[530px]">
        <CardContent className="flex flex-col gap-2  p-0 pr-3">
          {table.getAllColumns().map((column) => (
            <FilterCard key={column.id} column={column} />
          ))}
        </CardContent>
      </ScrollArea>
    </Card>
  );
}

export default ColumnsFilter;

function FilterCard<TData>({ column }: { column: Column<TData> }) {
  if (typeof column.columnDef?.meta?.variant === "undefined") return;
  if (column.columnDef.meta.variant === "none") return null;
  if (column.columnDef.meta.variant === "string") {
    return <StringFilterCard column={column} />;
  }

  if (column.columnDef.meta.variant === "number") {
    return <NumberFilterCard column={column} />;
  }
}
