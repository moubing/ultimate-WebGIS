import { z } from "zod";

export const H3HexagonLayerSchema = z.object({
  id: z.string(),
  data: z.string(),
  pickable: z.boolean(),
  extruded: z.boolean(),
  getHexagon: z.string(),
  getFillColor: z.string(),
  getElevation: z.string(),
  elevationScale: z.coerce.number(),
});

export type H3HexagonLayerSchemaType = z.infer<typeof H3HexagonLayerSchema>;
