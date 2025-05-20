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
import { toast } from "sonner";
import { MVTLayer } from "@deck.gl/geo-layers";
import {
  MVTLayerSchema,
  MVTLayerSchemaType,
} from "./schema/MVTLayerFormSchema";

function MVTLayerForm({ closeAllDialog }: { closeAllDialog: () => void }) {
  const setDeckLayers = useContext(SetDeckLayersContext);
  const form = useForm<MVTLayerSchemaType>({
    resolver: zodResolver(MVTLayerSchema),
    defaultValues: {
      id: "MVT layer",
      data: "https://tiles-a.basemaps.cartocdn.com/vectortiles/carto.streets/v1/{z}/{x}/{y}.mvt",

      getLineColor: "emerald",
      getPointRadius: 2,
      stroked: false,
      picking: true,
      minZoom: 0,
      maxZoom: 14,
    },
  });
  const onSubmit = useCallback(
    (values: MVTLayerSchemaType) => {
      if (!setDeckLayers) return;
      setDeckLayers((pre) => [
        ...pre,
        new MVTLayer({
          id: values.id,
          data: values.data,
          minZoom: 0,
          maxZoom: 14,
          getFillColor: (f) => {
            switch (f.properties.layerName) {
              case "poi":
                return [255, 0, 0];
              case "water":
                return [120, 150, 180];
              case "building":
                return [218, 218, 218];
              default:
                return [240, 240, 240];
            }
          },
          getLineWidth: (f) => {
            switch (f.properties.class) {
              case "street":
                return 6;
              case "motorway":
                return 10;
              default:
                return 1;
            }
          },
          getLineColor: [192, 192, 192],
          getPointRadius: 2,
          pointRadiusUnits: "pixels",
          stroked: false,
          picking: true,
        }),
      ]);

      toast.success("Add MVT layer to map");
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
              <FormDescription>This is your MVT layer name.</FormDescription>
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
                This is your MVT layer source data.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-3 grid-rows-1 gap-2">
          <FormField
            control={form.control}
            name="minZoom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>minZoom:</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="input minZoom..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This is your MVT layer minZoom.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="maxZoom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>maxZoom:</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="input maxZoom..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This is your MVT layer maxZoom.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="getPointRadius"
            render={({ field }) => (
              <FormItem>
                <FormLabel>getPointRadius:</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="input getPointRadius..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This is your MVT layer getPointRadius.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-rows-1 grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="picking"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Layer is picking</FormLabel>
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

        <FormField
          control={form.control}
          name="getLineColor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>getLineColor:</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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

        <Button className="w-full" type="submit">
          Add to Map
        </Button>
      </form>
    </Form>
  );
}

export default MVTLayerForm;
