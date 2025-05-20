import { colorValues } from "@/lib/constants";
import { z } from "zod";

export const ContourBandLayerFormSchema = z.object({
  id: z.string(),
  data: z.string().url(),
  pickable: z.boolean(),
  cellSize: z.coerce.number(),
  startThreshold: z.coerce.number(),
  endThreshold: z.coerce.number(),
  color: z.enum(colorValues),
  getPosition: z.string(),
  getWeight: z.string(),
});

export type ContourBandLayerFormSchemaType = z.infer<
  typeof ContourBandLayerFormSchema
>;
