import { z } from "zod";

export const IconLayerSchema = z.object({
  id: z.string(),
  data: z.string(),
  iconAtlas: z.string(),
  iconMapping: z.string(),

  getColor: z.string(),
  getIcon: z.string(),
  getPosition: z.string(),
  getSize: z.coerce.number(),
  pickable: z.boolean(),
});

export type IconLayerSchemaType = z.infer<typeof IconLayerSchema>;
