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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SetDeckLayersContext } from "@/app/providers/contexts";
import { getPointLayerBounds } from "@/lib/utils";
import { toast } from "sonner";
import { layerBounds } from "@/lib/constants";
import { useMap } from "react-map-gl/maplibre";
import { HeatmapLayer } from "@deck.gl/aggregation-layers";
import {
  DeckHeatmapLayerSchema,
  DeckHeatmapLayerSchemaType,
} from "./schema/DeckHeatmapLayerFormSchema";

function DeckHeatmapLayerForm({
  closeAllDialog,
}: {
  closeAllDialog: () => void;
}) {
  const setDeckLayers = useContext(SetDeckLayersContext);
  const { mainMap } = useMap();
  const form = useForm<DeckHeatmapLayerSchemaType>({
    resolver: zodResolver(DeckHeatmapLayerSchema),
    defaultValues: {
      id: "deck heatmap layer",
      data: "http://localhost:3000/example_data/sf-bike-parking.json",

      aggregation: "SUM",
      getPosition: "COORDINATES",
      getWeight: "SPACES",
      radiusPixels: 25,
    },
  });
  const onSubmit = useCallback(
    (values: DeckHeatmapLayerSchemaType) => {
      if (!setDeckLayers) return;
      setDeckLayers((pre) => [
        ...pre,
        new HeatmapLayer({
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
          aggregation: values.aggregation,
          getPosition: (d) => d[values.getPosition],
          getWeight: (d) => d[values.getWeight],
          radiusPixels: values.radiusPixels,

          colorDomain: [0, 2], // 根据数据分布调整数值范围
          colorRange: [
            [255, 255, 178, 200], // 浅黄（低密度）
            [254, 204, 92, 200], // 橙黄
            [240, 59, 32, 200], // 红
            [168, 0, 0, 200], // 深红（高密度）
          ],
        }),
      ]);

      toast.success("Add dech heatmap layer to map");
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
                This is your deck heatmap layer name.
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
                This is your deck heatmap layer source data.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="radiusPixels"
            render={({ field }) => (
              <FormItem>
                <FormLabel>radiusPixels :</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="input radiusPixels..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This is your deck heatmap layer radiusPixels.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="aggregation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>aggregation type:</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a aggregation type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="SUM">SUM</SelectItem>
                    <SelectItem value="MEAN">MEAN</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Assign aggregation type.</FormDescription>
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
            name="getWeight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>getWeight field:</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="getWeight field..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>Assign getWeight.</FormDescription>
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

export default DeckHeatmapLayerForm;
