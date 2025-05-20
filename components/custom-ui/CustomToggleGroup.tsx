"use client";

import React, { memo, useState } from "react";
import { Toggle } from "../ui/toggle";

const CustomToggleGroup = memo(function CustomToggleGroup({
  initialState,
  arr,
  updateStates
}: {
  initialState: boolean[];
  arr: string[];
  updateStates: (booleans: boolean[]) => void;
}) {
  const [toggleStates, setToggleStates] = useState(initialState);

  return (
    <div className="flex items-center gap-2 border border-input shadow-sm px-1 py-2 rounded-md">
      {toggleStates.map((_, index) => (
        <Toggle
          variant={"outline"}
          className="data-[state=on]:text-emerald-500 data-[state=on]:bg-emerald-100 data-[state=on]:border-emerald-500 data-[state=off]:text-slate-500"
          key={arr[index]}
          pressed={toggleStates[index]}
          onPressedChange={(boolean) => {
            const newArr = [...toggleStates];
            newArr[index] = boolean;

            setToggleStates(newArr);
            updateStates(newArr);
          }}
        >
          {arr[index]}
        </Toggle>
      ))}
    </div>
  );
});

export default CustomToggleGroup;
