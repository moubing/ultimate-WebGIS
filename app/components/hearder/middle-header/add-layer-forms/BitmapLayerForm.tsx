"use client";

import { SetDeckLayersContext } from "@/app/providers/contexts";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback, useContext } from "react";
import { useForm } from "react-hook-form";
import { BitmapLayer } from "@deck.gl/layers";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
import { Switch } from "@/components/ui/switch";
import {
  BitmapLayerSchema,
  BitmapLayerSchemaType
} from "./schema/BitmapLayerFormSchema";
import { useMap } from "react-map-gl/maplibre";
import { layerBounds } from "@/lib/constants";

function BitmapLayerForm({ closeAllDialog }: { closeAllDialog: () => void }) {
  const setDeckLayers = useContext(SetDeckLayersContext);
  const form = useForm<BitmapLayerSchemaType>({
    resolver: zodResolver(BitmapLayerSchema),
    defaultValues: {
      id: "bitmap layer",
      image: "http://localhost:3000/example_data/sf-districts.png",
      left: -122.519,
      top: 37.7045,
      right: -122.355,
      bottom: 37.829,
      pickable: true
    }
  });

  const { mainMap } = useMap();

  const onSubmit = useCallback(
    (values: BitmapLayerSchemaType) => {
      if (!setDeckLayers) return;
      setDeckLayers((pre) => [
        ...pre,
        new BitmapLayer({
          id: values.id,
          image: values.image,
          pickable: values.pickable,
          bounds: [values.left, values.top, values.right, values.bottom]
        })
      ]);
      setTimeout(() => {
        const bound: [number, number, number, number] = [
          values.left,
          values.bottom,
          values.right,
          values.top
        ];
        layerBounds[values.id] = bound;
        mainMap?.fitBounds(bound);
      }, 0);

      toast.success("Add bitmap layer to map");
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
            <FormItem className="">
              <FormLabel>Layer id:</FormLabel>
              <FormControl>
                <Input placeholder="input layer id..." {...field} />
              </FormControl>
              <FormDescription>This is your BitmapLayer name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>image url:</FormLabel>
              <FormControl>
                <Input placeholder="input image url..." {...field} />
              </FormControl>
              <FormDescription>
                This is your BitmapLayer source image.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-rows-2 grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="left"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Boundbox left:</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="input left boundary..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This is your BitmapLayer left boundary.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="top"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Boundbox top:</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="input top boundary..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This is your BitmapLayer top boundary.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="right"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Boundbox right:</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="input right boundary..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This is your BitmapLayer right boundary.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bottom"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Boundbox bottom:</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="input bottom boundary..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This is your BitmapLayer bottom boundary.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="pickable"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm ">
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
        <Button className="w-full" type="submit">
          Add to map
        </Button>
      </form>
    </Form>
  );
}

export default BitmapLayerForm;
