import { z } from "zod";

export const LineLayerSchema = z.object({
  id: z.string(),
  data: z.string().url(),

  getColor: z.string(),
  getSourcePosition: z.string(),
  getTargetPosition: z.string(),
  getWidth: z.coerce.number(),
  pickable: z.boolean(),
});

export type LineLayerSchemaType = z.infer<typeof LineLayerSchema>;
