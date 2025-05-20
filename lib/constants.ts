import chroma from "chroma-js";
import {
  FillLayerSpecification,
  GeoJSONSourceSpecification,
  HeatmapLayerSpecification,
  ImageSourceSpecification,
  RasterLayerSpecification,
  ViewState
} from "react-map-gl/maplibre";
import {
  DeckLayer,
  layerId,
  layerTypeId,
  MapLayer,
  MapSource,
  mapStyle,
  SortableLayerItem,
  SortableLayerObject
} from "./types";

export const tiltRate = 10;

const deckLayers: SortableLayerObject[] = [
  {
    id: "ArcLayer",
    icon: "😀",
    type: "item"
  },
  {
    id: "BitmapLayer",
    icon: "😀",
    type: "item"
  },
  {
    id: "ColumnLayer",
    icon: "😀",
    type: "item"
  },
  {
    id: "ContourLineLayer",
    icon: "😀",
    type: "item"
  },
  {
    id: "ContourBandLayer",
    icon: "😀",
    type: "item"
  },
  {
    id: "GeohashLayer",
    icon: "😀",
    type: "item"
  },
  {
    id: "GeoJsonLayer",
    icon: "😀",
    type: "item"
  },
  {
    id: "GridCellLayer",
    icon: "😀",
    type: "item"
  },
  {
    id: "GridLayer",
    icon: "😀",
    type: "item"
  },
  {
    id: "H3ClusterLayer",
    icon: "😀",
    type: "item"
  },
  {
    id: "H3HexagonLayer",
    icon: "😀",
    type: "item"
  },
  {
    id: "HeatmapLayer1",
    icon: "😀",
    type: "item"
  },
  {
    id: "HexagonLayer",
    icon: "😀",
    type: "item"
  },
  {
    id: "IconLayer",
    icon: "😀",
    type: "item"
  },
  {
    id: "LineLayer",
    icon: "😀",
    type: "item"
  },
  {
    id: "MVTLayer",
    icon: "😀",
    type: "item"
  },
  {
    id: "PathLayer",
    icon: "😀",
    type: "item"
  },
  {
    id: "PointCloudLayer",
    icon: "😀",
    type: "item"
  },
  {
    id: "PolygonLayer",
    icon: "😀",
    type: "item"
  },
  {
    id: "QuadkeyLayer",
    icon: "😀",
    type: "item"
  },
  {
    id: "S2Layer",
    icon: "😀",
    type: "item"
  },
  {
    id: "ScatterplotLayer",
    icon: "😀",
    type: "item"
  },
  {
    id: "ScenegraphLayer",
    icon: "😀",
    type: "item"
  },
  {
    id: "ScreenGridLayer",
    icon: "😀",
    type: "item"
  },
  {
    id: "SimpleMeshLayer",
    icon: "😀",
    type: "item"
  },
  {
    id: "SolidPolygonLayer",
    icon: "😀",
    type: "item"
  },
  {
    id: "TerrainLayer",
    icon: "😀",
    type: "item"
  },
  {
    id: "TextLayer",
    icon: "😀",
    type: "item"
  },
  {
    id: "TileLayer",
    icon: "😀",
    type: "item"
  },
  {
    id: "Tile3DLayer",
    icon: "😀",
    type: "item"
  },
  {
    id: "TripsLayer",
    icon: "😀",
    type: "item"
  }
];

const maplibreLayers: SortableLayerObject[] = [
  {
    id: "FillLayer",
    icon: "🥳",
    type: "item"
  },
  {
    id: "LineLayer",
    icon: "🥳",
    type: "item"
  },
  {
    id: "SymbolLayer",
    icon: "🥳",
    type: "item"
  },
  {
    id: "CircleLayer",
    icon: "🥳",
    type: "item"
  },
  {
    id: "HeatmapLayer",
    icon: "🥳",
    type: "item"
  },
  {
    id: "FillExtrusionLayer",
    icon: "🥳",
    type: "item"
  },
  {
    id: "RasterLayer",
    icon: "🥳",
    type: "item"
  },
  {
    id: "HillshadeLayer",
    icon: "🥳",
    type: "item"
  },
  {
    id: "BackgroundLayer",
    icon: "🥳",
    type: "item"
  }
];

export const LAYERS: SortableLayerItem[] = [
  {
    id: "deck",
    type: "category",
    layers: deckLayers
  },
  {
    id: "maplibre",
    type: "category",
    layers: maplibreLayers
  }
];

export const layerDescriptionMap: { [key in layerId]?: string } = {
  ArcLayer:
    "The ArcLayer renders raised arcs joining pairs of source and target coordinates.",
  BitmapLayer: "The BitmapLayer renders a bitmap at specified boundaries.",
  ColumnLayer:
    "The ColumnLayer renders extruded cylinders (tessellated regular polygons) at given coordinates. It is the primitive layer rendered by HexagonLayer after aggregation. Unlike the HexagonLayer, it renders one column for each data object.",
  ContourLineLayer:
    "The ContourLineLayer aggregates data into iso-lines for a given threshold and cell size. Isoline represents collection of line segments that separate the area above and below a given threshold. ",
  ContourBandLayer:
    "The ContourBandLayer aggregates data into  iso-bands for a given threshold and cell size. Isoband represents a collection of polygons (filled) that fill the area containing values in a given threshold range.",
  GeohashLayer:
    "The GeohashLayer renders filled and/or stroked polygons based on the Geohash geospatial indexing system.",
  GeoJsonLayer:
    "The GeoJsonLayer renders GeoJSON formatted data as polygons, lines and points (circles, icons and/or texts).",
  GridCellLayer:
    "The GridCellLayer can render a grid-based heatmap. It is a variation of the ColumnLayer. It takes the constant width / height of all cells and bottom-left coordinate of each cell. This is the primitive layer rendered by GridLayer after aggregation. Unlike the GridLayer, it renders one column for each data object.",
  GridLayer:
    "The GridLayer aggregates data into a grid-based heatmap. The color and height of a grid cell are determined based on the objects it contains.",
  H3ClusterLayer:
    "The H3ClusterLayer renders regions represented by hexagon sets from the H3 geospatial indexing system.",
  H3HexagonLayer:
    "The H3HexagonLayer renders hexagons from the H3 geospatial indexing system.",
  HeatmapLayer1:
    "HeatmapLayer can be used to visualize spatial distribution of data. It internally implements Gaussian Kernel Density Estimation to render heatmaps. ",
  HexagonLayer:
    "The HexagonLayer aggregates data into a hexagon-based heatmap. The color and height of a hexagon are determined based on the objects it contains.",
  IconLayer: "The IconLayer renders raster icons at given coordinates.",
  LineLayer:
    "The LineLayer renders straight lines joining pairs of source and target coordinates.",
  MVTLayer:
    "The MVTLayer is a derived TileLayer that makes it possible to visualize very large datasets through MVTs (Mapbox Vector Tiles). Behaving like TileLayer, it will only load, decode and render MVTs containing features that are visible within the current viewport.",
  PathLayer:
    "The PathLayer renders lists of coordinate points as extruded polylines with mitering",
  PointCloudLayer:
    "The PointCloudLayer renders a point cloud with 3D positions, normals and colors."
};

export const defaultHighlightColor = [0, 0, 128, 128];

// BBox bbox extent in [minX, minY, maxX, maxY] order
export const layerBounds: { [key: string]: [number, number, number, number] } =
  {};

// 定义颜色数组
export const colorValues = [
  "slate",
  "gray",
  "red",
  "orange",
  "amber",
  "lime",
  "emerald",
  "cyan",
  "indigo",
  "fuchsia"
] as const;

// 临时的颜色类型，以后调色板组件做出来了就不用它了
export type colors = (typeof colorValues)[number];

// 临时的颜色，后面调色盘做出来了就不用它了，现在先勉强用，能把图层加进去就ok了
export const customColorMap: { [key in colors]: string } = {
  slate: "#64748b",
  gray: "#6b7280",
  red: "#ef4444",
  orange: "#f97316",
  amber: "#f59e0b",
  lime: "#84cc16",
  emerald: "#10b981",
  cyan: "#06b6d4",
  indigo: "#6366f1",
  fuchsia: "#d946ef"
};

export const initialView: ViewState = {
  longitude: 105.46427,
  latitude: 28.87725,
  zoom: 13,
  bearing: 0,
  pitch: 0,
  padding: { bottom: 0, left: 0, right: 0, top: 0 }
};

export const initialMapStyle: mapStyle = {
  mainMap:
    "https://api.maptiler.com/maps/topo-v2/style.json?key=hkhr31LjR6YMcVLLIxW4",
  secondaryMap:
    "https://api.maptiler.com/maps/basic-v2/style.json?key=hkhr31LjR6YMcVLLIxW4"
};

export const initialDeckLayers: DeckLayer[] = [
  // new ArcLayer({
  //   id: "ArcLayer dfsdf",
  //   data: "http://localhost:3000/example_data/bart-segments.json",
  //   getSourcePosition: (d) => d.fromCoordinates,
  //   getTargetPosition: (d) => d.toCoordinates,
  //   getSourceColor: (d) => [Math.sqrt(d.inbound), 140, 0],
  //   getTargetColor: (d) => [Math.sqrt(d.outbound), 140, 0],
  //   getWidth: 12,
  //   pickable: true,
  // }),
  // new BitmapLayer({
  //   id: "BitmapLayer",
  //   bounds: [-122.519, 37.7045, -122.355, 37.829],
  //   image: "http://localhost:3000/example_data/sf-districts.png",
  //   pickable: true,
  // }),
  // new HexagonLayer({
  //   id: "HexagonLayer",
  //   data: "http://localhost:3000/example_data/sf-bike-parking.json",
  //   gpuAggregation: true,
  //   extruded: true,
  //   getPosition: (d) => d.COORDINATES,
  //   getColorWeight: (d) => d.SPACES,
  //   getElevationWeight: (d) => d.SPACES,
  //   elevationScale: 4,
  //   radius: 200,
  //   pickable: true,
  // }),
];

export const initialMapSources: MapSource[] = [
  {
    type: "geojson",
    id: "type_and_count_polygons",
    data: "/example_data/type_and_count_polygons.geojson",
    generateId: true,
    promoteId: "id"
  } as GeoJSONSourceSpecification & { id: string },
  {
    type: "geojson",
    id: "3127",
    data: "/example_data/3127.geojson",
    generateId: true,
    promoteId: "id"
  } as GeoJSONSourceSpecification & { id: string },
  {
    id: "test-dem.tif",
    type: "image",
    url: "https://maplibre.org/maplibre-gl-js/docs/assets/radar.gif",
    coordinates: [
      [-80.425, 46.437],
      [-71.516, 46.437],
      [-71.516, 37.936],
      [-80.425, 37.936]
    ]
  } as ImageSourceSpecification & { id: string },
  {
    id: "Landsat8_Beijing_2023.tif",
    type: "image",
    url: "http://localhost:3131/Landsat8_Beijing_2023.webp",
    coordinates: [
      [115.9999018, 40.2007768],
      [116.8000312, 40.2007768],
      [116.8000312, 39.7997688],
      [115.9999018, 39.7997688]
    ]
  } as ImageSourceSpecification & { id: string },
  {
    id: "earthquakes",
    type: "geojson",
    data: "/example_data/earthquakes.geojson",
    generateId: true,
    promoteId: "id"
  } as GeoJSONSourceSpecification & { id: string }

  // {
  //   type: "geojson",
  //   id: "3217_line",
  //   data: "/example_data/example_line.geojson",
  //   generateId: true,
  //   promoteId: "id"
  // } as GeoJSONSourceSpecification & { id: string }
];

export const initialMapLayers: MapLayer[] = [
  {
    type: "fill",
    id: "example",
    source: "type_and_count_polygons",
    layout: {
      visibility: "visible"
    },
    paint: {
      "fill-color": "#00ff00",
      "fill-opacity": 0.4
    }
  } as FillLayerSpecification,
  {
    type: "fill",
    id: "example_3217",
    source: "3127",
    layout: {
      visibility: "visible"
    },
    paint: {
      "fill-color": "#00ff00",
      "fill-opacity": 0.4
    }
  } as FillLayerSpecification,
  {
    type: "heatmap",
    id: "heatmap",
    source: "earthquakes",
    layout: { visibility: "visible" },

    paint: {
      // Increase the heatmap weight based on frequency and property magnitude
      "heatmap-weight": ["interpolate", ["linear"], ["get", "mag"], 0, 0, 6, 1],
      // Increase the heatmap color weight weight by zoom level
      // heatmap-intensity is a multiplier on top of heatmap-weight
      "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 0, 1, 9, 3],
      // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
      // Begin color ramp at 0-stop with a 0-transparency color
      // to create a blur-like effect.
      "heatmap-color": [
        "interpolate",
        ["linear"],
        ["heatmap-density"],
        0,
        "rgba(33,102,172,0)",
        0.2,
        "rgb(103,169,207)",
        0.4,
        "rgb(209,229,240)",
        0.6,
        "rgb(253,219,199)",
        0.8,
        "rgb(239,138,98)",
        1,
        "rgb(178,24,43)"
      ],
      // Adjust the heatmap radius by zoom level
      "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 0, 2, 9, 20],
      // Transition from heatmap to circle layer by zoom level
      "heatmap-opacity": ["interpolate", ["linear"], ["zoom"], 7, 1, 9, 0]
    }
  } as HeatmapLayerSpecification,
  {
    id: "test-image",
    source: "test-dem.tif",
    type: "raster",
    paint: {
      "raster-fade-duration": 100,
      "raster-opacity": 1,
      "raster-contrast": 0,
      "raster-saturation": 0
    },
    layout: { visibility: "visible" }
  } as RasterLayerSpecification,
  {
    id: "landsat8",
    source: "Landsat8_Beijing_2023.tif",
    type: "raster",
    paint: {
      "raster-fade-duration": 100,
      "raster-opacity": 1,
      "raster-contrast": 0,
      "raster-saturation": 0
    },
    layout: { visibility: "visible" }
  } as RasterLayerSpecification
  // {
  //   type: "line",
  //   id: "example_3217_line",
  //   source: "3217_line",
  //   layout: {
  //     visibility: "visible"
  //   },
  //   paint: {
  //     "line-color": "#00ff00",
  //     "line-opacity": 0.7,
  //     "line-width": 2
  //   }
  // } as LineLayerSpecification
];

export const customColors = [
  "#64748b",
  "#6b7280",
  "#737373",
  "#78716c",
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#eab308",
  "#84cc16",
  "#22c55e",
  "#10b981",
  "#14b8a6",
  "#06b6d4",
  "#0ea5e9",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#d946ef",
  "#ec4899",
  "#f43f5e"
];

export const prefixStroke = "STROK-";
export const prefixSymbol = "SYMBOL-";

export const toolboxArray = [
  "saveAsImage",
  "restore",
  "dataView",
  "dataZoom",
  "magicType",
  "brush"
];
export const dataZoomArray = ["x inside", "y inside", "x slider", "y slider"];

export const echartColorPalette = [
  "#ea4899",
  "#06b6d4",
  "#8b5cf6",
  "#10b981",
  "#f59e0b"
];

export const defaultCategory = "other";

export const colorMap = Object.keys(
  chroma.brewer
) as chroma.BrewerPaletteName[];

export const unitArr = [
  "kilometers",
  "meters",
  "miles",
  "nauticalmiles",
  "yards",
  "feet",
  "inches",
  "degrees",
  "radians",
  "metres",
  "millimeters",
  "millimetres",
  "centimeters",
  "centimetres",
  "kilometres"
];

export const gridArr = ["square", "point", "hex", "triangle"];

export const baseUrl = "http://localhost:3131";

export const stretchArr = [
  "linear 1%",
  "linear 2%",
  "linear 3%",
  "linear 4%",
  "linear 5%",
  "linear 10%",
  "linear 20%"
];
export const stretchMap = {
  "linear 1%": 1,
  "linear 2%": 2,
  "linear 3%": 3,
  "linear 4%": 4,
  "linear 5%": 5,
  "linear 10%": 10,
  "linear 20%": 20
};

export type stretchType =
  | "linear 1%"
  | "linear 2%"
  | "linear 3%"
  | "linear 4%"
  | "linear 5%"
  | "linear 10%"
  | "linear 20%";

export const mapboxDrawStyle = [
  {
    id: "highlight-active-points",
    type: "circle",
    filter: [
      "all",
      ["==", "$type", "Point"],
      ["==", "meta", "feature"],
      ["==", "active", "true"]
    ],
    paint: {
      "circle-radius": 5,
      "circle-color": "#ea4899",
      "circle-stroke-width": 2,
      "circle-stroke-color": "#ffffff"
    },
    layout: {
      visibility: "visible"
    }
  },
  {
    id: "points-are-blue",
    type: "circle",
    filter: [
      "all",
      ["==", "$type", "Point"],
      ["==", "meta", "feature"],
      ["==", "active", "false"]
    ],
    paint: {
      "circle-radius": 4,
      "circle-color": "#ea489999",
      "circle-stroke-width": 2,
      "circle-stroke-color": "#ffffff"
    }
  },

  {
    id: "gl-draw-line",
    type: "line",
    filter: ["all", ["==", "$type", "LineString"]],
    layout: {
      "line-cap": "round",
      "line-join": "round"
    },
    paint: {
      "line-color": "#ea4899",
      "line-dasharray": [0.2, 2],
      "line-width": 2
    }
  },
  // polygon fill
  {
    id: "gl-draw-polygon-fill",
    type: "fill",
    filter: ["all", ["==", "$type", "Polygon"]],
    paint: {
      "fill-color": "#ea4899",
      "fill-outline-color": "#ea4899",
      "fill-opacity": 0.2
    }
  },
  // polygon mid points
  {
    id: "gl-draw-polygon-midpoint",
    type: "circle",
    filter: ["all", ["==", "$type", "Point"], ["==", "meta", "midpoint"]],
    paint: {
      "circle-radius": 5,
      "circle-color": "#0ea5e9"
    }
  },
  // polygon outline stroke
  // This doesn't style the first edge of the polygon, which uses the line stroke styling instead
  {
    id: "gl-draw-polygon-stroke-active",
    type: "line",
    filter: ["all", ["==", "$type", "Polygon"]],
    layout: {
      "line-cap": "round",
      "line-join": "round"
    },
    paint: {
      "line-color": "#ea4899",
      "line-dasharray": [0.2, 2],
      "line-width": 2
    }
  },
  // vertex point halos
  {
    id: "gl-draw-polygon-and-line-vertex-halo-active",
    type: "circle",
    filter: ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"]],
    paint: {
      "circle-radius": 7,
      "circle-color": "#FFF"
    }
  },
  // vertex points
  {
    id: "gl-draw-polygon-and-line-vertex-active",
    type: "circle",
    filter: ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"]],
    paint: {
      "circle-radius": 5,
      "circle-color": "#ea4899"
    }
  },
  // 面要素标注
  {
    id: "gl-draw-symbol-area",
    type: "symbol",
    filter: ["all", ["==", "$type", "Polygon"]],
    layout: {
      "text-field": ["get", "user_area"],
      "text-size": 16
    },
    paint: {
      "text-halo-color": "#ffffff",
      "text-halo-width": 2,
      "text-color": "#ea4899"
    }
  },

  // 线要素标注
  {
    id: "gl-draw-symbol-length",
    type: "symbol",
    filter: ["all", ["==", "$type", "LineString"], ["has", "user_length"]],
    layout: {
      "text-field": ["get", "user_length"],
      "text-size": 16,
      "symbol-placement": "line"
    },
    paint: {
      "text-halo-color": "#ffffff",
      "text-halo-width": 2,
      "text-color": "#ea4899"
    }
  },

  // 点要素标注
  {
    id: "gl-draw-symbol-coordinate",
    type: "symbol",
    filter: ["all", ["==", "$type", "Point"]],
    layout: {
      "text-field": ["get", "user_coordinate"],
      "text-size": 16,
      "text-anchor": "top",
      "text-offset": [0, 0.8]
    },
    paint: {
      "text-halo-color": "#ffffff",
      "text-halo-width": 2,
      "text-color": "#ea4899"
    }
  }
];
