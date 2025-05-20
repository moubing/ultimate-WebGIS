"use client";

import React, { useCallback, useContext } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { GeohashLayer } from "@deck.gl/geo-layers";
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
import { parseColorToRgbaArr } from "@/lib/utils";
import { toast } from "sonner";

import {
  GeohashLayerFormSchema,
  GeohashLayerFormSchemaType,
} from "./schema/GeohashLayerFormSchema";

function GeohashLayerForm({ closeAllDialog }: { closeAllDialog: () => void }) {
  const setDeckLayers = useContext(SetDeckLayersContext);
  const form = useForm<GeohashLayerFormSchemaType>({
    resolver: zodResolver(GeohashLayerFormSchema),
    defaultValues: {
      id: "geohash layer",
      data: "http://localhost:3000/example_data/sf.geohashes.json",
      pickable: true,
      extruded: true,
      getGeohash: "geohash",
      elevationScale: 1000,
      getElevation: "value",
      getFillColor: "red",
    },
  });
  const onSubmit = useCallback(
    (values: GeohashLayerFormSchemaType) => {
      if (!setDeckLayers) return;
      setDeckLayers((pre) => [
        ...pre,
        new GeohashLayer({
          id: values.id,
          data: values.data,
          extruded: values.extruded,
          pickable: values.pickable,
          elevationScale: values.elevationScale,
          getElevation: (d) => d[values.getElevation],
          getGeohash: (d) => d[values.getGeohash],
          getFillColor: parseColorToRgbaArr(values.getFillColor),
        }),
      ]);

      toast.success("Add geohash layer to map");
      closeAllDialog();
    },
    [setDeckLayers, closeAllDialog]
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
              <FormDescription>This is your ColumnLayer name.</FormDescription>
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
                This is your ColumnLayer source data.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-3 grid-rows-1 gap-2">
          <FormField
            control={form.control}
            name="getGeohash"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Geohash field:</FormLabel>
                <FormControl>
                  <Input placeholder="input geohash field..." {...field} />
                </FormControl>
                <FormDescription>This is your geohash field.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="getElevation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Elevation field:</FormLabel>
                <FormControl>
                  <Input placeholder="input elevation field..." {...field} />
                </FormControl>
                <FormDescription>This is your elevation field.</FormDescription>
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
                  This is your geohash layer elevation scale.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-rows-1 grid-cols-2 gap-2">
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
        <FormField
          control={form.control}
          name="getFillColor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fill color:</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
        <Button className="w-full" type="submit">
          Add to Map
        </Button>
      </form>
    </Form>
  );
}

export default GeohashLayerForm;
