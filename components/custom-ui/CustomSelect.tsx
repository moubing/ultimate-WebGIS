"use client";

import _ from "lodash";
import React, { memo, useEffect, useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../ui/select";
import { cn } from "@/lib/utils";

const CustomSelect = memo(function CustomSelect({
  arr,
  updateSelection,
  initialSelection,
  className = ""
}: {
  arr: string[];
  updateSelection: (select: string) => void;
  initialSelection: string;
  className?: string;
}) {
  const [selection, setSelection] = useState(initialSelection);

  const deboundedUpdateSelection = useMemo(() => {
    return _.debounce(updateSelection, 100);
  }, [updateSelection]);

  useEffect(() => {
    if (initialSelection) setSelection(initialSelection);
  }, [initialSelection]);

  return (
    <Select
      value={selection}
      onValueChange={(value: string) => {
        setSelection(value);
        deboundedUpdateSelection(value);
      }}
    >
      <SelectTrigger className={cn("w-[70%]", className)}>
        <SelectValue placeholder="select..." />
      </SelectTrigger>
      <SelectContent className="max-h-[250px]">
        {arr.map((item) => (
          <SelectItem value={item} key={item}>
            {item}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
});

export default CustomSelect;
