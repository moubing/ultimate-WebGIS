"use client";

import { cn } from "@/lib/utils";
import _ from "lodash";
import { memo, useEffect, useMemo, useState } from "react";
import { Switch } from "../ui/switch";

const CustomSwitch = memo(function CustomSwitch({
  initialState,
  updateState,
  className = ""
}: {
  updateState: (state: boolean) => void;
  initialState: boolean;
  className?: string;
}) {
  const [checked, setChecked] = useState(initialState);

  const deboundedUpdateState = useMemo(() => {
    return _.debounce(updateState, 100);
  }, [updateState]);

  useEffect(() => {
    if (initialState) setChecked(initialState);
  }, [initialState]);

  return (
    <Switch
      className={cn("", className)}
      checked={checked}
      onCheckedChange={(value) => {
        setChecked(value);
        deboundedUpdateState(value);
      }}
    />
  );
});

export default CustomSwitch;
