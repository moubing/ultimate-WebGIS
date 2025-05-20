"use client";

import { cn } from "@/lib/utils";
import _ from "lodash";
import { memo, useEffect, useMemo, useState } from "react";
import { Textarea } from "../ui/textarea";

const CustomTextArea = memo(function CustomTextArea({
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
    <Textarea
      placeholder={placeholder}
      rows={2}
      className={cn("w-full", className)}
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
        deboundedUpdateValue(e.target.value);
      }}
    />
  );
});

export default CustomTextArea;
