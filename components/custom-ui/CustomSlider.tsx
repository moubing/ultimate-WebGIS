"use client";

import React, { memo, useEffect, useMemo, useState } from "react";
import { Slider } from "../ui/slider";
import _ from "lodash";
import { Input } from "../ui/input";

const CustomSlider = memo(function CustomSlider({
  initialOpacity,
  updateOpacity,
  min = 0,
  max = 1,
  step = 0.01,
}: {
  initialOpacity?: number;
  updateOpacity: (opacity: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  const [opacity, setOpacity] = useState(initialOpacity || 0.5);
  const debouncedUpdateOpacity = useMemo(() => {
    return _.debounce(updateOpacity, 100);
  }, [updateOpacity]);

  useEffect(() => {
    if (initialOpacity) setOpacity(initialOpacity);
  }, [initialOpacity]);

  return (
    <div className="w-[70%] flex items-center gap-2">
      <Slider
        value={[opacity as number]}
        onValueChange={(values) => {
          setOpacity(values[0]);
          debouncedUpdateOpacity(values[0]);
        }}
        min={min}
        max={max}
        step={step}
        className="w-[60%]"
      />
      <Input
        value={opacity}
        className="w-[40%]"
        type="number"
        min={min}
        max={max}
        step={step}
        onChange={(e) => {
          let value = Number(Number(e.target.value).toFixed(2));
          if (value > max) value = max;
          if (value < min) value = min;
          setOpacity(value);
          debouncedUpdateOpacity(value);
        }}
      />
    </div>
  );
});

export default CustomSlider;
