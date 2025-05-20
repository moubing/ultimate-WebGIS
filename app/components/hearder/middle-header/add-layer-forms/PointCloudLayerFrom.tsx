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
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { COORDINATE_SYSTEM } from "@deck.gl/core";
import { PointCloudLayer } from "@deck.gl/layers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useContext } from "react";
import { useForm } from "react-hook-form";
import { useMap } from "react-map-gl/maplibre";
import { toast } from "sonner";
import {
  PointCloudLayerSchema,
  PointCloudLayerSchemaType
} from "./schema/PointCloudLayerFormSchema";

function PointCloudLayerForm({
  closeAllDialog
}: {
  closeAllDialog: () => void;
}) {
  const setDeckLayers = useContext(SetDeckLayersContext);
  const { mainMap } = useMap();
  const form = useForm<PointCloudLayerSchemaType>({
    resolver: zodResolver(PointCloudLayerSchema),
    defaultValues: {
      id: "point cloud layer",
      data: "http://localhost:3000/example_data/pointcloud.json",
      getColor: "color",
      getNormal: "normal",
      getPosition: "position",
      pointSize: 2,
      coordinateXOrigin: -122.4,
      coordinateYOrigin: 37.74,
      pickable: true
    }
  });

  const onSubmit = useCallback(
    (values: PointCloudLayerSchemaType) => {
      if (!setDeckLayers) return;
      setDeckLayers((pre) => [
        ...pre,
        new PointCloudLayer({
          id: values.id,
          data: values.data,
          dataTransform: <LayerDataT,>(data: unknown): LayerDataT => {
            setTimeout(() => {
              mainMap?.flyTo({
                center: [values.coordinateXOrigin, values.coordinateYOrigin],
                zoom: 8
              });
            }, 0);
            return data as LayerDataT;
          },
          getColor: (d) => d[values.getColor],
          getNormal: (d) => d[values.getNormal],
          getPosition: (d) => d[values.getPosition],
          coordinateSystem: COORDINATE_SYSTEM.METER_OFFSETS,
          pointSize: values.pointSize,
          coordinateOrigin: [
            values.coordinateXOrigin,
            values.coordinateYOrigin,
            0
          ],
          pickable: true
        })
      ]);

      toast.success("Add point cloud layer to map");
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
                This is your point cloud layer name.
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
                This is your point cloud layer source data.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-3 gap-2">
          <FormField
            control={form.control}
            name="pointSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>pointSize:</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="input pointSize..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>This is your pointSize.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="coordinateXOrigin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>coordinateXOrigin:</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="input coordinateXOrigin..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This is your coordinateXOrigin.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="coordinateYOrigin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>coordinateYOrigin:</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="input coordinateYOrigin..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This is your coordinateYOrigin.
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

        <div className="grid grid-cols-3 gap-2">
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
            name="getNormal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>getNormal:</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="getNormal..." {...field} />
                </FormControl>
                <FormDescription>Assign getNormal.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="getPosition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>getPosition:</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="getPosition..." {...field} />
                </FormControl>
                <FormDescription>Assign getPosition.</FormDescription>
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

export default PointCloudLayerForm;
