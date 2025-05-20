import { z } from "zod";

const seriesSchema = z.object({
  type: z.union([z.literal("line"), z.literal("bar"), z.literal("scatter")]),
  name: z.string(),
  smooth: z.boolean().optional(),
  dataY: z.string(),
  areaStyle: z.boolean().optional(),
  symbolSize: z.coerce.number().optional(),
  symbol: z
    .union([
      z.literal("circle"),
      z.literal("rect"),
      z.literal("roundRect"),
      z.literal("triangle"),
      z.literal("diamond"),
      z.literal("pin"),
      z.literal("arrow"),
      z.literal("none"),
    ])
    .optional(),
});

export const ChartSchema = z.object({
  // title
  name: z.string(),
  color: z.string(),
  fontSize: z.coerce.number(),
  // tooltip
  triggerOn: z.union([z.literal("mousemove"), z.literal("click")]),
  axisPointer: z.union([
    z.literal("line"),
    z.literal("shadow"),
    z.literal("cross"),
    z.literal("none"),
  ]),
  // toolbox
  toolboxArray: z.array(z.boolean()).length(5),
  // dataZoom
  dataZoomArray: z.array(z.boolean()).length(4),
  // legend
  legend: z.boolean(),
  // xAxis
  typeX: z.union([z.literal("category"), z.literal("value")]),

  dataX: z.string(),
  // yAxis
  typeY: z.union([z.literal("category"), z.literal("value")]),
  // series
  series: z.array(seriesSchema),

  // dataType
  dataType: z.union([z.literal("raw"), z.literal("filtered")]),
});

export type ChartSchemaType = z.infer<typeof ChartSchema>;
export type seriesType = z.infer<typeof seriesSchema>;
