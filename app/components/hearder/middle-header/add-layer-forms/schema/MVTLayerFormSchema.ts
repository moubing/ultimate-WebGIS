import { colorValues } from "@/lib/constants";
import { z } from "zod";

export const MVTLayerSchema = z.object({
  id: z.string(),
  data: z.string().url(),

  minZoom: z.coerce.number().min(0).max(21),
  maxZoom: z.coerce.number().min(1).max(21),
  getLineColor: z.enum(colorValues),
  getPointRadius: z.coerce.number(),
  stroked: z.boolean(),
  picking: z.boolean(),
});

export type MVTLayerSchemaType = z.infer<typeof MVTLayerSchema>;
