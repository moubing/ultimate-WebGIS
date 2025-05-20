import { z } from "zod";

export const HexagonLayerSchema = z.object({
  id: z.string(),
  data: z.string(),

  pickable: z.boolean(),
  extruded: z.boolean(),
  gpuAggregation: z.boolean(),
  getPosition: z.string(),
  getColorWeight: z.string(),
  getElevationWeight: z.string(),
  elevationScale: z.coerce.number(),
  radius: z.coerce.number(),
});

export type HexagonLayerSchemaType = z.infer<typeof HexagonLayerSchema>;
