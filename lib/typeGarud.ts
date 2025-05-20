import { Layer } from "@deck.gl/core"; // 引入 Deck.gl 基类
import { DeckLayer, layerConfigure, MapLayer, otherConfigure } from "./types";

// 类型守卫函数
function isDeckLayer(layer: unknown): layer is DeckLayer {
  return layer instanceof Layer; // 所有 DeckLayer 继承自 Layer 基类
}

function isMapLayer(layer: unknown): layer is MapLayer {
  const mapLayerTypes = new Set([
    "fill",
    "line",
    "symbol",
    "circle",
    "heatmap",
    "fill-extrusion",
    "raster",
    "hillshade",
    "background"
  ]);
  return (
    typeof layer === "object" &&
    layer !== null &&
    "type" in layer &&
    mapLayerTypes.has((layer as MapLayer).type)
  );
}

function isOtherConfigure(layer: unknown): layer is otherConfigure {
  return layer === "mapSetting";
}

// 主判断逻辑
export function determineLayerType(
  layer: layerConfigure | null
): "DeckLayer" | "MapLayer" | "otherConfigure" | "null" | "unknown" {
  if (layer === null) return "null";
  if (isOtherConfigure(layer)) return "otherConfigure";
  if (isMapLayer(layer)) return "MapLayer";
  if (isDeckLayer(layer)) return "DeckLayer";
  return "unknown";
}
