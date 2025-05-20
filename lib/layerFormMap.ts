import ArcLayerForm from "@/app/components/hearder/middle-header/add-layer-forms/ArcLayerForm";
import BitmapLayerForm from "@/app/components/hearder/middle-header/add-layer-forms/BitmapLayerForm";
import { layerId } from "./types";
import ColumnLayerForm from "@/app/components/hearder/middle-header/add-layer-forms/ColumnLayerForm";
import ContourLineLayerForm from "@/app/components/hearder/middle-header/add-layer-forms/ContourLineLayerForm";
import ContourBandLayer from "@/app/components/hearder/middle-header/add-layer-forms/ContourBandLayerForm";
import GeohashLayerForm from "@/app/components/hearder/middle-header/add-layer-forms/GeohashLayerForm";
import GeoJsonLayerForm from "@/app/components/hearder/middle-header/add-layer-forms/GeoJsonLayerForm";
import GridCellLayerForm from "@/app/components/hearder/middle-header/add-layer-forms/GridCellLayerForm";
import GridLayerForm from "@/app/components/hearder/middle-header/add-layer-forms/GridLayerForm";
import H3ClusterLayerForm from "@/app/components/hearder/middle-header/add-layer-forms/H3ClusterLayerForm";
import H3HexagonLayerForm from "@/app/components/hearder/middle-header/add-layer-forms/H3HexagonLayerForm";
import DeckHeatmapLayerForm from "@/app/components/hearder/middle-header/add-layer-forms/DeckHeatmapForm";
import HexagonLayerForm from "@/app/components/hearder/middle-header/add-layer-forms/HexagonLayerForm";
import IconLayerForm from "@/app/components/hearder/middle-header/add-layer-forms/IconLayerForm";
import LineLayerForm from "@/app/components/hearder/middle-header/add-layer-forms/LineLayerForm";
import MVTLayerForm from "@/app/components/hearder/middle-header/add-layer-forms/MVTLayerForm";
import PathLayerForm from "@/app/components/hearder/middle-header/add-layer-forms/PathLayerForm";
import PointCloudLayerForm from "@/app/components/hearder/middle-header/add-layer-forms/PointCloudLayerFrom";

export const layerFormMap: {
  [key in layerId]?: React.ComponentType<{ closeAllDialog: () => void }>;
} = {
  ArcLayer: ArcLayerForm,
  BitmapLayer: BitmapLayerForm,
  ColumnLayer: ColumnLayerForm,
  ContourLineLayer: ContourLineLayerForm,
  ContourBandLayer: ContourBandLayer,
  GeohashLayer: GeohashLayerForm,
  GeoJsonLayer: GeoJsonLayerForm,
  GridCellLayer: GridCellLayerForm,
  GridLayer: GridLayerForm,
  H3ClusterLayer: H3ClusterLayerForm,
  H3HexagonLayer: H3HexagonLayerForm,
  HeatmapLayer1: DeckHeatmapLayerForm,
  HexagonLayer: HexagonLayerForm,
  IconLayer: IconLayerForm,
  LineLayer: LineLayerForm,
  MVTLayer: MVTLayerForm,
  PathLayer: PathLayerForm,
  PointCloudLayer: PointCloudLayerForm,
};
