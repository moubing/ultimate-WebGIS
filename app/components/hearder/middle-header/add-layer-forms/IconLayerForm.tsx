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
import { Switch } from "@/components/ui/switch";
import {
  IconLayerSchema,
  IconLayerSchemaType,
} from "./schema/IconLayerFormSchema";
import { IconLayer } from "@deck.gl/layers";

function IconLayerForm({ closeAllDialog }: { closeAllDialog: () => void }) {
  const setDeckLayers = useContext(SetDeckLayersContext);
  const { mainMap } = useMap();
  const form = useForm<IconLayerSchemaType>({
    resolver: zodResolver(IconLayerSchema),
    defaultValues: {
      id: "icon layer",
      data: "http://localhost:3000/example_data/bart-stations.json",

      getColor: "exits",
      getIcon: "marker",
      getPosition: "coordinates",
      getSize: 40,
      iconAtlas: "http://localhost:3000/example_data/icon-atlas.png",
      iconMapping: "http://localhost:3000/example_data/icon-atlas.json",
      pickable: true,
    },
  });
  const onSubmit = useCallback(
    (values: IconLayerSchemaType) => {
      if (!setDeckLayers) return;
      setDeckLayers((pre) => [
        ...pre,
        new IconLayer({
          id: values.id,
          data: values.data,
          iconAtlas: values.iconAtlas,
          iconMapping: values.iconMapping,
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
          getColor: (d) => [Math.sqrt(d[values.getColor]), 140, 0, 255],
          getIcon: () => values.getIcon,
          getPosition: (d) => d[values.getPosition],
          getSize: values.getSize,
          pickable: values.pickable,
        }),
      ]);

      toast.success("Add icon layer to map");
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
              <FormDescription>This is your icon layer name.</FormDescription>
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
                This is your icon layer source data.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="iconAtlas"
          render={({ field }) => (
            <FormItem>
              <FormLabel>iconAtlas url:</FormLabel>
              <FormControl>
                <Input placeholder="input iconAtlas url..." {...field} />
              </FormControl>
              <FormDescription>
                This is your icon layer iconAtlas data.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="iconMapping"
          render={({ field }) => (
            <FormItem>
              <FormLabel>iconMapping url:</FormLabel>
              <FormControl>
                <Input placeholder="input iconMapping url..." {...field} />
              </FormControl>
              <FormDescription>
                This is your icon layer iconMapping data.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

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
            name="getSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>getSize :</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="input getSize..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This is your icon layer getSize.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
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
          <FormField
            control={form.control}
            name="getIcon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>getIcon field:</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="getIcon field..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>Assign getIcon.</FormDescription>
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

export default IconLayerForm;
