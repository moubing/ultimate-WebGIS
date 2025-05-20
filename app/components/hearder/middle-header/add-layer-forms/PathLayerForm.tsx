"use client";

import { SetDeckLayersContext } from "@/app/providers/contexts";
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
import { layerBounds } from "@/lib/constants";
import { getBoundsFromPath, parseHexColorToRgbArr } from "@/lib/utils";
import { PathLayer } from "@deck.gl/layers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useContext } from "react";
import { useForm } from "react-hook-form";
import { useMap } from "react-map-gl/maplibre";
import { toast } from "sonner";
import {
  PathLayerSchema,
  PathLayerSchemaType,
} from "./schema/PathLayerFormSchema";

function PathLayerForm({ closeAllDialog }: { closeAllDialog: () => void }) {
  const setDeckLayers = useContext(SetDeckLayersContext);
  const { mainMap } = useMap();
  const form = useForm<PathLayerSchemaType>({
    resolver: zodResolver(PathLayerSchema),
    defaultValues: {
      id: "path layer",
      data: "http://localhost:3000/example_data/bart-lines.json",

      getColor: "color",
      getPath: "path",
      getWidth: 100,
      pickable: true,
    },
  });

  const onSubmit = useCallback(
    (values: PathLayerSchemaType) => {
      if (!setDeckLayers) return;
      setDeckLayers((pre) => [
        ...pre,
        new PathLayer({
          id: values.id,
          data: values.data,
          dataTransform: <LayerDataT,>(data: unknown): LayerDataT => {
            setTimeout(() => {
              const bounds = getBoundsFromPath(
                data as unknown[],
                values.getPath
              );
              layerBounds[values.id] = bounds as [
                number,
                number,
                number,
                number
              ];
              mainMap?.fitBounds(bounds as [number, number, number, number], {
                padding: 100,
              });
            }, 0);
            return data as LayerDataT;
          },
          getColor: (d) => parseHexColorToRgbArr(d[values.getColor]),
          getPath: (d) => d[values.getPath],
          getWidth: values.getWidth,
          pickable: values.pickable,
        }),
      ]);

      toast.success("Add path layer to map");
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
              <FormDescription>This is your path layer name.</FormDescription>
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
                This is your path layer source data.
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
              <FormLabel>getWidth:</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="input getWidth..."
                  {...field}
                />
              </FormControl>
              <FormDescription>This is your getWidth.</FormDescription>
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
        <div className="grid grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="getColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>getColor:</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="getColor..." {...field} />
                </FormControl>
                <FormDescription>Assign getColor.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="getPath"
            render={({ field }) => (
              <FormItem>
                <FormLabel>getPath:</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="getPath..." {...field} />
                </FormControl>
                <FormDescription>Assign getPath.</FormDescription>
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

export default PathLayerForm;
