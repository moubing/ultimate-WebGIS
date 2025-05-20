import { colorValues } from "@/lib/constants";
import { z } from "zod";

export const H3ClusterLayerSchema = z.object({
  id: z.string(),
  data: z.string(),
  pickable: z.boolean(),
  stroked: z.boolean(),
  getHexagons: z.string(),
  getFillColor: z.string(),
  getLineColor: z.enum(colorValues),
  lineWidthMinPixels: z.coerce.number(),
});

export type H3ClusterLayerSchemaType = z.infer<typeof H3ClusterLayerSchema>;
