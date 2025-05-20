import { colorValues } from "@/lib/constants";
import { z } from "zod";

export const ArcLayerSchema = z.object({
  id: z.string(),
  data: z.string().url(),
  sourcePosition: z.string(),
  targetPosition: z.string(),
  sourceColor: z.enum(colorValues),
  targetColor: z.enum(colorValues),
  getWidth: z.coerce.number().int().min(0).max(100),
  pickable: z.boolean(),
});

export type ArcLayerSchemaType = z.infer<typeof ArcLayerSchema>;
