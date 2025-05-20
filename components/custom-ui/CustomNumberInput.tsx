"use client";

import { cn } from "@/lib/utils";
import _ from "lodash";
import { memo, useEffect, useMemo, useState } from "react";
import { Input } from "../ui/input";

const CustomNumberInput = memo(function CustomNumberInput({
  initialValue,
  updateValue,
  min = 0,
  className = ""
}: {
  updateValue: (value: number) => void;
  initialValue: number;
  min?: number;
  max?: number;
  className?: string;
}) {
  const [value, setValue] = useState(initialValue);

  const deboundedUpdateValue = useMemo(() => {
    return _.debounce(updateValue, 300);
  }, [updateValue]);

  useEffect(() => {
    if (initialValue) setValue(initialValue);
  }, [initialValue]);

  return (
    <Input
      type="number"
      className={cn("w-[70%]", className)}
      value={value}
      min={min}
      onChange={(e) => {
        setValue(Number(e.target.value));
        deboundedUpdateValue(Number(e.target.value));
      }}
    />
  );
});

export default CustomNumberInput;
