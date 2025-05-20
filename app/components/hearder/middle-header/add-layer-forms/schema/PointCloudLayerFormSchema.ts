import { z } from "zod";

export const PointCloudLayerSchema = z.object({
  id: z.string(),
  data: z.string().url(),

  getColor: z.string(),
  getNormal: z.string(),
  getPosition: z.string(),
  pointSize: z.coerce.number(),
  coordinateXOrigin: z.coerce.number(),
  coordinateYOrigin: z.coerce.number(),
  pickable: z.boolean(),
});

export type PointCloudLayerSchemaType = z.infer<typeof PointCloudLayerSchema>;
