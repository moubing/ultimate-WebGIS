"use client";

import { EChartsOption } from "echarts";
import EChartsReact from "echarts-for-react";
import React, { memo, useMemo } from "react";
import { Header } from "../../layer-configure-com/Labels";
import { HistogramType } from "@/lib/types";

const Histogram = memo(function Histogram({
  histogram
}: {
  histogram: HistogramType;
}) {
  const interval = useMemo(() => {
    return (histogram.max - histogram.min) / histogram.count;
  }, [histogram.count, histogram.max, histogram.min]);

  const XData = useMemo(() => {
    const result: string[] = [];

    for (let i = 0; i < histogram.count; i++) {
      const start = histogram.min + i * interval;
      const center = start + interval / 2;
      result.push(center.toFixed(2));
    }
    return result;
  }, [histogram.count, histogram.min, interval]);

  const chartOption = useMemo(() => {
    return {
      tooltip: {
        trigger: "axis"
      },
      grid: {
        left: 55,
        top: 10,
        right: 5,
        bottom: 40
      },
      xAxis: {
        type: "category", // 明确指定为 category 类型
        data: XData // 确保数据为字符串类型
      },
      yAxis: {
        type: "value"
      },
      series: [
        {
          type: "bar",
          data: histogram.buckets,
          itemStyle: {
            color: "#ea4899"
          },
          barWidth: "99%"
        }
      ],
      dataZoom: [
        {
          type: "slider",
          xAxisIndex: 0,
          start: 0,
          end: 50,
          bottom: 0,
          top: 180,
          height: 15
        },
        {
          type: "inside",
          xAxisIndex: 0,
          start: 0,
          end: 50
        }
      ]
    } as EChartsOption;
  }, [XData, histogram.buckets]);

  return (
    <div className="flex flex-col gap-2 p-1 ">
      <Header>Histogram</Header>
      <div className="outline- outline-zinc-300 rounded-md h-[200px]">
        <EChartsReact
          option={chartOption}
          style={{ height: "100%", width: "100%" }}
        />
      </div>
    </div>
  );
});

export default Histogram;
