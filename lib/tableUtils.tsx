import { MoreHorizontal } from "lucide-react";

import { DataTableColumnHeader } from "@/app/components/table/DataTableColumnHeader";
import CustomCopyBtn from "@/components/custom-ui/CustomCopyBtn";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Feature } from "geojson";
import { toast } from "sonner";

declare module "@tanstack/react-table" {
  interface ColumnMeta {
    variant?: "none" | "string" | "number";
  }
}
const columnHelper = createColumnHelper();

export function getColumnsDefFromData(data: Feature[]) {
  const selection = columnHelper.display({
    id: "select",
    meta: {
      variant: "none"
    },
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    )
  });
  const id = columnHelper.accessor("id", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),

    meta: {
      variant: "string"
    },
    cell: ({ cell }) => (
      <>
        {cell.getValue()}
        <CustomCopyBtn
          className="top-1/2 -translate-y-1/2 right-1"
          copyContent={cell.getValue() as string}
        />
      </>
    )
  });

  const columnsDef: ColumnDef<Feature>[] = [
    {
      accessorKey: "geometry.type",
      meta: {
        variant: "string"
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={column.id} />
      ),
      cell: ({ cell }) => (
        <>
          {cell.getValue()}
          <CustomCopyBtn
            className="top-1/2 -translate-y-1/2 right-1"
            copyContent={cell.getValue() as string}
          />
        </>
      )
    },
    {
      id: "actions",
      meta: {
        variant: "none"
      },
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(
                  row.original.id?.toString() || "no id"
                );
                toast.success(`copy feature id ${row.original.id}`);
              }}
            >
              Copy
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Remove</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ];
  if (!data[0].properties) return columnsDef;

  const dynamicColumns = Object.keys(data[0].properties).map((key) => {
    const value = data[0].properties![key];

    if (value || value === 0) {
      if (typeof value === "number") {
        return columnHelper.accessor("properties." + key, {
          meta: {
            variant: "number"
          },
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title={column.id} />
          ),
          cell: ({ cell }) => (
            <>
              {cell.getValue()}
              <CustomCopyBtn
                className="top-1/2 -translate-y-1/2 right-1"
                copyContent={cell.getValue() as string}
              />
            </>
          )
        });
      }
      if (typeof value === "object") {
        return columnHelper.accessor("properties." + key, {
          meta: {
            variant: "none"
          },
          enableColumnFilter: false,
          enableSorting: false,

          header: ({ column }) => (
            <DataTableColumnHeader column={column} title={column.id} />
          ),
          cell: ({ cell }) => (
            <>
              {cell.getValue()}
              <CustomCopyBtn
                className="top-1/2 -translate-y-1/2 right-1"
                copyContent={cell.getValue() as string}
              />
            </>
          )
        });
      }
    }
    return columnHelper.accessor("properties." + key, {
      meta: {
        variant: "string"
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={column.id} />
      ),
      cell: ({ cell }) => (
        <>
          {cell.getValue()}
          <CustomCopyBtn
            className="top-1/2 -translate-y-1/2 right-1"
            copyContent={cell.getValue() as string}
          />
        </>
      )
    });
  });

  if (typeof data[0].id === "undefined") {
    return [selection, ...dynamicColumns, ...columnsDef];
  }
  return [selection, ...dynamicColumns, id, ...columnsDef];
}

export function getPropertiesColumnDefFromData(data: Feature[]) {
  if (!data[0].properties) return [];

  return Object.keys(data[0].properties).map((key) => {
    return columnHelper.accessor("properties." + key, {
      cell: ({ cell }) => <>{cell.getValue()}</>
    });
  });
}
