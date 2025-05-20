import { colorValues } from "@/lib/constants";
import { z } from "zod";

export const GeohashLayerFormSchema = z.object({
  id: z.string(),
  data: z.string().url(),
  pickable: z.boolean(),
  extruded: z.boolean(),
  getGeohash: z.string(),
  getElevation: z.string(),
  getFillColor: z.enum(colorValues),
  elevationScale: z.coerce.number(),
});

export type GeohashLayerFormSchemaType = z.infer<typeof GeohashLayerFormSchema>;
