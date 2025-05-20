"use client";

import { Field } from "@/app/components/layer-list/layer-configure-com/Labels";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { useCallback, useEffect, useMemo, useState } from "react";
import CustomNumberInput from "./CustomNumberInput";
import CustomSelect from "./CustomSelect";
import EChartsReact from "echarts-for-react";
import { EChartsOption } from "echarts";
import { getPieces } from "@/lib/utils";

const stepArr = ["0.001", "0.01", "0.1", "1", "10", "100"];
type stepType = "0.001" | "0.01" | "0.1" | "1" | "10" | "100";

function CustomMultiSlider({
  initialValues,
  updateValues,
  max,
  min,
  orientation = "horizontal",
  currentColors,
  uniqueValues
}: {
  initialValues: number[];
  updateValues: (values: number[]) => void;
  min: number;
  max: number;
  orientation?: "vertical" | "horizontal";
  currentColors: string[];
  uniqueValues: [number, number][];
}) {
  const [values, setValues] = useState(initialValues);
  const [step, setStep] = useState<stepType>(() => {
    if (max - min > 10) return "1";
    else return "0.01";
  });

  const [minInterval, setMinInterval] = useState(() => {
    const diff = max - min;
    if (diff < 10) {
      return 0.05;
    } else if (diff < 100) {
      return 0.5;
    } else if (diff < 1000) {
      return 5;
    } else if (diff < 10000) {
      return 10;
    }
    return 20;
  });

  const pieces = useMemo(() => getPieces(initialValues), [initialValues]);

  const chartOption = useMemo(() => {
    return {
      tooltip: {
        triggerOn: "mousemove",
        axisPointer: { type: "line" },
        trigger: "axis"
      },
      xAxis: { min, max },
      yAxis: {},

      grid: {
        borderWidth: 1,
        borderColor: "#ea4899",
        top: 10,
        left: 30,

        right: 0,
        bottom: 20
      },
      dataZoom: [
        { type: "inside", yAxisIndex: 0, start: 0, end: 7 },
        { type: "inside", xAxisIndex: 0 }
      ],
      visualMap: {
        show: false,
        type: "piecewise",
        categories: uniqueValues
          .map((value) => value[0])
          .toSorted((a, b) => a - b),
        pieces,
        dimension: 0, // 映射 xValue
        min,
        max,
        inRange: {
          color: currentColors
        }
      },
      series: {
        name: "count",
        emphasis: {
          focus: "series"
        },
        type: "bar",
        data: uniqueValues
      }
    } as EChartsOption;
  }, [currentColors, max, min, pieces, uniqueValues]);

  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  const changeStep = useCallback((value: string) => {
    setStep(value as stepType);
  }, []);

  const changeMinInterval = useCallback((value: number) => {
    setMinInterval(value);
  }, []);

  return (
    <div className="flex flex-col gap-2.5">
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center justify-between">
          <Field>step</Field>
          <CustomSelect
            arr={stepArr}
            updateSelection={changeStep}
            initialSelection={step}
          />
        </div>
        <div className="flex items-center justify-between">
          <Field>Interval</Field>
          <CustomNumberInput
            initialValue={minInterval}
            updateValue={changeMinInterval}
          />
        </div>
      </div>
      <EChartsReact
        option={chartOption}
        style={{
          width: "100%",
          height: "120px"
        }}
      />
      <SliderPrimitive.Root
        className="relative flex ml-6 w-[94%] h-2 touch-none select-none items-center mb-8"
        max={max}
        min={min}
        minStepsBetweenThumbs={minInterval}
        step={Number(step)}
        value={values}
        onValueChange={setValues}
        onValueCommit={updateValues}
        orientation={orientation}
      >
        <SliderPrimitive.Track className="relative w-full h-full grow overflow-hidden rounded-full bg-primary/20"></SliderPrimitive.Track>
        {values.map((_, index) => (
          <SliderPrimitive.Thumb
            key={index}
            className="block size-2 cursor-pointer rounded-full relative border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none  disabled:pointer-events-none disabled:opacity-50 hover:bg-accent  group hover:z-50 z-0"
          >
            <div className="absolute left-1/2 z-10 -translate-x-1/2 top-4 rounded-md min-w-14 text-center px-2 py-1 text-xs text-muted-foreground border border-input bg-background shadow-sm group-hover:bg-pink-100 group-hover:text-accent-foreground ">
              {`step ${index + 1}`}
            </div>
            <div className="absolute left-1/2 z-20 -translate-x-1/2 group-hover:bg-pink-100 top-3 size-2   border-l border-b border-input rotate-45 bg-white"></div>
          </SliderPrimitive.Thumb>
        ))}
      </SliderPrimitive.Root>
    </div>
  );
}

export default CustomMultiSlider;
