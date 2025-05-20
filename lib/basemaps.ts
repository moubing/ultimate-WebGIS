import { BasemapObject } from "./types";
import { currentMaptilerKeyIndex, maptilerKeys } from "./keys";

const Aquarelle = {
  name: "Aquarelle",
  description: "Watercolor map for creative use.",
  variants: ["default", "dark", "vivid"],
  images: ["aquarelle.png", "aquarelle-dark.png", "aquarelle-vivid.png"],
};

const Backdrop = {
  name: "Backdrop",
  description: "Monochromatic context map with hillshade.",
  variants: ["default", "dark", "light"],
  images: ["backdrop.png", "backdrop-dark.png", "backdrop-light.png"],
};
const Basic = {
  name: "Basic",
  description: "Light and informative map for general use.",
  variants: ["default", "dark", "light"],
  images: ["basic-v2.png", "basic-v2-dark.png", "basic-v2-light.png"],
};
const Bright = {
  name: "Bright",
  description: "General shiny map for context or navigation.",
  variants: ["default", "dark", "light", "pastel"],
  images: [
    "bright-v2.png",
    "bright-v2-dark.png",
    "bright-v2-light.png",
    "bright-v2-pastel.png",
  ],
};
const Dataviz = {
  name: "Dataviz",
  description: "Simple background map for data visualization.",
  variants: ["default", "dark", "light"],
  images: ["dataviz.png", "dataviz-dark.png", "dataviz-light.png"],
};
const Landscape = {
  name: "Landscape",
  description: "Light terrain map for data overlays and visualisations.",
  variants: ["default"],
  images: ["landscape.png"],
};
const Ocean = {
  name: "Ocean",
  description: "Detailed map of the ocean seafloor and bathymetry.",
  variants: ["default"],
  images: ["ocean.png"],
};
const OpenStreetMap = {
  name: "OpenStreetMap",
  description:
    "Rich and familiar map based on the OpenStreetmap community style.",
  variants: ["default"],
  images: ["openstreetmap.png"],
};
const Outdoor = {
  name: "Outdoor",
  description: "Summer topographic map for sport and mountain apps.",
  variants: ["default", "dark"],
  images: ["outdoor-v2.png", "outdoor-v2-dark.png"],
};
const Satellite = {
  name: "Satellite",
  description: "Seamless satellite and aerial imagery of the world.",
  variants: ["default", "hybrid"],
  images: ["satellite.png", "hybrid.png"],
};
const Streets = {
  name: "Streets",
  description: "Complete and legible map for navigation and mobility.",
  variants: ["default", "dark", "light", "pastel"],
  images: [
    "streets-v2.png",
    "streets-v2-dark.png",
    "streets-v2-light.png",
    "streets-v2-pastel.png",
  ],
};
const Toner = {
  name: "Toner",
  description: "Contrasted monochrome map for general use.",
  variants: ["default", "lite"],
  images: ["toner-v2.png", "toner-v2-lite.png"],
};
const Topo = {
  name: "Topo",
  description: "General topographic map for terrain and nature apps.",
  variants: ["default", "dark", "pastel", "topographique"],
  images: [
    "topo-v2.png",
    "topo-v2-dark.png",
    "topo-v2-pastel.png",
    "topo-v2-topographique.png",
  ],
};
const Winter = {
  name: "Winter",
  description: "Winter topographic map for ski and snow apps.",
  variants: ["default", "dark"],
  images: ["winter-v2.png", "winter-v2-dark.png"],
};
const Japan_Mierune = {
  name: "Japan Mierune",
  description:
    "high-quality map service offering detailed geographic information for Japan.",
  variants: ["default", "dark", "grey"],
  images: [
    "jp-mierune-streets.png",
    "jp-mierune-dark.png",
    "jp-mierune-gray.png",
  ],
};
const NL_Cartiqo = {
  name: "NL Cartiqo",
  description:
    "high-quality map service providing detailed geographic information for the Netherlands.",
  variants: ["default", "dark", "light"],
  images: [
    "nl-cartiqo-topo.png",
    "nl-cartiqo-dark.png",
    "nl-cartiqo-light.png",
  ],
};
const CH_Cadastre = {
  name: "CH Cadastre",
  description:
    "focuses on land registry and property boundaries in Switzerland.",
  variants: ["default", "cadastre satellite"],
  images: ["cadastre.png", "cadastre-satellite.png"],
};
const CH_swisstopo_LBM = {
  name: "CH swisstopo LBM",
  description:
    "from the Swiss Federal Office of Topography (swisstopo) that offers detailed land-based mapping, focusing on land use and terrain features.",
  variants: ["default", "dark", "gray", "vivid"],
  images: [
    "ch-swisstopo-lbm.png",
    "ch-swisstopo-lbm-dark.png",
    "ch-swisstopo-lbm-grey.png",
    "ch-swisstopo-lbm-vivid.png",
  ],
};
const UK_OS_Open_Zoomstack = {
  name: "UK OS Open Zoomstack",
  description:
    "provided by Ordnance Survey that offers detailed, open-access mapping data for the United Kingdom.",
  variants: ["default", "night", "light", "outdoor"],
  images: [
    "uk-openzoomstack-road.png",
    "uk-openzoomstack-night.png",
    "uk-openzoomstack-light.png",
    "uk-openzoomstack-outdoor.png",
  ],
};

const AllBasemap: BasemapObject[] = [
  Aquarelle,
  Backdrop,
  Basic,
  Bright,
  Dataviz,
  Landscape,
  Ocean,
  OpenStreetMap,
  Outdoor,
  Satellite,
  Streets,
  Toner,
  Topo,
  Winter,
  Japan_Mierune,
  NL_Cartiqo,
  CH_Cadastre,
  CH_swisstopo_LBM,
  UK_OS_Open_Zoomstack,
];

const WorldBasemap: BasemapObject[] = [
  Aquarelle,
  Backdrop,
  Basic,
  Bright,
  Dataviz,
  Landscape,
  Ocean,
  OpenStreetMap,
  Outdoor,
  Satellite,
  Streets,
  Toner,
  Topo,
  Winter,
];
const StrictBasemap: BasemapObject[] = [
  Japan_Mierune,
  NL_Cartiqo,
  CH_Cadastre,
  CH_swisstopo_LBM,
  UK_OS_Open_Zoomstack,
];
const VectorBasemap: BasemapObject[] = [
  Aquarelle,
  Backdrop,
  Basic,
  Bright,
  Dataviz,
  Landscape,
  Ocean,
  OpenStreetMap,
  Outdoor,
  Satellite,
  Streets,
  Toner,
  Topo,
  Winter,
  Japan_Mierune,
  NL_Cartiqo,
  CH_Cadastre,
  CH_swisstopo_LBM,
  UK_OS_Open_Zoomstack,
];
const RasterBasemap: BasemapObject[] = [];
const SatelliteBasemap: BasemapObject[] = [Satellite];

export const basemaps = {
  all: AllBasemap,
  world: WorldBasemap,
  strict: StrictBasemap,
  vector: VectorBasemap,
  raster: RasterBasemap,
  satellite: SatelliteBasemap,
};

// 这里这里请求地图的名字其实就是图片的名字，所以这里用的是图片名去掉它的拓展名
export function generateMaptilerUrl(imageName: string) {
  return (
    "https://api.maptiler.com/maps/" +
    imageName.split(".")[0] +
    "/style.json?key=" +
    maptilerKeys[currentMaptilerKeyIndex]
  );
}

export function generateImageUrl(imageName: string) {
  return "/image/" + imageName;
}
