import { z } from "zod";

export const DeckHeatmapLayerSchema = z.object({
  id: z.string(),
  data: z.string(),

  aggregation: z.union([z.literal("SUM"), z.literal("MEAN")]),
  getPosition: z.string(),
  getWeight: z.string(),
  radiusPixels: z.coerce.number(),
});

export type DeckHeatmapLayerSchemaType = z.infer<typeof DeckHeatmapLayerSchema>;
