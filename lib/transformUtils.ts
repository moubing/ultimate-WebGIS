import * as turf from "@turf/turf";
import {
  Feature,
  FeatureCollection,
  LineString,
  MultiPoint,
  MultiPolygon,
  Point,
  Polygon
} from "geojson";
import {
  CircleLayerSpecification,
  FillLayerSpecification,
  GeoJSONSourceSpecification,
  ImageSourceSpecification,
  LineLayerSpecification,
  RasterLayerSpecification
} from "maplibre-gl";
import { toast } from "sonner";
import { aggregateType, grid } from "./types";

const defaultFillColor = "#a5f3fc";
const defautlFillOpacity = 0.4;

const defalutLineColor = "#06b6d4";
const defaultLineOpacity = 0.7;
const defaultLineWidth = 2;

const defaultCircleColor = "#ea4899";
const defaultCircleOpacity = 0.4;
const defaultCircleRadius = 6;
const defaultCircleStrokeColor = "#ffffff";
const defaultCircleStrokeOpacity = 0.7;
const defaultCircleStrokeWidth = 2;

// 这里的caculate(calculate)拼写错了，但是我懒得改了，只是一个名称而已

export function caculateBounding(feaCollection: FeatureCollection) {
  const features = feaCollection.features;
  const bboxes = features.map((fea) => {
    const bbox = turf.bbox(fea);
    return turf.bboxPolygon(bbox, {
      properties: fea.properties,
      id: fea.id
    });
  });

  return turf.featureCollection(bboxes);
}

export function generateGeojsonSource(
  feaCollection: FeatureCollection,
  sourceId: string
) {
  return {
    type: "geojson",
    id: sourceId,
    generateId: true,
    promoteId: "id",
    data: feaCollection
  } as GeoJSONSourceSpecification & { id: string };
}

export function generateImageSource(
  sourceId: string,
  url: string,
  coordinates: [
    [number, number],
    [number, number],
    [number, number],
    [number, number]
  ]
) {
  return {
    id: sourceId,
    url,
    coordinates,
    type: "image"
  } as ImageSourceSpecification & { id: string };
}

export function generateRasterLayer(sourceId: string, layerId: string) {
  return {
    id: layerId,
    source: sourceId,
    type: "raster",
    paint: {
      "raster-fade-duration": 100,
      "raster-opacity": 1
    },
    layout: { visibility: "visible" }
  } as RasterLayerSpecification;
}

export function generateFillLayer(sourceId: string, layerId: string) {
  return {
    id: layerId,
    type: "fill",
    source: sourceId,
    paint: {
      "fill-color": defaultFillColor,
      "fill-opacity": defautlFillOpacity
    },
    layout: { visibility: "visible" }
  } as FillLayerSpecification;
}

export function generateLineLayer(sourceId: string, layerId: string) {
  return {
    id: layerId,
    type: "line",
    source: sourceId,
    paint: {
      "line-color": defalutLineColor,
      "line-opacity": defaultLineOpacity,
      "line-width": defaultLineWidth
    },
    layout: {
      visibility: "visible"
    }
  } as LineLayerSpecification;
}

export function caculateBuffer(
  feaCollection: FeatureCollection,
  radius: number,
  steps: number,
  unit: turf.Units,
  direction: "inside" | "outside"
) {
  if (direction === "inside") {
    radius = -radius;
  }
  const buffer = turf.buffer(feaCollection, radius, {
    units: unit,
    steps
  });

  if (!buffer) {
    toast.message("no buffer generated");
    return turf.featureCollection([]);
  }
  return buffer;
}

export function caculateCentroid(feaCollection: FeatureCollection) {
  const features = feaCollection.features;
  const centroids = features.map((feature) =>
    turf.centroid(feature, {
      properties: feature.properties
    })
  );

  return turf.featureCollection(centroids);
}

export function generateCircleLayer(sourceId: string, layerId: string) {
  return {
    id: layerId,
    source: sourceId,
    type: "circle",
    paint: {
      "circle-color": defaultCircleColor,
      "circle-opacity": defaultCircleOpacity,
      "circle-radius": defaultCircleRadius,
      "circle-stroke-color": defaultCircleStrokeColor,
      "circle-stroke-opacity": defaultCircleStrokeOpacity,
      "circle-stroke-width": defaultCircleStrokeWidth
    },
    layout: { visibility: "visible" }
  } as CircleLayerSpecification;
}

// 这里的dissolve只能处理那个polygon，multipolygon会被过滤掉，不被处理
export function caculateDissolve(
  feaCollection: FeatureCollection<Polygon>,
  propertyName?: string
) {
  const filteredFeatures = feaCollection.features.filter(
    (feature) => feature.geometry.type === "Polygon"
  );

  const newFeaCollection = turf.featureCollection(filteredFeatures);
  if (propertyName) {
    return turf.dissolve(newFeaCollection, {
      propertyName
    });
  }

  return turf.dissolve(newFeaCollection);
}

export function caculateBezierSpline(
  feaCollection: FeatureCollection<LineString>,
  sharpness: number
) {
  const features = feaCollection.features;
  const bezierSplines = features.map((feature) =>
    turf.bezierSpline(feature, {
      sharpness,
      properties: feature.properties
    })
  );
  return turf.featureCollection(bezierSplines);
}

export function caculateSimplify(
  feaCollection: FeatureCollection,
  tolerance: number,
  highQuality: boolean
) {
  return turf.simplify(feaCollection, {
    tolerance,
    highQuality
  });
}

export function caculateExplode(feaCollection: FeatureCollection) {
  return turf.explode(feaCollection);
}

export function caculateDbscan(
  feaCollection: FeatureCollection<Point>,
  maxDistance: number,
  unit: turf.Units,
  minPoints: number
) {
  return turf.clustersDbscan(feaCollection, maxDistance, {
    units: unit,
    minPoints
  });
}

export function caculateKmeans(
  feaCollection: FeatureCollection<Point>,
  numberOfClusters: number
) {
  if (numberOfClusters === 0) {
    return turf.clustersKmeans(feaCollection);
  } else {
    return turf.clustersKmeans(feaCollection, {
      numberOfClusters
    });
  }
}

export function caculateConcave(
  feaCollection: FeatureCollection<Point>,
  maxEdge: number,
  unit: turf.Units
) {
  let newMaxEdge: number | undefined = maxEdge;
  if (maxEdge === 0) {
    newMaxEdge = undefined;
  }
  const result = turf.concave(feaCollection, {
    maxEdge: newMaxEdge,
    units: unit
  });
  if (result) {
    return turf.featureCollection([result]);
  } else {
    return turf.featureCollection([]);
  }
}

export function caculateConvex(
  feaCollection: FeatureCollection,
  concavity: number
) {
  let newConcavity: number | undefined = concavity;
  if (concavity === 0) {
    newConcavity = undefined;
  }
  const result = turf.convex(feaCollection, { concavity: newConcavity });

  if (result) {
    return turf.featureCollection([result]);
  } else {
    return turf.featureCollection([]);
  }
}

export function caculateVoronoi(feaCollection: FeatureCollection<Point>) {
  const bbox = turf.bbox(feaCollection);
  return turf.voronoi(feaCollection, { bbox });
}

export function caculateInterpolate(
  feaCollection: FeatureCollection<Point>,
  cellSize: number,
  gridType: grid,
  property: string,
  unit: turf.Units,
  weight: number
) {
  return turf.interpolate(feaCollection, cellSize, {
    gridType,
    property,
    units: unit,
    weight
  });
}

export function caculateTIN(
  feaCollection: FeatureCollection<Point>,
  property: string
) {
  const result = turf.tin(feaCollection, property);
  result.features.forEach((feature) => {
    if (feature && feature.properties)
      feature.properties.sum =
        feature.properties.a + feature.properties.b + feature.properties.c;
  });
  return result;
}

export function caculateRandomPoint(
  count: number,
  bbox: [number, number, number, number]
) {
  return turf.randomPoint(count, {
    bbox
  });
}
export function caculateRandomLineString(
  count: number,
  bbox: [number, number, number, number],
  vertices: number,
  maxLength: number,
  rotation: number
) {
  return turf.randomLineString(count, {
    bbox,
    num_vertices: vertices,
    max_length: maxLength,
    max_rotation: rotation
  });
}
export function caculateRandomPolygon(
  count: number,
  bbox: [number, number, number, number],
  vertices: number,
  maxRadialLength: number
) {
  return turf.randomPolygon(count, {
    bbox,
    num_vertices: vertices,
    max_radial_length: maxRadialLength
  });
}

export function caculateSample(
  feaCollection: FeatureCollection,
  count: number
) {
  return turf.sample(feaCollection, count);
}

export function caculateInterscet(
  baseFeaCollection: FeatureCollection<MultiPolygon | Polygon>,
  overlayFeaCollection: FeatureCollection<MultiPolygon | Polygon>
) {
  const baseFeatures = baseFeaCollection.features;
  const overlayFeatures = overlayFeaCollection.features;

  const result: Feature<MultiPolygon | Polygon>[] = [];
  for (let i = 0; i < baseFeatures.length; i++) {
    for (let j = 0; j < overlayFeatures.length; j++) {
      const newFeaCollection = turf.featureCollection([
        baseFeatures[i],
        overlayFeatures[j]
      ]);
      const newFea = turf.intersect(newFeaCollection, {
        properties: baseFeatures[i].properties
      });
      if (newFea) result.push(newFea);
    }
  }

  return turf.featureCollection(result);
}

export function caculateDifference(
  baseFeaCollection: FeatureCollection<MultiPolygon | Polygon>,
  overlayFeaCollection: FeatureCollection<MultiPolygon | Polygon>
) {
  const baseFeatures = baseFeaCollection.features;
  const overlayFeatures = overlayFeaCollection.features;

  const result: Feature<MultiPolygon | Polygon>[] = [];

  for (let i = 0; i < baseFeatures.length; i++) {
    const newFeaCollection = turf.featureCollection([
      baseFeatures[i],
      ...overlayFeatures
    ]);
    const newFea = turf.difference(newFeaCollection);
    if (newFea) result.push(newFea);
  }

  return turf.featureCollection(result);
}

export function caculatePointsWithinPolygon(
  pointFeaCollection: FeatureCollection<MultiPoint | Point>,
  polygonFeaCollection: FeatureCollection<MultiPolygon | Polygon>
) {
  return turf.pointsWithinPolygon(pointFeaCollection, polygonFeaCollection);
}

export function caculateTag(
  pointFeaCollection: FeatureCollection<Point>,
  polygonFeaCollection: FeatureCollection<MultiPolygon | Polygon>,
  field: string,
  outField: string
) {
  return turf.tag(pointFeaCollection, polygonFeaCollection, field, outField);
}

const aggreateFunctionMap = new Map([
  [
    "count",
    (feaCollection: FeatureCollection<Polygon>, outField: string) => {
      const newFeaCollection = turf.clone(feaCollection);
      newFeaCollection.features.forEach((feature) => {
        feature.properties![outField] = feature.properties![outField].length;
      });

      return newFeaCollection;
    }
  ],
  [
    "sum",
    (feaCollection: FeatureCollection<Polygon>, outField: string) => {
      const newFeaCollection = turf.clone(feaCollection);

      newFeaCollection.features.forEach((feature) => {
        let sum = 0;
        feature.properties![outField].forEach(
          (value: number) => (sum += value as number)
        );
        feature.properties![outField] = sum;
      });
      return newFeaCollection;
    }
  ],
  [
    "average",
    (feaCollection: FeatureCollection<Polygon>, outField: string) => {
      const newFeaCollection = turf.clone(feaCollection);

      newFeaCollection.features.forEach((feature) => {
        let sum = 0;
        feature.properties![outField].forEach(
          (value: number) => (sum += value as number)
        );

        feature.properties![outField] =
          sum / feature.properties![outField].length;
      });
      return newFeaCollection;
    }
  ],
  [
    "min",
    (feaCollection: FeatureCollection<Polygon>, outField: string) => {
      const newFeaCollection = turf.clone(feaCollection);

      newFeaCollection.features.forEach((feature) => {
        if (feature.properties![outField].length === 0) {
          feature.properties![outField] = NaN;
          return;
        }
        feature.properties![outField] = Math.min(
          ...feature.properties![outField]
        );
      });
      return newFeaCollection;
    }
  ],
  [
    "max",
    (feaCollection: FeatureCollection<Polygon>, outField: string) => {
      const newFeaCollection = turf.clone(feaCollection);

      newFeaCollection.features.forEach((feature) => {
        if (feature.properties![outField].length === 0) {
          feature.properties![outField] = NaN;
          return;
        }

        feature.properties![outField] = Math.max(
          ...feature.properties![outField]
        );
      });
      return newFeaCollection;
    }
  ]
]);

export function caculateCollect(
  pointFeaCollection: FeatureCollection<Point>,
  polygonFeaCollection: FeatureCollection<Polygon>,
  field: string,
  outField: string,
  aggregate: string
) {
  const result = turf.collect(
    polygonFeaCollection,
    pointFeaCollection,
    field,
    outField
  );

  const func = aggreateFunctionMap.get(aggregate as aggregateType);
  if (func) {
    return func(result, outField);
  }

  return result;
}
