import { z } from "zod";

export const GridLayerFormSchema = z.object({
  id: z.string(),
  data: z.string(),
  extruded: z.boolean(),
  pickable: z.boolean(),
  gpuAggregation: z.boolean(),
  cellSize: z.coerce.number(),
  elevationScale: z.coerce.number(),
  getPosition: z.string(),
  getColorWeight: z.string(),
  getElevationWeight: z.string(),
});

export type GridLayerFormSchemaType = z.infer<typeof GridLayerFormSchema>;
