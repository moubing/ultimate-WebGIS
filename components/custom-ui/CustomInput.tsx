"use client";

import { cn } from "@/lib/utils";
import _ from "lodash";
import { memo, useEffect, useMemo, useState } from "react";
import { Input } from "../ui/input";

const CustomInput = memo(function CustomInput({
  initialValue,
  updateValue,
  className = "",
  placeholder = ""
}: {
  updateValue: (value: string) => void;
  initialValue: string;
  className?: string;
  placeholder?: string;
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
      type="text"
      placeholder={placeholder}
      className={cn("w-[70%]", className)}
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
        deboundedUpdateValue(e.target.value);
      }}
    />
  );
});

export default CustomInput;
