import { z } from "zod";

export const PathLayerSchema = z.object({
  id: z.string(),
  data: z.string().url(),

  getColor: z.string(),
  getPath: z.string(),
  getWidth: z.coerce.number(),
  pickable: z.boolean(),
});

export type PathLayerSchemaType = z.infer<typeof PathLayerSchema>;
