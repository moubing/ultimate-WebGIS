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
import { ArcLayer } from "@deck.gl/layers";
import { getArcLayerBounds, parseColorToRgbaArr } from "@/lib/utils";
import { toast } from "sonner";
import { layerBounds } from "@/lib/constants";
import {
  ArcLayerSchema,
  ArcLayerSchemaType,
} from "./schema/ArcLayerFormSchema";
import { useMap } from "react-map-gl/maplibre";

function ArcLayerForm({ closeAllDialog }: { closeAllDialog: () => void }) {
  const setDeckLayers = useContext(SetDeckLayersContext);
  const { mainMap } = useMap();
  const form = useForm<ArcLayerSchemaType>({
    resolver: zodResolver(ArcLayerSchema),
    defaultValues: {
      id: "arc layer",
      data: "http://localhost:3000/example_data/bart-segments.json",
      getWidth: 24,
      sourcePosition: "fromCoordinates",
      targetPosition: "toCoordinates",
      pickable: true,
      sourceColor: "red",
      targetColor: "lime",
    },
  });

  const onSubmit = useCallback(
    (values: ArcLayerSchemaType) => {
      if (!setDeckLayers) return;
      setDeckLayers((pre) => [
        ...pre,
        new ArcLayer({
          id: values.id,
          data: values.data,
          dataTransform: <LayerDataT,>(data: unknown): LayerDataT => {
            setTimeout(() => {
              const bounds = getArcLayerBounds(
                data as unknown[],
                values.sourcePosition,
                values.targetPosition
              );
              layerBounds[values.id] = bounds;
              mainMap?.fitBounds(bounds, {
                padding: 100,
              });
            }, 0);
            return data as LayerDataT;
          },
          getSourcePosition: (d) => d[values.sourcePosition],
          getTargetPosition: (d) => d[values.targetPosition],
          getSourceColor: parseColorToRgbaArr(values.sourceColor),
          getTargetColor: parseColorToRgbaArr(values.targetColor),
          getWidth: values.getWidth,
          pickable: values.pickable,
        }),
      ]);

      toast.success("Add arc layer to map");
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
              <FormDescription>This is your ArcLayer name.</FormDescription>
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
                This is your ArcLayer source data.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="getWidth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Arc width:</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="input arc width..."
                  {...field}
                />
              </FormControl>
              <FormDescription>This is your ArcLayer width.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
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
        <div className="grid grid-cols-2 grid-rows-2 gap-2">
          <FormField
            control={form.control}
            name="sourcePosition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Source position field:</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Source position field..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>Assign source position.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="targetPosition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target position field:</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Target position field..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>Assign Target position.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sourceColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target position color:</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a source color" />
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
                <FormDescription>Assign source color.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="targetColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target color field:</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a target color" />
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
                <FormDescription>Assign target color.</FormDescription>
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

export default ArcLayerForm;
