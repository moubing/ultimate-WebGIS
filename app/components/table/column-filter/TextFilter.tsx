"use client";

import { Input } from "@/components/ui/input";
import { Column } from "@tanstack/react-table";
import _ from "lodash";
import { useEffect, useMemo, useState } from "react";
import { Field } from "../../layer-list/layer-configure-com/Labels";

function TextFilter<TData>({ column }: { column: Column<TData> }) {
  const [value, setValue] = useState("");

  const filterValue = column.getFilterValue();

  useEffect(() => {
    if (filterValue) {
      setValue(filterValue as string);
    } else {
      setValue("");
    }
  }, [filterValue]);

  const debouncedSetFilterValue = useMemo(() => {
    return _.debounce((value: string) => {
      column.setFilterValue(value);
    }, 300);
  }, [column]);

  return (
    <div className="flex items-center justify-between">
      <Field>Text</Field>
      <Input
        type="text"
        placeholder="key word.."
        className="w-[70%]"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          debouncedSetFilterValue(e.target.value);
        }}
      />
    </div>
  );
}

export default TextFilter;
