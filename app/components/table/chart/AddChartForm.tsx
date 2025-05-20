"use client";

import React, { useCallback, useContext, useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { ChartSchema, ChartSchemaType } from "./ChartSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { SetChartOptionsContext } from "@/app/providers/tabelContext";
import { EChartsOption } from "echarts";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table } from "@tanstack/react-table";
import {
  cn,
  convertFeatureArrayToFlatArry,
  getDimensionsFromFeatureArray
} from "@/lib/utils";
import { Feature } from "geojson";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import CustomToggleGroup from "@/components/custom-ui/CustomToggleGroup";
import {
  dataZoomArray,
  echartColorPalette,
  toolboxArray
} from "@/lib/constants";
import { Switch } from "@/components/ui/switch";
import ColorPalette from "@/components/custom-ui/ColorPalette";
import { MdAddchart, MdOutlineDraw } from "react-icons/md";
import { Trash2Icon } from "lucide-react";
import { Block, BlockTitle } from "@/components/custom-ui/Block";

function AddChartForm<TData>({
  table,
  closeDialog
}: {
  table: Table<TData>;
  closeDialog: () => void;
}) {
  const setChartOptions = useContext(SetChartOptionsContext);

  const rawRows = useMemo(() => {
    return convertFeatureArrayToFlatArry(table.options.data as Feature[]);
  }, [table.options.data]);

  const dimensions = useMemo(() => {
    return getDimensionsFromFeatureArray(table.options.data as Feature[]);
  }, [table.options.data]);

  const filterModleRows = table.getFilteredRowModel().rows;

  const filteredRows = useMemo(() => {
    return convertFeatureArrayToFlatArry(
      filterModleRows.map((row) => row.original) as Feature[]
    );
  }, [filterModleRows]);

  const form = useForm<ChartSchemaType>({
    resolver: zodResolver(ChartSchema),
    defaultValues: {
      name: "untitled",
      color: "#ea4899",
      fontSize: 16,
      triggerOn: "mousemove",
      axisPointer: "cross",
      toolboxArray: [true, true, false, true, true],
      dataZoomArray: [true, true, true, true],
      legend: true,
      typeX: "category",
      typeY: "value",
      dataType: "raw",
      series: [
        {
          type: "line",
          name: "chart 1",
          smooth: false,
          dataY: dimensions[0],
          areaStyle: false,
          symbolSize: 8,
          symbol: "circle"
        }
      ]
    }
  });

  const onSubmit = useCallback(
    (values: ChartSchemaType) => {
      setChartOptions((pre) => {
        const option = {
          title: {
            text: values.name,
            textStyle: { color: values.color, fontSize: values.fontSize }
          },
          color: echartColorPalette,
          tooltip: {
            triggerOn: values.triggerOn,
            axisPointer: { type: values.axisPointer },
            trigger: "axis"
          },
          dataset: {
            dimensions,
            source: values.dataType === "raw" ? rawRows : filteredRows
          },
          xAxis: {
            type: values.typeX
          },
          yAxis: {
            type: values.typeY
          },
          dataZoom: [
            values.dataZoomArray[0]
              ? { type: "inside", xAxisIndex: 0 }
              : undefined,
            values.dataZoomArray[1]
              ? { type: "inside", yAxisIndex: 0 }
              : undefined,
            values.dataZoomArray[2]
              ? { type: "slider", xAxisIndex: 0 }
              : undefined,
            values.dataZoomArray[3]
              ? { type: "slider", yAxisIndex: 0 }
              : undefined
          ],
          toolbox: {
            top: 40,
            left: -5,
            orient: "vertical",
            feature: {
              saveAsImage: values.toolboxArray[0] ? {} : undefined,
              restore: values.toolboxArray[1] ? {} : undefined,
              dataView: values.toolboxArray[2] ? {} : undefined,
              dataZoom: values.toolboxArray[3] ? {} : undefined,
              magicType: values.toolboxArray[4]
                ? { type: ["line", "bar", "stack"] }
                : undefined
            }
          },

          grid: { borderWidth: 1, borderColor: "#ea4899", left: 50, right: 50 },
          legend: values.legend ? {} : undefined,
          series: (() => {
            return values.series.map((item) => {
              return {
                name: item.name,
                emphasis: {
                  focus: "series"
                },
                type: item.type,
                smooth: item.smooth,
                areaStyle: item.areaStyle,
                encode: { x: values.dataX, y: item.dataY },
                symbolSize: item.symbolSize,
                symbol: item.symbol
              };
            });
          })()
        } as EChartsOption;

        return [...pre, option];
      });
      toast.success("add chart");
      closeDialog();
    },
    [setChartOptions, dimensions, rawRows, filteredRows, closeDialog]
  );
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "series"
  });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <Block>
          <BlockTitle>Title</BlockTitle>
          <div className="grid grid-cols-3 gap-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chart title:</FormLabel>
                  <FormControl>
                    <Input placeholder="input title..." {...field} />
                  </FormControl>
                  <FormDescription>
                    Your chart’s unique identifier.
                  </FormDescription>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fontSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Font size:</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="input font size..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Adjust the font size of the title.
                  </FormDescription>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title color:</FormLabel>
                  <FormControl>
                    <ColorPalette
                      side="right"
                      align="start"
                      sideOffset={10}
                      className="w-full"
                      initialColor={field.value}
                      updateColor={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    Adjust the color of the title.
                  </FormDescription>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Block>
        <Block>
          <BlockTitle>Tooltip</BlockTitle>
          <div className="grid grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="triggerOn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trigger on:</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="mousemove">mousemove</SelectItem>
                      <SelectItem value="click">click</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose how to trigger tooltips.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="axisPointer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Axis pointer:</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="line">line</SelectItem>
                      <SelectItem value="shadow">shadow</SelectItem>
                      <SelectItem value="cross">cross</SelectItem>
                      <SelectItem value="none">none</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose the type of axis pointer.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Block>

        <Block>
          <BlockTitle>Tool box</BlockTitle>
          <FormField
            control={form.control}
            name="toolboxArray"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tool box features:</FormLabel>
                <FormControl>
                  <CustomToggleGroup
                    arr={toolboxArray}
                    initialState={field.value}
                    updateStates={field.onChange}
                  />
                </FormControl>
                <FormDescription>
                  Select enable tool box features.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </Block>
        <Block>
          <BlockTitle>Data zoom</BlockTitle>
          <FormField
            control={form.control}
            name="dataZoomArray"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zoom components:</FormLabel>
                <FormControl>
                  <CustomToggleGroup
                    arr={dataZoomArray}
                    initialState={field.value}
                    updateStates={field.onChange}
                  />
                </FormControl>
                <FormDescription>
                  Specify which dataZoom components to enable.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </Block>

        <FormField
          control={form.control}
          name="legend"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm ">
              <div className="space-y-0.5">
                <FormLabel>Enable legend</FormLabel>
                <FormDescription>
                  Toggle series and hover highlight.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Block>
          <BlockTitle>Axis</BlockTitle>
          <div className="grid  grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="typeX"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>X axis type:</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="category">category</SelectItem>
                      <SelectItem value="value">value</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Category or value type.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="typeY"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Y axis type:</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="category">category</SelectItem>
                      <SelectItem value="value">value</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Category or value type.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Block>
        <Block>
          <BlockTitle>Assign data</BlockTitle>
          <div className="grid grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="dataX"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>X axis field:</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select field" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {dimensions.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Specify x axis data.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dataType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Choose data type:</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="raw">raw</SelectItem>
                      <SelectItem value="filtered">filtered</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Raw or filtered data type.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Block>

        {fields.map((field, index) => (
          <Block key={field.id}>
            <BlockTitle>
              <div className="flex items-center justify-between">
                <h4>Serise #{index + 1}</h4>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => remove(index)}
                >
                  <Trash2Icon className="size-5" />
                </Button>
              </div>
            </BlockTitle>
            <FormField
              control={form.control}
              name={`series.${index}.name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Series Name</FormLabel>

                  <FormControl>
                    <Input placeholder="Series name" {...field} />
                  </FormControl>
                  <FormDescription>
                    Set series name (for Legend).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name={`series.${index}.type`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chart Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="line">Line</SelectItem>
                        <SelectItem value="bar">Bar</SelectItem>
                        <SelectItem value="scatter">Scatter</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose the type of visualization.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`series.${index}.dataY`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Y Axis Data</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select data" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {dimensions.map((dimension) => (
                          <SelectItem key={dimension} value={dimension}>
                            {dimension}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Specify y axis data.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div
              className={cn(
                "grid grid-cols-2 gap-2",
                form.getValues("series")[index].type === "bar" && " grid-cols-1"
              )}
            >
              {form.getValues("series")[index].type === "line" && (
                <FormField
                  control={form.control}
                  name={`series.${index}.smooth`}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm ">
                      <div className="space-y-0.5">
                        <FormLabel>Soomth line</FormLabel>
                        <FormDescription>
                          Apply Curve Smoothing.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {form.getValues("series")[index].type === "scatter" && (
                <>
                  <FormField
                    control={form.control}
                    name={`series.${index}.symbolSize`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Symbol size:</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="input symbol size..."
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Adjust the Symbol size of the scatter.
                        </FormDescription>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`series.${index}.symbol`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Symbol Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="circle">circle</SelectItem>
                            <SelectItem value="rect">rect</SelectItem>
                            <SelectItem value="roundeRect">
                              roundeRect
                            </SelectItem>
                            <SelectItem value="triangle">triangle</SelectItem>
                            <SelectItem value="diamond">diamond</SelectItem>
                            <SelectItem value="pin">pin</SelectItem>
                            <SelectItem value="arrow">arrow</SelectItem>
                            <SelectItem value="none">none</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Choose the type of visualization.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              {form.getValues("series")[index].type !== "scatter" && (
                <FormField
                  control={form.control}
                  name={`series.${index}.areaStyle`}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm ">
                      <div className="space-y-0.5">
                        <FormLabel>Area style</FormLabel>
                        <FormDescription>
                          Add gradient fill below the line.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </Block>
        ))}
        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="confirm"
            className=""
            onClick={() =>
              append({
                type: "line",
                name: `chart ${fields.length + 1}`,
                smooth: false,
                dataY: dimensions[0],
                areaStyle: true
              })
            }
          >
            <MdAddchart className="size-5" />
            New Series
          </Button>

          <Button className="" type="submit">
            <MdOutlineDraw className="size-5" />
            Start plot
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default AddChartForm;
