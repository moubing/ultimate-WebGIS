import { initialMapStyle } from "@/lib/constants";
import {
  currentMapStyleType,
  DeckLayer,
  drawFeatureType,
  inspectPayloadType,
  layerConfigure,
  MapLayer,
  MapSource,
  mapStyle,
  Mode
} from "@/lib/types";
import { MapboxOverlay } from "@deck.gl/mapbox";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { Feature } from "geojson";
import React, { createContext } from "react";
import { GeoJSONSourceSpecification, ViewState } from "react-map-gl/maplibre";

export const DeckOverlayContext = createContext<MapboxOverlay | null>(null);
export const SetDeckOverlayContext = createContext<
  React.Dispatch<React.SetStateAction<MapboxOverlay | null>>
>(() => {});

export const MapStyleContext = createContext<mapStyle>(initialMapStyle);
export const SetMapStyleContext = createContext<
  React.Dispatch<React.SetStateAction<mapStyle>>
>(() => {});

export const MapLayersContext = createContext<MapLayer[]>([]);
export const SetMapLayersContext = createContext<
  React.Dispatch<React.SetStateAction<MapLayer[]>>
>(() => {});
export const MapSourcesContext = createContext<MapSource[]>([]);
export const SetMapSourcesContext = createContext<
  React.Dispatch<React.SetStateAction<MapSource[]>>
>(() => {});

export const DeckLayersContext = createContext<DeckLayer[]>([]);
export const SetDeckLayersContext = createContext<
  React.Dispatch<React.SetStateAction<DeckLayer[]>>
>(() => {});

export const CurrentLayerContext = createContext<layerConfigure | null>(null);
export const SetCurrentLayerContext = createContext<
  React.Dispatch<React.SetStateAction<layerConfigure | null>>
>(() => {});

export const ViewStateContext = createContext<ViewState | null>(null);
export const SetViewStateContext = createContext<
  React.Dispatch<React.SetStateAction<ViewState | null>>
>(() => {});

export const CurrentSourceContext = createContext<
  (GeoJSONSourceSpecification & { id: string }) | null
>(null);
export const SetCurrentSourceContext = createContext<
  React.Dispatch<
    React.SetStateAction<(GeoJSONSourceSpecification & { id: string }) | null>
  >
>(() => {});

export const FeatureSelectionContext = createContext<Feature[]>([]);
export const SetFeatureSelectionContext = createContext<
  React.Dispatch<React.SetStateAction<Feature[]>>
>(() => {});

export const InspectPaylodContext = createContext<inspectPayloadType | null>(
  null
);
export const SetInspectPaylodContext = createContext<
  React.Dispatch<React.SetStateAction<inspectPayloadType | null>>
>(() => {});

export const InspectLayersContext = createContext<string[]>([]);
export const SetInspectLayersContext = createContext<
  React.Dispatch<React.SetStateAction<string[]>>
>(() => {});

export const CurrentMapStyleContext =
  createContext<currentMapStyleType>("mainMap");
export const SetCurrentMapStyleContext = createContext<
  React.Dispatch<React.SetStateAction<currentMapStyleType>>
>(() => {});

export const CurrentModeContext = createContext<Mode>("overview");
export const SetCurrentModeContext = createContext<
  React.Dispatch<React.SetStateAction<Mode>>
>(() => {});

export const DrawContext = createContext<MapboxDraw | null>(null);
export const SetDrawContext = createContext<
  React.Dispatch<React.SetStateAction<MapboxDraw | null>>
>(() => {});

export const DrawFeaturesContext = createContext<drawFeatureType>({});
export const SetDrawFeaturesContext = createContext<
  React.Dispatch<React.SetStateAction<drawFeatureType>>
>(() => {});
