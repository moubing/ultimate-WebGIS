import * as turf from "@turf/turf";
import chroma from "chroma-js";
import { clsx, type ClassValue } from "clsx";
import { Feature, FeatureCollection } from "geojson";
import { cellToBoundary } from "h3-js";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import { colors, customColorMap } from "./constants";
import { cluster } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 临时的颜色转换函数，调色板组件做好了就不用它了
export function parseColorToRgbaArr(
  color: colors
): [number, number, number, number] {
  return [...chroma(customColorMap[color]).rgb(), 255];
}

export function parseHexColorToRgbArr(
  color: colors
): [number, number, number, number] {
  return [...chroma(color).rgb(), 255];
}

// 定义计算边界框的函数
export function getArcLayerBounds(
  arcLayerData: unknown[],
  fromField: string,
  toField: string
): [number, number, number, number] {
  let minLng = Infinity;
  let minLat = Infinity;
  let maxLng = -Infinity;
  let maxLat = -Infinity;

  if (
    arcLayerData[0] &&
    arcLayerData[0][fromField] &&
    arcLayerData[0][toField]
  ) {
    arcLayerData.forEach((item) => {
      // 提取起点和终点坐标
      const [fromLng, fromLat] = item[fromField];
      const [totLng, totLat] = item[toField];

      // 更新最小/最大经纬度
      minLng = Math.min(minLng, fromLng, totLng);
      minLat = Math.min(minLat, fromLat, totLat);
      maxLng = Math.max(maxLng, fromLng, totLng);
      maxLat = Math.max(maxLat, fromLat, totLat);
    });
  } else {
    toast.error("invalid assigned field ");
    return [-180, -90, 180, 90];
  }

  return [minLng, minLat, maxLng, maxLat]; // [west, south, east, north]
}

export function getPointLayerBounds(
  pointLayerData: unknown[],
  field: string
): [number, number, number, number] {
  let minLng = Infinity;
  let minLat = Infinity;
  let maxLng = -Infinity;
  let maxLat = -Infinity;

  if (pointLayerData[0] && pointLayerData[0][field]) {
    pointLayerData.forEach((item) => {
      const [Lng, Lat] = item[field];

      minLng = Math.min(minLng, Lng);
      minLat = Math.min(minLat, Lat);
      maxLng = Math.max(maxLng, Lng);
      maxLat = Math.max(maxLat, Lat);
    });
  } else {
    toast.error("invalid assigned field ");
    return [-180, -90, 180, 90];
  }

  return [minLng, minLat, maxLng, maxLat]; // [west, south, east, north]
}

export function getPointType(
  circleType: boolean,
  iconType: boolean,
  textType: boolean
) {
  if (!circleType && !iconType && !textType) return "circle";
  if (circleType && !iconType && !textType) return "circle";
  if (!circleType && iconType && !textType) return "icon";
  if (!circleType && !iconType && textType) return "text";
  if (circleType && iconType && !textType) return "circle+icon";
  if (circleType && !iconType && textType) return "circle+text";
  if (!circleType && iconType && textType) return "icon+text";
  if (circleType && iconType && textType) return "circle+icon+text";
}

export function getBoundsFromClusters(
  clusters: cluster[]
): [number, number, number, number] {
  let minLat = Infinity;
  let minLng = Infinity;
  let maxLat = -Infinity;
  let maxLng = -Infinity;

  // 遍历所有聚类
  clusters.forEach((cluster) => {
    cluster.hexIds.forEach((hexId) => {
      // 获取单个 H3 六边形的顶点坐标
      const coordinates = cellToBoundary(hexId, true); // 返回 [lng, lat] 格式
      coordinates.forEach(([lng, lat]) => {
        minLat = Math.min(minLat, lat);
        minLng = Math.min(minLng, lng);
        maxLat = Math.max(maxLat, lat);
        maxLng = Math.max(maxLng, lng);
      });
    });
  });

  return [minLng, minLat, maxLng, maxLat];
}
export function getBoundsFromHexagons(
  hexagons: unknown[],
  field: string
): [number, number, number, number] {
  let minLat = Infinity;
  let minLng = Infinity;
  let maxLat = -Infinity;
  let maxLng = -Infinity;

  hexagons.forEach((hexagon) => {
    const coordinates = cellToBoundary(hexagon[field], true);
    coordinates.forEach(([lng, lat]) => {
      minLat = Math.min(minLat, lat);
      minLng = Math.min(minLng, lng);
      maxLat = Math.max(maxLat, lat);
      maxLng = Math.max(maxLng, lng);
    });
  });

  return [minLng, minLat, maxLng, maxLat];
}

export function getBoundsFromPath(data: unknown[], field: string) {
  const arr: unknown[] = [];

  data.forEach((item) => {
    const linestring = turf.lineString(item[field]);
    arr.push(linestring);
  });

  const feaCollection = turf.featureCollection(arr);

  return turf.bbox(feaCollection);
}

export function getFieldsFromFeatureCollection(
  featureCollection: FeatureCollection
) {
  const properties = featureCollection.features[0].properties;
  if (properties) return Object.keys(properties);
}
export function getNumberFieldsFromFeatureCollection(
  featureCollection: FeatureCollection
) {
  const properties = featureCollection.features[0].properties;

  const arr: string[] = [];
  if (properties) {
    Object.keys(properties).forEach((key) => {
      if (typeof properties[key] === "number") {
        arr.push(key);
      }
    });
  }
  return arr;
}

export function convertFeatureArrayToFlatArry(features: Feature[]) {
  if (typeof features[0].id === "undefined")
    return features.map((feature) => {
      return {
        geometry_type: feature?.geometry?.type ?? "null",
        ...feature.properties
      };
    });

  return features.map((feature) => {
    return {
      id: feature.id,
      geometry_type: feature?.geometry?.type ?? "null",
      ...feature.properties
    };
  });
}

export function getDimensionsFromFeatureArray(features: Feature[]) {
  if (typeof features[0].id === "undefined")
    return ["geometry_type", ...Object.keys(features[0].properties ?? {})];
  return ["id", "geometry_type", ...Object.keys(features[0].properties ?? {})];
}

export function getSteps(min: number, max: number, count: number) {
  const steps = [];
  for (let i = 0; i < count; i++) {
    let value = min + ((max - min) / (count - 1)) * i;
    if (i === count - 1) {
      value++;
    }
    steps.push(Number(value.toFixed(2)));
  }
  return steps;
}

export function getPieces(steps: number[]) {
  const pieces: { lt?: number; gte?: number }[] = [];
  for (let i = 0; i <= steps.length; i++) {
    if (i === 0) {
      pieces.push({
        lt: steps[i]
      });
    } else if (i === steps.length) {
      pieces.push({
        gte: steps[i - 1]
      });
    } else {
      pieces.push({
        lt: steps[i],
        gte: steps[i - 1]
      });
    }
  }
  return pieces;
}

export function coordinatesToBound(
  coordinates: [
    [number, number],
    [number, number],
    [number, number],
    [number, number]
  ]
): [number, number, number, number] {
  const minX = coordinates[3][0];
  const minY = coordinates[3][1];
  const maxX = coordinates[1][0];
  const maxY = coordinates[1][1];

  return [minX, minY, maxX, maxY];
}
