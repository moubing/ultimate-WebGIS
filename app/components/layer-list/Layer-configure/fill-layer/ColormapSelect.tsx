"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger
} from "@/components/ui/select";
import { colorMap } from "@/lib/constants";
import chroma from "chroma-js";
import _ from "lodash";
import { memo, useEffect, useMemo, useState } from "react";

const ColormapSelect = memo(function ColormapSelect({
  updateSelection,
  initialSelection,
  categoryCount,
  currentColors
}: {
  updateSelection: (select: string) => void;
  categoryCount: number;
  initialSelection: string;
  currentColors: string[];
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
      <SelectTrigger className="w-[70%]">
        <div className="flex rounded overflow-hidden h-5 w-[140px]">
          {currentColors.map((color) => (
            <div
              key={color}
              className=" h-full flex-grow"
              style={{ backgroundColor: color }}
            ></div>
          ))}
        </div>
      </SelectTrigger>
      <SelectContent className="max-h-[250px]">
        {colorMap.map((item) => (
          <SelectItem value={item} key={item}>
            <ColorsDisplayer
              colormapName={item}
              categoryCount={categoryCount}
            />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
});

export default ColormapSelect;

function ColorsDisplayer({
  colormapName,
  categoryCount
}: {
  colormapName: string;
  categoryCount: number;
}) {
  const colors = useMemo(() => {
    return chroma
      .scale(colormapName as chroma.BrewerPaletteName)
      .colors(categoryCount, "hex");
  }, [colormapName, categoryCount]);

  return (
    <div className="flex rounded overflow-hidden h-5 w-[140px]">
      {colors.map((color) => (
        <div
          key={color}
          className=" h-full flex-grow"
          style={{ backgroundColor: color }}
        ></div>
      ))}
    </div>
  );
}
