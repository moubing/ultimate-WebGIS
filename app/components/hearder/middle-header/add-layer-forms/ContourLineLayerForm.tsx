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
import { ContourLayer } from "@deck.gl/aggregation-layers";
import { getPointLayerBounds, parseColorToRgbaArr } from "@/lib/utils";
import { toast } from "sonner";
import { layerBounds } from "@/lib/constants";
import { useMap } from "react-map-gl/maplibre";
import {
  ContourLineLayerFormSchema,
  ContourLineLayerFormSchemaType,
} from "./schema/ContourLineLayerFormSchema";

function ContourLineLayerForm({
  closeAllDialog,
}: {
  closeAllDialog: () => void;
}) {
  const setDeckLayers = useContext(SetDeckLayersContext);
  const { mainMap } = useMap();
  const form = useForm<ContourLineLayerFormSchemaType>({
    resolver: zodResolver(ContourLineLayerFormSchema),
    defaultValues: {
      id: "contour layer",
      data: "http://localhost:3000/example_data/sf-bike-parking.json",
      pickable: true,
      cellSize: 200,
      threshold: 1,
      strokeWidth: 2,
      color: "red",
      getPosition: "COORDINATES",
      getWeight: "SPACES",
    },
  });

  const onSubmit = useCallback(
    (values: ContourLineLayerFormSchemaType) => {
      if (!setDeckLayers) return;
      setDeckLayers((pre) => [
        ...pre,
        new ContourLayer({
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
          cellSize: values.cellSize,
          contours: [
            {
              threshold: values.threshold,
              strokeWidth: values.strokeWidth,
              color: parseColorToRgbaArr(values.color),
            },
          ],
          getPosition: (d) => d[values.getPosition],
          getWeight: (d) => d[values.getWeight],
          pickable: values.pickable,
        }),
      ]);

      toast.success("Add contour line layer to map");
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
              <FormDescription>This is your ContourLayer name.</FormDescription>
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
                This is your ContourLayer source data.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-3 grid-rows-1 gap-2">
          <FormField
            control={form.control}
            name="cellSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cell size:</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="input Cell size..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>This is your cell size.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="threshold"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Threshold:</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="input threshold..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>This is your threshold.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="strokeWidth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stroke width:</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="input stroke width..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>This is your stroke width.</FormDescription>
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
        <div className="grid grid-cols-3 gap-2">
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
            name="getWeight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weight field:</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Weight field..." {...field} />
                </FormControl>
                <FormDescription>Assign Weight.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contour line color:</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a color" />
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
                <FormDescription>Assign contour line color.</FormDescription>
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

export default ContourLineLayerForm;
