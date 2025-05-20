import BoundingPanel from "@/app/components/layer-configure/BoundingPanel";
import MapSetting from "@/app/components/layer-configure/MapSetting";
import ArcLayerConfigure from "@/app/components/layer-list/Layer-configure/ArcLayerConfigure";
import FillLayerConfigure from "@/app/components/layer-list/Layer-configure/FillLayerConfigure";
import React from "react";
import { layerTypeId, otherConfigure } from "./types";
import BufferPanel from "@/app/components/layer-configure/BufferPanel";
import CentroidPanel from "@/app/components/layer-configure/CentroidPanel";
import DissolvePanel from "@/app/components/layer-configure/DissolvePanel";
import BezierSplinePanel from "@/app/components/layer-configure/BezierSplinePanel";
import SimplifyPanel from "@/app/components/layer-configure/SimplifyPanle";
import ExplodePanel from "@/app/components/layer-configure/ExplodePanel";
import DbscanPanel from "@/app/components/layer-configure/DbscanPanel";
import KmeansPanel from "@/app/components/layer-configure/KmeansPanel";
import ConcavePanel from "@/app/components/layer-configure/ConcavePanel";
import ConvexPanel from "@/app/components/layer-configure/ConvexPanel";
import VoronoiPanel from "@/app/components/layer-configure/VoronoiPanel";
import InterpolatePanel from "@/app/components/layer-configure/InterpolatePanel";
import TINPanel from "@/app/components/layer-configure/TINPanel";
import RandomPointPanel from "@/app/components/layer-configure/RandomPointPanel";
import RandomLineStringPanel from "@/app/components/layer-configure/RandomLineStringPanel";
import SamplePanel from "@/app/components/layer-configure/SamplePanel";
import RandomPolygonPanel from "@/app/components/layer-configure/RandomPolygonPanel";
import IntersectPanel from "@/app/components/layer-configure/IntersectPanel";
import DifferencePanel from "@/app/components/layer-configure/DifferencePanel";
import PointsWithinPolygonPanel from "@/app/components/layer-configure/PointsWithinPolygonPanel";
import TagPanel from "@/app/components/layer-configure/TagPanel";
import CollectPanel from "@/app/components/layer-configure/CollectPanle";
import RasterLayerConfigure from "@/app/components/layer-list/Layer-configure/RasterLayerConfigure";
import MeasurePanel from "@/app/components/hearder/middle-header/Measure/MeasurePanel";

export const layerConfigureMap: {
  [key in layerTypeId | otherConfigure]?: React.FC;
} = {
  mapSetting: MapSetting,
  ArcLayer: ArcLayerConfigure,
  fill: FillLayerConfigure,
  raster: RasterLayerConfigure,
  Bounding: BoundingPanel,
  Buffer: BufferPanel,
  Centroid: CentroidPanel,
  Disslove: DissolvePanel,
  BezierSpline: BezierSplinePanel,
  Simplify: SimplifyPanel,
  Explode: ExplodePanel,
  Dbscan: DbscanPanel,
  Kmeans: KmeansPanel,
  Concave: ConcavePanel,
  Convex: ConvexPanel,
  Voronoi: VoronoiPanel,
  Interpolate: InterpolatePanel,
  TIN: TINPanel,
  RandomPoint: RandomPointPanel,
  RandomLineString: RandomLineStringPanel,
  RandomPolygon: RandomPolygonPanel,
  Sample: SamplePanel,
  Intersect: IntersectPanel,
  Difference: DifferencePanel,
  PointsWithinPolygon: PointsWithinPolygonPanel,
  Tag: TagPanel,
  Collect: CollectPanel,
  Measure: MeasurePanel
};
