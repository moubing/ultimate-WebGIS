import { z } from "zod";

export const BitmapLayerSchema = z.object({
  id: z.string().nonempty(),
  image: z.string().url(),
  left: z.coerce.number().min(-180).max(180),
  right: z.coerce.number().min(-180).max(180),
  top: z.coerce.number().min(-90).max(90),
  bottom: z.coerce.number().min(-90).max(90),
  pickable: z.boolean()
});

export type BitmapLayerSchemaType = z.infer<typeof BitmapLayerSchema>;
