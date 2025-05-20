import { colorValues } from "@/lib/constants";
import { z } from "zod";

export const ColumnLayerSchema = z.object({
  id: z.string(),
  data: z.string(),
  extruded: z.boolean(),
  pickable: z.boolean(),
  diskResolution: z.coerce.number(),
  radius: z.coerce.number(),
  elevationScale: z.coerce.number(),
  getElevation: z.string(),
  getPosition: z.string(),
  getFillColor: z.enum(colorValues),
});

export type ColumnLayerSchemaType = z.infer<typeof ColumnLayerSchema>;
