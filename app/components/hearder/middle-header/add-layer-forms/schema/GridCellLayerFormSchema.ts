import { colorValues } from "@/lib/constants";
import { z } from "zod";

export const GridCellLayerFormSchema = z.object({
  id: z.string(),
  data: z.string(),
  extruded: z.boolean(),
  pickable: z.boolean(),
  cellSize: z.coerce.number(),
  elevationScale: z.coerce.number(),
  getElevation: z.string(),
  getPosition: z.string(),
  getFillColor: z.enum(colorValues),
});

export type GridCellLayerFormSchemaType = z.infer<
  typeof GridCellLayerFormSchema
>;
