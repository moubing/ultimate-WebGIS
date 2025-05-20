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
import { H3ClusterLayer } from "@deck.gl/geo-layers";
import { getBoundsFromClusters, parseColorToRgbaArr } from "@/lib/utils";
import { toast } from "sonner";
import { layerBounds } from "@/lib/constants";
import { useMap } from "react-map-gl/maplibre";
import {
  H3ClusterLayerSchema,
  H3ClusterLayerSchemaType,
} from "./schema/H3ClusterLayerFormSchema";
import { cluster } from "@/lib/types";

function H3ClusterLayerForm({
  closeAllDialog,
}: {
  closeAllDialog: () => void;
}) {
  const setDeckLayers = useContext(SetDeckLayersContext);
  const { mainMap } = useMap();
  const form = useForm<H3ClusterLayerSchemaType>({
    resolver: zodResolver(H3ClusterLayerSchema),
    defaultValues: {
      id: "h3 cluster layer",
      data: "http://localhost:3000/example_data/sf.h3clusters.json",
      pickable: true,
      stroked: true,
      lineWidthMinPixels: 2,
      getHexagons: "hexIds",
      getFillColor: "mean",
      getLineColor: "emerald",
    },
  });
  const onSubmit = useCallback(
    (values: H3ClusterLayerSchemaType) => {
      if (!setDeckLayers) return;
      setDeckLayers((pre) => [
        ...pre,
        new H3ClusterLayer({
          id: values.id,
          data: values.data,
          dataTransform: <LayerDataT,>(data: unknown): LayerDataT => {
            setTimeout(() => {
              const bounds = getBoundsFromClusters(data as cluster[]);
              layerBounds[values.id] = bounds;
              mainMap?.fitBounds(bounds, {
                padding: 100,
              });
            }, 0);
            return data as LayerDataT;
          },
          pickable: values.pickable,
          stroked: values.stroked,
          getHexagons: (d) => d[values.getHexagons],
          getFillColor: (d) => [
            255,
            (1 - d[values.getFillColor] / 500) * 255,
            0,
          ],
          getLineColor: parseColorToRgbaArr(values.getLineColor),
          lineWidthMinPixels: values.lineWidthMinPixels,
        }),
      ]);

      toast.success("Add h3 cluster layer to map");
      closeAllDialog();
    },
    [setDeckLayers, closeAllDialog, mainMap]
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
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
                This is your h3 cluster layer name.
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
                This is your h3 cluster layer source data.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="lineWidthMinPixels"
            render={({ field }) => (
              <FormItem>
                <FormLabel>lineWidthMinPixels :</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="input lineWidthMinPixels..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This is your h3 cluster layer lineWidthMinPixels.
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
                <FormLabel>getLineColor:</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a getLineColor" />
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
                <FormDescription>Assign getLineColor.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
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
            name="stroked"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Layer is stroked</FormLabel>
                  <FormDescription>Set layer stroked option.</FormDescription>
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
        <div className="grid grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="getHexagons"
            render={({ field }) => (
              <FormItem>
                <FormLabel>getHexagons field:</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="getHexagons field..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>Assign getHexagons.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="getFillColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>getFillColor field:</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="getFillColor field..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>Assign getFillColor.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button className="w-full" type="submit">
          Add to Map
        </Button>
      </form>
    </Form>
  );
}

export default H3ClusterLayerForm;
