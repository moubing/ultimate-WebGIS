"use client";

import {
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table";
import { Feature } from "geojson";
import { Grid } from "ldrs/react";
import "ldrs/react/Grid.css";
import { useContext, useMemo } from "react";

import {
  ColumnFiltersStateContext,
  PaginationStateContext,
  RowSelectionStateContext,
  SetColumnFiltersStateContext,
  SetPaginationStateContext,
  SetRowSelectionStateContext,
  SetSortingStateContext,
  SetVisibilityStateContext,
  SortingStateContext,
  VisibilityStateContext
} from "@/app/providers/tabelContext";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from "@/components/ui/resizable";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { getColumnsDefFromData } from "@/lib/tableUtils";
import ColumnsFilter from "./ColumnsFilter";
import { DataTablePagination } from "./DataTablePagination";
import { DataTableViewOptions } from "./DataTableViewOptioins";
import GlobalFliter from "./GlobalFliter";
import ChartContainer from "./chart/ChartContainer";

function AttributeTable({ data }: { data: Feature[] }) {
  const sorting = useContext(SortingStateContext);
  const columnFilters = useContext(ColumnFiltersStateContext);
  const visibility = useContext(VisibilityStateContext);
  const pagination = useContext(PaginationStateContext);
  const rowSelection = useContext(RowSelectionStateContext);
  const setSorting = useContext(SetSortingStateContext);
  const setColumnFilters = useContext(SetColumnFiltersStateContext);
  const setVisibility = useContext(SetVisibilityStateContext);
  const setPagination = useContext(SetPaginationStateContext);
  const setRowSelection = useContext(SetRowSelectionStateContext);
  const columns = useMemo(() => {
    return getColumnsDefFromData(data);
  }, [data]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    globalFilterFn: "includesString",
    state: {
      sorting,
      columnFilters,
      pagination,
      rowSelection,
      columnVisibility: visibility
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setVisibility,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection
  });

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel
        className="pr-6 flex pl-4 pb-4 pt-2"
        maxSize={83}
        minSize={65}
        defaultSize={83}
      >
        <ColumnsFilter table={table} />
        <div className="flex-grow">
          <div className=" flex items-center px-4 gap-4">
            <GlobalFliter table={table} />
            <DataTableViewOptions table={table} />
          </div>
          <ScrollArea className="rounded-md border m-4 w-full max-w-[1160px] h-[500px] ">
            <Table className="w-full">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="relative group">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-[500px]  text-center"
                    >
                      <div className=" flex flex-col items-center justify-center size-full gap-2">
                        <Grid size="100" speed="1.5" color="black" />
                        <p className="text-muted-foreground text-2xl">
                          No matching data found.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          <div className="pl-2 -mr-3">
            <DataTablePagination table={table} />
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel className="p-4">
        <ChartContainer table={table} />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

export default AttributeTable;
