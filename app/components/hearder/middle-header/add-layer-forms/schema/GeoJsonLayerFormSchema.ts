import { colorValues } from "@/lib/constants";
import { z } from "zod";

export const GeoJsonLayerFormSchema = z.object({
  id: z.string(),
  data: z.string().url(),
  circleType: z.boolean(),
  iconType: z.boolean(),
  textType: z.boolean(),
  pickable: z.boolean(),

  filled: z.boolean(),
  getFillColor: z.enum(colorValues),

  stroked: z.boolean(),
  getLineColor: z.enum(colorValues),
  getLineWidth: z.coerce.number(),
  lineWidthScale: z.coerce.number(),
  lineJointRounded: z.boolean(),
  lineCapRounded: z.boolean(),
  lineBillboard: z.boolean(),

  extruded: z.boolean(),
  wireframe: z.boolean(),
  getElevation: z.coerce.number(),

  getPointRadius: z.coerce.number(),
  pointRadiusScale: z.coerce.number(),
  pointAntialiasing: z.boolean(),
  pointBillboard: z.boolean(),

  getIcon: z.string(),
  getIconSize: z.coerce.number(),
  iconSizeScale: z.coerce.number(),
  getIconColor: z.enum(colorValues),
  getIconAngle: z.coerce.number(),
  getIconPixelXOffset: z.coerce.number(),
  getIconPixelYOffset: z.coerce.number(),
  iconBillboard: z.boolean(),

  getText: z.string(),
  getTextColor: z.enum(colorValues),
  getTextAngle: z.coerce.number(),
  getTextSize: z.coerce.number(),
  textSizeScale: z.coerce.number(),
  textOutlineColor: z.enum(colorValues),
  textOutlineWidth: z.coerce.number(),
  textBillboard: z.boolean(),
});

export type GeoJsonLayerFormSchemaType = z.infer<typeof GeoJsonLayerFormSchema>;
