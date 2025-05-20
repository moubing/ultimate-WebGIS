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
import { SetDeckLayersContext } from "@/app/providers/contexts";
import { getPointLayerBounds } from "@/lib/utils";
import { toast } from "sonner";
import { layerBounds } from "@/lib/constants";
import { useMap } from "react-map-gl/maplibre";
import { HexagonLayer } from "@deck.gl/aggregation-layers";
import {
  HexagonLayerSchema,
  HexagonLayerSchemaType,
} from "./schema/HexagonLayerFormSchema";
import { Switch } from "@/components/ui/switch";

function HexagonLayerForm({ closeAllDialog }: { closeAllDialog: () => void }) {
  const setDeckLayers = useContext(SetDeckLayersContext);
  const { mainMap } = useMap();
  const form = useForm<HexagonLayerSchemaType>({
    resolver: zodResolver(HexagonLayerSchema),
    defaultValues: {
      id: "hexagon layer",
      data: "http://localhost:3000/example_data/sf-bike-parking.json",

      gpuAggregation: true,
      extruded: true,
      getPosition: "COORDINATES",
      getColorWeight: "SPACES",
      getElevationWeight: "SPACES",
      elevationScale: 4,
      radius: 200,
      pickable: true,
    },
  });
  const onSubmit = useCallback(
    (values: HexagonLayerSchemaType) => {
      if (!setDeckLayers) return;
      setDeckLayers((pre) => [
        ...pre,
        new HexagonLayer({
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
          gpuAggregation: values.gpuAggregation,
          extruded: values.extruded,
          getPosition: (d) => d[values.getPosition],
          getColorWeight: (d) => d[values.getColorWeight],
          getElevationWeight: (d) => d[values.getElevationWeight],
          elevationScale: values.elevationScale,
          radius: values.radius,
          pickable: values.pickable,
        }),
      ]);

      toast.success("Add hexagon layer to map");
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
                This is your hexagon layer name.
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
                This is your hexagon layer source data.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="radius"
            render={({ field }) => (
              <FormItem>
                <FormLabel>radius :</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="input radius..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This is your hexagon layer radius.
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
                <FormLabel>elevationScale :</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="input elevationScale..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This is your hexagon layer elevationScale.
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

        <div className="grid grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="getPosition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>getPosition field:</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="getPosition field..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>Assign getPosition.</FormDescription>
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
          <FormField
            control={form.control}
            name="gpuAggregation"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Layer is gpuAggregation</FormLabel>
                  <FormDescription>
                    Set layer gpuAggregation option.
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
        </div>

        <Button className="w-full" type="submit">
          Add to Map
        </Button>
      </form>
    </Form>
  );
}

export default HexagonLayerForm;
