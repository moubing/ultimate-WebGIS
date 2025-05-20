"use client";

import {
  ChartOptionsContext,
  SetChartOptionsContext,
} from "@/app/providers/tabelContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table } from "@tanstack/react-table";
import ReactECharts from "echarts-for-react";
import { Cardio } from "ldrs/react";
import { useContext } from "react";
import AddChartBtn from "./AddChartBtn";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import CustomTooltip from "@/components/custom-ui/CustomTooltip";
import { TitleComponentOption } from "echarts";

function ChartContainer<TData>({ table }: { table: Table<TData> }) {
  const chartOptions = useContext(ChartOptionsContext);
  const setChartOptions = useContext(SetChartOptionsContext);

  return (
    <Card className=" flex-grow-0 border-0 shadow-none p-0 ">
      <CardHeader className=" p-0 pb-2 relative ">
        <CardTitle>Charts</CardTitle>
        <CardDescription>visualize your data</CardDescription>
        <div className="absolute -top-1.5 right-0 gap-2 flex items-center ">
          <AddChartBtn table={table} />
        </div>
      </CardHeader>
      <ScrollArea className="h-[540px]">
        <CardContent className="flex flex-col gap-2  p-0 w-full h-[540px]">
          {chartOptions.length > 0 ? (
            chartOptions.map((option) => (
              <div
                key={(option.title as TitleComponentOption)?.text}
                className="relative p-2 rounded-lg bg-sky-100/30 backdrop-blur-lg"
              >
                <ReactECharts
                  option={option}
                  style={{
                    width: "100%",
                    minWidth: "330px",
                    minHeight: "250px",
                  }}
                />
                <CustomTooltip content="remove chart">
                  <Button
                    onClick={() =>
                      setChartOptions((pre) =>
                        pre.filter(
                          (item) =>
                            (option.title as TitleComponentOption)?.text !==
                            (item.title as TitleComponentOption)?.text
                        )
                      )
                    }
                    className="absolute right-2 bottom-4"
                    variant={"destructive"}
                    size={"sm"}
                  >
                    <Trash2Icon className="size-4" />
                  </Button>
                </CustomTooltip>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center gap-2">
              <Cardio
                size="60"
                stroke="4"
                speed="2"
                color={`hsl(var(--foreground))`}
              />
              <h1 className="text-sm text-foreground text-center mt-2">
                No charts yet.
              </h1>
              <p className="text-xs text-center text-muted-foreground">
                Click <span className="text-pink-500 ">add chart</span> button
                to create your first chart.
              </p>
            </div>
          )}
        </CardContent>
      </ScrollArea>
    </Card>
  );
}

export default ChartContainer;
