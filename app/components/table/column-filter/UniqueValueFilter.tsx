"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Column } from "@tanstack/react-table";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { Field } from "../../layer-list/layer-configure-com/Labels";
import { MdOutlineDraw } from "react-icons/md";
import CustomTooltip from "@/components/custom-ui/CustomTooltip";
import { SetChartOptionsContext } from "@/app/providers/tabelContext";
import { EChartsOption, TitleComponentOption } from "echarts";
import { echartColorPalette } from "@/lib/constants";
import { toast } from "sonner";
import { uniqueValueItem } from "@/lib/types";

function UniqueValueFilter<TData>({ column }: { column: Column<TData> }) {
  const [open, setOpen] = useState(false);
  const setChartOptions = useContext(SetChartOptionsContext);

  const uniqueValues: [string, number][] = useMemo(() => {
    return Array.from(column.getFacetedUniqueValues());
  }, [column]);

  const isMassive = useMemo(() => {
    return uniqueValues.length > 100;
  }, [uniqueValues]);

  const slicedUniqueValues = useMemo(() => {
    if (uniqueValues.length > 100) {
      return uniqueValues.slice(0, 100);
    }
    return uniqueValues;
  }, [uniqueValues]);

  const [selectedItem, setSelectedItem] =
    React.useState<uniqueValueItem | null>(null);

  const filterValue = column.getFilterValue();

  useEffect(() => {
    if (!filterValue) {
      setSelectedItem(null);
    }
  }, [filterValue]);

  const addUniqueChart = useCallback(() => {
    setChartOptions((pre) => {
      const key = `${column.id}`;
      const isExist = pre.some(
        (option) => (option.title as TitleComponentOption)?.text === key
      );
      if (isExist) {
        toast.error("Chart already exists!", { id: column.id });
        return pre;
      }

      const option = {
        title: {
          text: key,
          textStyle: { color: "#ea4899", fontSize: 16 }
        },
        color: echartColorPalette,
        tooltip: {
          triggerOn: "mousemove",
          axisPointer: { type: "cross" },
          trigger: "axis"
        },
        xAxis: {
          type: "category",
          data: Array.from(column.getFacetedUniqueValues().keys())
        },
        yAxis: {
          type: "value"
        },
        dataZoom: [
          { type: "inside", yAxisIndex: 0 },
          { type: "slider", yAxisIndex: 0 },
          { type: "inside", xAxisIndex: 0 }
        ],
        toolbox: {
          bottom: 5,
          left: 5,
          feature: {
            saveAsImage: {},
            restore: {},
            dataView: {},
            dataZoom: {},
            magicType: { type: ["line", "bar", "stack"] }
          }
        },

        grid: { borderWidth: 1, borderColor: "#ea4899" },
        legend: { right: 5 },
        series: {
          name: column.id,
          emphasis: {
            focus: "series"
          },
          type: "bar",
          data: Array.from(column.getFacetedUniqueValues().values())
        }
      } as EChartsOption;

      toast.success(`add ${column.id} unique chart`, { id: column.id });
      return [...pre, option];
    });
  }, [column, setChartOptions]);

  return (
    <div className="flex items-center justify-between">
      <Field>Value</Field>
      <div className="w-[70%] flex items-center gap-1">
        <Popover modal open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex-1 justify-start">
              {selectedItem ? (
                <>{selectedItem.value}</>
              ) : (
                <div className="text-muted-foreground">Select value</div>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0" side="right" align="start">
            <Command>
              <CommandInput placeholder="Search unique value..." />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  {slicedUniqueValues.map((item) => (
                    <CommandItem
                      className="flex items-center justify-between"
                      key={item[0]}
                      value={item[0]}
                      onSelect={() => {
                        setSelectedItem({ value: item[0], count: item[1] });

                        setOpen(false);
                        column.setFilterValue(item[0]);
                      }}
                    >
                      <h1>{item[0]}</h1>
                      <h1>{item[1]}</h1>
                    </CommandItem>
                  ))}
                  {isMassive && (
                    <div className="flex items-center justify-between gap-1 flex-col py-1 bg-zinc-300 rounded-md">
                      <h1 className="text-foreground text-xs">
                        Many unique values can hinder interaction.
                      </h1>
                      <p className="text-muted-foreground text-xs">
                        but charts offer aggregated views.
                      </p>
                    </div>
                  )}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <CustomTooltip content="Visualize data by unique categories">
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
              addUniqueChart();
            }}
            size={"icon"}
            className="hover:text-pink-500"
            variant={"ghost"}
          >
            <MdOutlineDraw className="size-5" />
          </Button>
        </CustomTooltip>
      </div>
    </div>
  );
}

export default UniqueValueFilter;
