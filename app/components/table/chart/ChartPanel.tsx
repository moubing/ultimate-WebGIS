"use client";

import {
  ChartOptionsContext,
  SetChartOptionsContext
} from "@/app/providers/tabelContext";
import CustomTooltip from "@/components/custom-ui/CustomTooltip";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TitleComponentOption } from "echarts";
import ReactECharts from "echarts-for-react";
import { Trash2Icon } from "lucide-react";
import { useContext } from "react";

function ChartPanel() {
  const chartOptions = useContext(ChartOptionsContext);
  const setChartOptions = useContext(SetChartOptionsContext);
  console.log(chartOptions, "chart option");

  return (
    chartOptions &&
    chartOptions.length > 0 && (
      <Card className="bg-background/80 dark:bg-background/90">
        <CardContent className="p-0 flex items-center gap-2 overflow-auto">
          {chartOptions.length > 0 &&
            chartOptions.map((option) => (
              <div
                key={(option.title as TitleComponentOption)?.text}
                className="relative bg-transparent rounded-lg "
              >
                <ReactECharts
                  option={option}
                  style={{
                    width: "400px",
                    height: "240px",
                    backgroundColor: "transparent"
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
            ))}
        </CardContent>
      </Card>
    )
  );
}

export default ChartPanel;
