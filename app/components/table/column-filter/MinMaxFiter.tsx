"use client";

import { Column } from "@tanstack/react-table";
import React, { useMemo, useState } from "react";
import { Field } from "../../layer-list/layer-configure-com/Labels";
import { Input } from "@/components/ui/input";
import _ from "lodash";

function MinMaxFiter<TData>({ column }: { column: Column<TData> }) {
  const [min, setMin] = useState(
    (column.getFilterValue() as [number, number])?.[0] ?? ""
  );
  const [max, setMax] = useState(
    (column.getFilterValue() as [number, number])?.[1] ?? ""
  );

  const debouncedMin = useMemo(() => {
    return _.debounce((e) => {
      column.setFilterValue((pre: [number, number]) => [
        Number(e.target.value),
        pre?.[1],
      ]);
    }, 300);
  }, [column]);
  const debouncedMax = useMemo(() => {
    return _.debounce((e) => {
      column.setFilterValue((pre: [number, number]) => [
        pre?.[0],
        Number(e.target.value),
      ]);
    }, 300);
  }, [column]);

  return (
    <div className="flex items-center justify-between">
      <Field>Range</Field>
      <div className="w-[70%] flex items-center gap-2">
        <Input
          placeholder={`${
            column.getFacetedMinMaxValues()?.[0] !== undefined
              ? `(${column.getFacetedMinMaxValues()?.[0]})`
              : ""
          }`}
          value={min}
          onChange={(e) => {
            setMin(Number(e.target.value));
            debouncedMin(e);
          }}
        />
        <Input
          placeholder={`${
            column.getFacetedMinMaxValues()?.[1] !== undefined
              ? `(${column.getFacetedMinMaxValues()?.[1]})`
              : ""
          }`}
          value={max}
          onChange={(e) => {
            setMax(Number(e.target.value));
            debouncedMax(e);
          }}
        />
      </div>
    </div>
  );
}

export default MinMaxFiter;
