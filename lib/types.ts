import {
  BackgroundLayerSpecification,
  CircleLayerSpecification,
  FillExtrusionLayerSpecification,
  FillLayerSpecification,
  GeoJSONSourceSpecification,
  HeatmapLayerSpecification,
  HillshadeLayerSpecification,
  ImageSourceSpecification,
  LineLayerSpecification,
  RasterDEMSourceSpecification,
  RasterLayerSpecification,
  SymbolLayerSpecification,
  VectorSourceSpecification
} from "maplibre-gl";
import type {
  ArcLayer,
  BitmapLayer,
  ColumnLayer,
  GeoJsonLayer,
  GridCellLayer,
  IconLayer,
  LineLayer,
  PathLayer,
  PointCloudLayer,
  PolygonLayer,
  ScatterplotLayer,
  SolidPolygonLayer,
  TextLayer
} from "@deck.gl/layers";
import type {
  ContourLayer,
  GridLayer,
  HeatmapLayer,
  HexagonLayer,
  ScreenGridLayer
} from "@deck.gl/aggregation-layers";
import {
  GeohashLayer,
  H3ClusterLayer,
  H3HexagonLayer,
  MVTLayer,
  QuadkeyLayer,
  S2Layer,
  TerrainLayer,
  Tile3DLayer,
  TileLayer,
  TripsLayer
} from "@deck.gl/geo-layers";
import { ScenegraphLayer, SimpleMeshLayer } from "@deck.gl/mesh-layers";
import React, { SetStateAction } from "react";
import { Feature } from "geojson";

export type BasemapClass =
  | "all"
  | "world"
  | "strict"
  | "vector"
  | "raster"
  | "satellite";

export type displayLayout = "grid" | "list";

export type BasemapObject = {
  name: string;
  description: string;
  variants: string[];
  images: string[];
};

export type MapLayerType =
  | "fill"
  | "line"
  | "symbol"
  | "circle"
  | "heatmap"
  | "fill-extrusion"
  | "raster"
  | "hillshade"
  | "background";

export type MapLayer =
  | FillLayerSpecification
  | LineLayerSpecification
  | SymbolLayerSpecification
  | CircleLayerSpecification
  | HeatmapLayerSpecification
  | FillExtrusionLayerSpecification
  | RasterLayerSpecification
  | HillshadeLayerSpecification
  | (BackgroundLayerSpecification & { source?: string });

export type MapSource =
  | (VectorSourceSpecification & { id: string })
  | (RasterLayerSpecification & { id: string })
  | (RasterDEMSourceSpecification & { id: string })
  | (GeoJSONSourceSpecification & { id: string })
  | (ImageSourceSpecification & { id: string });

export type DeckLayer =
  | ArcLayer
  | BitmapLayer
  | ColumnLayer
  | ContourLayer
  | GeohashLayer
  | GeoJsonLayer
  | GridCellLayer
  | GridLayer
  | H3ClusterLayer
  | H3HexagonLayer
  | HeatmapLayer
  | HexagonLayer
  | IconLayer
  | LineLayer
  | MVTLayer
  | PathLayer
  | PointCloudLayer
  | PolygonLayer
  | QuadkeyLayer
  | S2Layer
  | ScatterplotLayer
  | ScenegraphLayer
  | ScreenGridLayer
  | SimpleMeshLayer
  | SolidPolygonLayer
  | TerrainLayer
  | TextLayer
  | TileLayer
  | Tile3DLayer
  | TripsLayer;

// 这个先将就了，因为那个临时的添加图层组件用到了它，但是我
// 知道以后它会改的， 现在就先不动它了
export type layerId =
  | "ArcLayer"
  | "BitmapLayer"
  | "ColumnLayer"
  | "ContourLineLayer"
  | "ContourBandLayer"
  | "GeohashLayer"
  | "GeoJsonLayer"
  | "GridCellLayer"
  | "GridLayer"
  | "H3ClusterLayer"
  | "H3HexagonLayer"
  | "HeatmapLayer1"
  | "HexagonLayer"
  | "IconLayer"
  | "MVTLayer"
  | "PathLayer"
  | "PointCloudLayer"
  | "PolygonLayer"
  | "QuadkeyLayer"
  | "S2Layer"
  | "ScatterplotLayer"
  | "ScenegraphLayer"
  | "ScreenGridLayer"
  | "SimpleMeshLayer"
  | "SolidPolygonLayer"
  | "TerrainLayer"
  | "TextLayer"
  | "TileLayer"
  | "Tile3DLayer"
  | "TripsLayer"
  | "FillLayer"
  | "LineLayer"
  | "SymbolLayer"
  | "CircleLayer"
  | "HeatmapLayer"
  | "FillExtrusionLayer"
  | "RasterLayer"
  | "HillshadeLayer"
  | "BackgroundLayer";

export type LayerTypes = "deck" | "maplibre";
export type SortableLayerObject = {
  id: layerId;
  icon: string;
  type: "item";
  updateLayers?: React.Dispatch<SetStateAction<SortableLayerObject[]>>;
};
export type SortableLayerItem = {
  id: LayerTypes;
  type: "category";
  layers: SortableLayerObject[];
};

export type cluster = {
  hexIds: string[];
} & {
  [key: string]: unknown;
};

export type otherConfigure =
  | "mapSetting"
  | "Bounding"
  | "Buffer"
  | "Centroid"
  | "Disslove"
  | "BezierSpline"
  | "Simplify"
  | "Explode"
  | "Dbscan"
  | "Kmeans"
  | "Concave"
  | "Convex"
  | "Voronoi"
  | "Interpolate"
  | "TIN"
  | "RandomPolygon"
  | "RandomPoint"
  | "RandomLineString"
  | "Sample"
  | "Difference"
  | "PointsWithinPolygon"
  | "Intersect"
  | "Tag"
  | "Collect"
  | "Measure";

export type layerConfigure = DeckLayer | MapLayer | otherConfigure;

export type layerTypeId =
  | "ArcLayer"
  | "BitmapLayer"
  | "ColumnLayer"
  | "ContourLineLayer"
  | "ContourBandLayer"
  | "GeohashLayer"
  | "GeoJsonLayer"
  | "GridCellLayer"
  | "GridLayer"
  | "H3ClusterLayer"
  | "H3HexagonLayer"
  | "HeatmapLayer1"
  | "HexagonLayer"
  | "IconLayer"
  | "MVTLayer"
  | "PathLayer"
  | "PointCloudLayer"
  | "PolygonLayer"
  | "QuadkeyLayer"
  | "S2Layer"
  | "ScatterplotLayer"
  | "ScenegraphLayer"
  | "ScreenGridLayer"
  | "SimpleMeshLayer"
  | "SolidPolygonLayer"
  | "TerrainLayer"
  | "TextLayer"
  | "TileLayer"
  | "Tile3DLayer"
  | "TripsLayer"
  | MapLayerType;

export type inspectFeatureType = {
  layerId: string;
  sourceId: string;
  geometryType: string;
  properties: { [key: string]: unknown };
};

export type inspectPayloadType = {
  longitude: number;
  latitude: number;
  inspectFeatures: inspectFeatureType[];
};

export type uniqueValueItem = {
  value: string;
  count: number;
};

export type fitOption = "jumpTo" | "flyTo" | "easeTo";

export type grid = "square" | "point" | "hex" | "triangle";

export type aggregateType = "count" | "sum" | "average" | "min" | "max";

// 坐标点类型
export type Coordinate = [number, number];

export type HistogramType = {
  count: number;
  min: number;
  max: number;
  buckets: number[];
};

// 波段统计信息
export type BandStats = {
  min: number;
  max: number;
  mean: number;
  stdDev: number;
};

// 波段信息
export type Band = {
  band: number;
  type: string;
  colorInterpretation: string;
  description?: string;
  min: number;
  max: number;
  mean: number;
  stdDev: number;
  histogram: HistogramType;
};

// 角坐标
export type CornerCoordinates = {
  upperLeft: Coordinate;
  lowerLeft: Coordinate;
  lowerRight: Coordinate;
  upperRight: Coordinate;
  center: Coordinate;
};

// 完整的GDAL信息类型
export type GdalInfoResponse = {
  driverLongName: string;
  size: [number, number];
  bands: Band[];
  cornerCoordinates: CornerCoordinates;
};

export type currentMapStyleType = "mainMap" | "secondaryMap";

export type mapStyle = {
  [key in currentMapStyleType]: string;
};

export type Mode = "side-by-side" | "split-screen" | "overview";

export type drawFeatureType = Record<string, Feature>;
