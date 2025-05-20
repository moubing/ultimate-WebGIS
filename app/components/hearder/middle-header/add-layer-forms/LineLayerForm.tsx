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
import { getArcLayerBounds } from "@/lib/utils";
import { toast } from "sonner";
import { layerBounds } from "@/lib/constants";
import { useMap } from "react-map-gl/maplibre";
import { LineLayer } from "@deck.gl/layers";
import { Switch } from "@/components/ui/switch";
import {
  LineLayerSchema,
  LineLayerSchemaType,
} from "./schema/LineLayerFormSchema";

function LineLayerForm({ closeAllDialog }: { closeAllDialog: () => void }) {
  const setDeckLayers = useContext(SetDeckLayersContext);
  const { mainMap } = useMap();
  const form = useForm<LineLayerSchemaType>({
    resolver: zodResolver(LineLayerSchema),
    defaultValues: {
      id: "line layer",
      data: "http://localhost:3000/example_data/bart-segments.json",

      getColor: "inbound",
      getSourcePosition: "fromCoordinates",
      getTargetPosition: "toCoordinates",
      getWidth: 12,
      pickable: true,
    },
  });
  const onSubmit = useCallback(
    (values: LineLayerSchemaType) => {
      if (!setDeckLayers) return;
      setDeckLayers((pre) => [
        ...pre,
        new LineLayer({
          id: values.id,
          data: values.data,
          dataTransform: <LayerDataT,>(data: unknown): LayerDataT => {
            setTimeout(() => {
              const bounds = getArcLayerBounds(
                data as unknown[],
                values.getSourcePosition,
                values.getTargetPosition
              );
              layerBounds[values.id] = bounds;
              mainMap?.fitBounds(bounds, {
                padding: 100,
              });
            }, 0);
            return data as LayerDataT;
          },
          getColor: (d) => [Math.sqrt(d[values.getColor]), 140, 0],
          getSourcePosition: (d) => d[values.getSourcePosition],
          getTargetPosition: (d) => d[values.getTargetPosition],
          getWidth: values.getWidth,
          pickable: values.pickable,
        }),
      ]);

      toast.success("Add line layer to map");
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
              <FormDescription>This is your line layer name.</FormDescription>
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
                This is your line layer source data.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="getWidth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>getWidth :</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="input getWidth..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This is your hexagon layer getWidth.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
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
        </div>

        <div className="grid grid-cols-3 gap-2">
          <FormField
            control={form.control}
            name="getSourcePosition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>getSourcePosition field:</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="getSourcePosition field..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>Assign getSourcePosition.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="getTargetPosition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>getTargetPosition field:</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="getTargetPosition field..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>Assign getTargetPosition.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="getColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>getColor field:</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="getColor field..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>Assign getColor.</FormDescription>
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

export default LineLayerForm;
