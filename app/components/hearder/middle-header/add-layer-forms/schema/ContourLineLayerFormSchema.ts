import { colorValues } from "@/lib/constants";
import { z } from "zod";

export const ContourLineLayerFormSchema = z.object({
  id: z.string(),
  data: z.string().url(),
  pickable: z.boolean(),
  cellSize: z.coerce.number(),
  threshold: z.coerce.number(),
  strokeWidth: z.coerce.number(),
  color: z.enum(colorValues),
  getPosition: z.string(),
  getWeight: z.string(),
});

export type ContourLineLayerFormSchemaType = z.infer<
  typeof ContourLineLayerFormSchema
>;
