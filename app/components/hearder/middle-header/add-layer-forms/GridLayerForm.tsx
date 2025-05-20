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
import { SetDeckLayersContext } from "@/app/providers/contexts";
import { GridLayer } from "@deck.gl/aggregation-layers";
import { getPointLayerBounds } from "@/lib/utils";
import { toast } from "sonner";
import { layerBounds } from "@/lib/constants";
import { useMap } from "react-map-gl/maplibre";
import {
  GridLayerFormSchema,
  GridLayerFormSchemaType,
} from "./schema/GridLayerFormSchema";

function GridLayerForm({ closeAllDialog }: { closeAllDialog: () => void }) {
  const setDeckLayers = useContext(SetDeckLayersContext);
  const { mainMap } = useMap();
  const form = useForm<GridLayerFormSchemaType>({
    resolver: zodResolver(GridLayerFormSchema),
    defaultValues: {
      id: "grid layer",
      data: "http://localhost:3000/example_data/sf-bike-parking.json",
      pickable: true,
      extruded: true,
      cellSize: 200,
      elevationScale: 4,
      getPosition: "COORDINATES",
      getColorWeight: "SPACES",
      getElevationWeight: "SPACES",
      gpuAggregation: true,
    },
  });
  const onSubmit = useCallback(
    (values: GridLayerFormSchemaType) => {
      if (!setDeckLayers) return;
      setDeckLayers((pre) => [
        ...pre,
        new GridLayer({
          id: values.id,
          data: values.data,
          dataTransform: <LayerDataT,>(data: unknown): LayerDataT => {
            setTimeout(() => {
              const bounds = getPointLayerBounds(
                data as unknown[],
                values.getPosition
              );
              layerBounds[values.id] = bounds;
              mainMap?.fitBounds(bounds, {
                padding: 100,
              });
            }, 0);
            return data as LayerDataT;
          },
          extruded: values.extruded,
          pickable: values.pickable,
          cellSize: values.cellSize,
          elevationScale: values.elevationScale,
          getPosition: (d) => d[values.getPosition],
          gpuAggregation: values.gpuAggregation,
          getColorWeight: (d) => d[values.getColorWeight],
          getElevationWeight: (d) => d[values.getElevationWeight],
        }),
      ]);

      toast.success("Add grid layer to map");
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
              <FormDescription>This is your GridLayer name.</FormDescription>
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
                This is your GridLayer source data.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 grid-rows-1 gap-2">
          <FormField
            control={form.control}
            name="cellSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>cellSize:</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="input cellSize..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This is your ColumnLayer cellSize.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="elevationScale"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Elevation scale:</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="input elevation scale..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This is your ColumnLayer elevation scale.
                </FormDescription>
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
            name="extruded"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Layer is extruded</FormLabel>
                  <FormDescription>Set layer extruded option.</FormDescription>
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
        <div className="grid grid-cols-3 grid-rows-1 gap-2">
          <FormField
            control={form.control}
            name="getPosition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Position field:</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Position field..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>Assign position.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="getColorWeight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>getColorWeight field:</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="getColorWeight field..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>Assign getColorWeight.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="getElevationWeight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>getElevationWeight field:</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="getElevationWeight field..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>Assign getElevationWeight.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="gpuAggregation"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>gpuAggregation</FormLabel>
                <FormDescription>Set gpuAggregation.</FormDescription>
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
        <Button className="w-full" type="submit">
          Add to Map
        </Button>
      </form>
    </Form>
  );
}

export default GridLayerForm;
