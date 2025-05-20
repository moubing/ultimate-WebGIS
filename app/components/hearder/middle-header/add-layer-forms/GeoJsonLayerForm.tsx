"use client";

import React, { useCallback, useContext } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SetDeckLayersContext } from "@/app/providers/contexts";
import { GeoJsonLayer } from "@deck.gl/layers";
import { getPointType, parseColorToRgbaArr } from "@/lib/utils";
import { toast } from "sonner";
import { layerBounds } from "@/lib/constants";
import { useMap } from "react-map-gl/maplibre";
import {
  GeoJsonLayerFormSchema,
  GeoJsonLayerFormSchemaType,
} from "./schema/GeoJsonLayerFormSchema";
import { Separator } from "@/components/ui/separator";
import * as turf from "@turf/turf";

function GeoJsonLayerForm({ closeAllDialog }: { closeAllDialog: () => void }) {
  const setDeckLayers = useContext(SetDeckLayersContext);
  const { mainMap } = useMap();
  const form = useForm<GeoJsonLayerFormSchemaType>({
    resolver: zodResolver(GeoJsonLayerFormSchema),
    defaultValues: {
      id: "geojson layer",
      data: "http://localhost:3000/example_data/bart.geo.json",

      circleType: true,
      iconType: false,
      textType: true,
      pickable: true,

      filled: true,
      getFillColor: "indigo",

      stroked: true,
      lineJointRounded: false,
      lineCapRounded: false,
      lineBillboard: false,
      getLineColor: "lime",
      getLineWidth: 12,
      lineWidthScale: 1,

      extruded: true,
      wireframe: false,
      getElevation: 1000,

      getPointRadius: 1,
      pointRadiusScale: 1,
      pointAntialiasing: true,
      pointBillboard: false,

      getIcon: "icon",
      getIconSize: 1,
      getIconColor: "gray",
      iconSizeScale: 1,
      getIconAngle: 0,
      getIconPixelXOffset: 0,
      getIconPixelYOffset: 0,
      iconBillboard: false,

      getText: "text",
      getTextColor: "emerald",
      getTextAngle: 0,
      getTextSize: 32,
      textSizeScale: 1,
      textOutlineColor: "gray",
      textOutlineWidth: 1,
      textBillboard: true,
    },
  });
  const onSubmit = useCallback(
    (values: GeoJsonLayerFormSchemaType) => {
      if (!setDeckLayers) return;
      setDeckLayers((pre) => [
        ...pre,
        new GeoJsonLayer({
          id: values.id,
          data: values.data,
          dataTransform: <LayerDataT,>(data: unknown): LayerDataT => {
            setTimeout(() => {
              const bounds = turf.bbox(data as turf.AllGeoJSON);
              layerBounds[values.id] = bounds as [
                number,
                number,
                number,
                number
              ];
              mainMap?.fitBounds(bounds as [number, number, number, number], {
                padding: 100,
              });
            }, 0);
            return data as LayerDataT;
          },
          pickable: values.pickable,
          pointType: getPointType(
            values.circleType,
            values.iconType,
            values.textType
          ),
          filled: values.filled,
          getFillColor: parseColorToRgbaArr(values.getFillColor),

          stroked: values.stroked,
          getLineColor: parseColorToRgbaArr(values.getLineColor),
          getLineWidth: values.getLineWidth,
          lineCapRounded: values.lineCapRounded,
          lineWidthScale: values.lineWidthScale,
          lineJointRounded: values.lineJointRounded,
          lineBillboard: values.lineBillboard,

          extruded: values.extruded,
          wireframe: values.wireframe,
          getElevation: values.getElevation,

          getPointRadius: values.getPointRadius,
          pointRadiusScale: values.pointRadiusScale,
          pointAntialiasing: values.pointAntialiasing,
          pointBillboard: values.pointBillboard,

          getIcon: (d) => d[values.getIcon],
          getIconSize: values.getIconSize,
          iconSizeScale: values.iconSizeScale,
          getIconAngle: values.getIconAngle,
          getIconColor: parseColorToRgbaArr(values.getIconColor),
          getIconPixelOffset: [
            values.getIconPixelXOffset,
            values.getIconPixelYOffset,
          ],
          iconBillboard: values.iconBillboard,

          getText: (d) => d[values.getText],
          getTextColor: parseColorToRgbaArr(values.getTextColor),
          getTextAngle: values.getTextAngle,
          getTextSize: values.getTextSize,
          textSizeScale: values.textSizeScale,
          textOutlineColor: parseColorToRgbaArr(values.textOutlineColor),
          textOutlineWidth: values.textOutlineWidth,

          lineWidthMinPixels: 10,
        }),
      ]);

      toast.success("Add geojson layer to map");
      closeAllDialog();
    },
    [setDeckLayers, closeAllDialog, mainMap]
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <div className=" columns-3">
          <div className="grid grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Layer id:</FormLabel>
                  <FormControl>
                    <Input placeholder="input layer id..." {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your geojson layer name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="data"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data url:</FormLabel>
                  <FormControl>
                    <Input placeholder="input data url..." {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your geojson layer source data.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />
          <h1 className="text-lg text-sky-500">Fill</h1>
          <div className="grid grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="filled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Enable polygon fill</FormLabel>
                    <FormDescription>Set polygon fill.</FormDescription>
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
            <FormField
              control={form.control}
              name="getFillColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fill color:</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a fill color" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="gray">gray</SelectItem>
                      <SelectItem value="red">red</SelectItem>
                      <SelectItem value="orange">orange</SelectItem>
                      <SelectItem value="amber">amber</SelectItem>
                      <SelectItem value="lime">lime</SelectItem>
                      <SelectItem value="emerald">emerald</SelectItem>
                      <SelectItem value="cyan">cyan</SelectItem>
                      <SelectItem value="indigo">indigo</SelectItem>
                      <SelectItem value="fuchsia">fuchsia</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Assign fill color.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />
          <h1 className="text-lg text-sky-500">Stroked</h1>
          <div className="grid grid-cols-2 grid-rows-2 gap-2">
            <FormField
              control={form.control}
              name="stroked"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Enable stroked</FormLabel>
                    <FormDescription>Set stroked</FormDescription>
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
            <FormField
              control={form.control}
              name="lineBillboard"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Enable lineBillboard</FormLabel>
                    <FormDescription>Set lineBillboard.</FormDescription>
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
            <FormField
              control={form.control}
              name="lineCapRounded"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Enable lineCapRounded</FormLabel>
                    <FormDescription>Set lineCapRounded</FormDescription>
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
            <FormField
              control={form.control}
              name="lineJointRounded"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Enable lineJointRounded</FormLabel>
                    <FormDescription>Set lineJointRounded.</FormDescription>
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
          </div>
          <div className="grid grid-cols-3 gap-2">
            <FormField
              control={form.control}
              name="getLineWidth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LineWidth:</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="input LineWidth..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>This is your line width.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lineWidthScale"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>lineWidthScale:</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="input lineWidthScale..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is your lineWidthScale .
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="getLineColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Strok color:</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Stroke color" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="gray">gray</SelectItem>
                      <SelectItem value="red">red</SelectItem>
                      <SelectItem value="orange">orange</SelectItem>
                      <SelectItem value="amber">amber</SelectItem>
                      <SelectItem value="lime">lime</SelectItem>
                      <SelectItem value="emerald">emerald</SelectItem>
                      <SelectItem value="cyan">cyan</SelectItem>
                      <SelectItem value="indigo">indigo</SelectItem>
                      <SelectItem value="fuchsia">fuchsia</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Assign stroke color.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Separator />
          <h1 className="text-lg text-sky-500">3D</h1>
          <div className="grid grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="extruded"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>extruded</FormLabel>
                    <FormDescription>Set extruded.</FormDescription>
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
            <FormField
              control={form.control}
              name="wireframe"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>wireframe</FormLabel>
                    <FormDescription>Set wireframe.</FormDescription>
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
          </div>
          <FormField
            control={form.control}
            name="getElevation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Elevation:</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="input Elevation..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>This is your Elevation.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Separator />
          <h1 className="text-lg text-sky-500">Point type</h1>
          <div className="grid grid-cols-2 grid-rows-2 gap-2">
            <FormField
              control={form.control}
              name="pickable"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Layer is pickable</FormLabel>
                    <FormDescription>Set layer pick option.</FormDescription>
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
            <FormField
              control={form.control}
              name="circleType"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Enable circle type</FormLabel>
                    <FormDescription>Set point type.</FormDescription>
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
            <FormField
              control={form.control}
              name="iconType"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Enable icon type</FormLabel>
                    <FormDescription>Set point type.</FormDescription>
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
            <FormField
              control={form.control}
              name="textType"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Enable text type</FormLabel>
                    <FormDescription>Set point type.</FormDescription>
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
          </div>
          <Separator />
          <h1 className="text-lg text-sky-500">Circle</h1>
          <div className="grid grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="getPointRadius"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PointRadius:</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="input PointRadius..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>This is your PointRadius.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pointRadiusScale"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>pointRadiusScale:</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="input pointRadiusScale..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is your pointRadiusScale.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="pointAntialiasing"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>pointAntialiasing</FormLabel>
                    <FormDescription>Set pointAntialiasing.</FormDescription>
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
            <FormField
              control={form.control}
              name="pointBillboard"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>pointBillboard</FormLabel>
                    <FormDescription>Set pointBillboard.</FormDescription>
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
          </div>

          <Separator />
          <h1 className="text-lg text-sky-500">Icon</h1>
          <div className="grid grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="getIcon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon field:</FormLabel>
                  <FormControl>
                    <Input placeholder="input Icon field..." {...field} />
                  </FormControl>
                  <FormDescription>This is your Icon field.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="iconBillboard"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>iconBillboard</FormLabel>
                    <FormDescription>Set iconBillboard.</FormDescription>
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
          </div>

          <div className="grid grid-cols-3 gap-2">
            <FormField
              control={form.control}
              name="getIconSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>getIconSize:</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="input getIconSize..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>This is your getIconSize.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="iconSizeScale"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>iconSizeScale:</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="input iconSizeScale..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>This is your iconSizeScale.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="getIconAngle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IconAngle:</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="input IconAngle..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>This is your IconAngle.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="getIconPixelXOffset"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IconPixelXOffset:</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="input IconPixelXOffset..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is your IconPixelXOffset.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="getIconPixelYOffset"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IconPixelYOffset:</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="inputIconPixelYOffset..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is your IconPixelYOffset.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="getIconColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon color:</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Icon color" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="gray">gray</SelectItem>
                      <SelectItem value="red">red</SelectItem>
                      <SelectItem value="orange">orange</SelectItem>
                      <SelectItem value="amber">amber</SelectItem>
                      <SelectItem value="lime">lime</SelectItem>
                      <SelectItem value="emerald">emerald</SelectItem>
                      <SelectItem value="cyan">cyan</SelectItem>
                      <SelectItem value="indigo">indigo</SelectItem>
                      <SelectItem value="fuchsia">fuchsia</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Assign fill color.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />
          <h1 className="text-lg text-sky-500">Text</h1>
          <div className="grid grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="getText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Text field:</FormLabel>
                  <FormControl>
                    <Input placeholder="input Text field..." {...field} />
                  </FormControl>
                  <FormDescription>This is your Text field.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="textBillboard"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>textBillboard</FormLabel>
                    <FormDescription>Set textBillboard.</FormDescription>
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
          </div>

          <div className="grid grid-cols-3 gap-2">
            <FormField
              control={form.control}
              name="getTextAngle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>getTextAngle:</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="input getTextAngle..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>This is your getTextAngle.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="textSizeScale"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IconAngle:</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="input textSizeScale..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>This is your textSizeScale.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="getTextSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>getTextSize:</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="input getTextSize..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>This is your getTextSize.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="textOutlineWidth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>textOutlineWidth:</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="input textOutlineWidth..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is your textOutlineWidth.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="getTextColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>getTextColor:</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a getTextColor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="gray">gray</SelectItem>
                      <SelectItem value="red">red</SelectItem>
                      <SelectItem value="orange">orange</SelectItem>
                      <SelectItem value="amber">amber</SelectItem>
                      <SelectItem value="lime">lime</SelectItem>
                      <SelectItem value="emerald">emerald</SelectItem>
                      <SelectItem value="cyan">cyan</SelectItem>
                      <SelectItem value="indigo">indigo</SelectItem>
                      <SelectItem value="fuchsia">fuchsia</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Assign getTextColor.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="textOutlineColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>textOutlineColor:</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a textOutlineColor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="gray">gray</SelectItem>
                      <SelectItem value="red">red</SelectItem>
                      <SelectItem value="orange">orange</SelectItem>
                      <SelectItem value="amber">amber</SelectItem>
                      <SelectItem value="lime">lime</SelectItem>
                      <SelectItem value="emerald">emerald</SelectItem>
                      <SelectItem value="cyan">cyan</SelectItem>
                      <SelectItem value="indigo">indigo</SelectItem>
                      <SelectItem value="fuchsia">fuchsia</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Assign textOutlineColor.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <Button className="w-full" type="submit">
          Add to Map
        </Button>
      </form>
    </Form>
  );
}

export default GeoJsonLayerForm;
