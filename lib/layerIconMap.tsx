import {
  Circle,
  Image,
  Pentagon,
  Slash,
  Tags,
  Thermometer,
  Spline,
  StretchVertical
} from "lucide-react";
import { layerTypeId } from "./types";
import React from "react";
export const layerIconMap: { [key in layerTypeId]?: React.FC } = {
  fill: Pentagon,
  line: Slash,
  circle: Circle,
  symbol: Tags,
  raster: Image,
  ArcLayer: Spline,
  HexagonLayer: StretchVertical,
  heatmap: Thermometer
};
