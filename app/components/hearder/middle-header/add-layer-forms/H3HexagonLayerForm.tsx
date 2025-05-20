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
import { H3HexagonLayer } from "@deck.gl/geo-layers";
import { getBoundsFromHexagons } from "@/lib/utils";
import { toast } from "sonner";
import { layerBounds } from "@/lib/constants";
import { useMap } from "react-map-gl/maplibre";
import {
  H3HexagonLayerSchema,
  H3HexagonLayerSchemaType,
} from "./schema/H3HexagonLayerFormSchema";

function H3HexagonLayerForm({
  closeAllDialog,
}: {
  closeAllDialog: () => void;
}) {
  const setDeckLayers = useContext(SetDeckLayersContext);
  const { mainMap } = useMap();
  const form = useForm<H3HexagonLayerSchemaType>({
    resolver: zodResolver(H3HexagonLayerSchema),
    defaultValues: {
      id: "h3 hexagon layer",
      data: "http://localhost:3000/example_data/sf.h3cells.json",
      pickable: true,
      extruded: true,
      getHexagon: "hex",
      getFillColor: "count",
      getElevation: "count",
      elevationScale: 20,
    },
  });
  const onSubmit = useCallback(
    (values: H3HexagonLayerSchemaType) => {
      if (!setDeckLayers) return;
      setDeckLayers((pre) => [
        ...pre,
        new H3HexagonLayer({
          id: values.id,
          data: values.data,
          dataTransform: <LayerDataT,>(data: unknown): LayerDataT => {
            setTimeout(() => {
              const bounds = getBoundsFromHexagons(
                data as unknown[],
                values.getHexagon
              );
              layerBounds[values.id] = bounds;
              mainMap?.fitBounds(bounds, {
                padding: 100,
              });
            }, 0);
            return data as LayerDataT;
          },
          pickable: values.pickable,
          extruded: values.extruded,
          getHexagon: (d) => d[values.getHexagon],
          getFillColor: (d) => [
            255,
            (1 - d[values.getFillColor] / 500) * 255,
            0,
          ],
          getElevation: (d) => d[values.getElevation],
          elevationScale: values.elevationScale,
        }),
      ]);

      toast.success("Add h3 hexagon layer to map");
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
                This is your h3 hexagon layer name.
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
                This is your h3 hexagon layer source data.
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
                This is your h3 hexagon layer elevationScale.
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
        <div className="grid grid-cols-3 gap-2">
          <FormField
            control={form.control}
            name="getHexagon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>getHexagon field:</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="getHexagon field..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>Assign getHexagon.</FormDescription>
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
          <FormField
            control={form.control}
            name="getElevation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>getElevation field:</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="getElevation field..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>Assign getElevation.</FormDescription>
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

export default H3HexagonLayerForm;
