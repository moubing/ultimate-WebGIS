"use client";

import {
  initialDeckLayers,
  initialMapLayers,
  initialMapSources,
  initialMapStyle,
  initialView
} from "@/lib/constants";
import {
  DeckLayer,
  inspectPayloadType,
  layerConfigure,
  MapLayer,
  MapSource,
  mapStyle,
  Mode
} from "@/lib/types";
import React, { useState } from "react";
import { ViewState } from "react-map-gl/maplibre";
import {
  CurrentLayerContext,
  CurrentModeContext,
  DeckLayersContext,
  InspectPaylodContext,
  MapLayersContext,
  MapSourcesContext,
  MapStyleContext,
  SetCurrentLayerContext,
  SetCurrentModeContext,
  SetDeckLayersContext,
  SetInspectPaylodContext,
  SetMapLayersContext,
  SetMapSourcesContext,
  SetMapStyleContext,
  SetViewStateContext,
  ViewStateContext
} from "./contexts";

function CustomProvider({ children }: { children: React.ReactNode }) {
  const [mapStyle, setMapStyle] = useState<mapStyle>(initialMapStyle);
  const [mapLayers, setMapLayers] = useState<MapLayer[]>(initialMapLayers);
  const [mapSources, setMapSources] = useState<MapSource[]>(initialMapSources);
  const [currentLayer, setCurrentLayer] = useState<layerConfigure | null>(null);
  const [deckLayers, setDeckLayers] = useState<DeckLayer[]>(initialDeckLayers);
  const [currentMode, setCurrentMode] = useState<Mode>("overview");

  const [viewState, setViewState] = React.useState<ViewState | null>(
    initialView
  );
  const [inspectPayload, setInspectPayload] =
    useState<inspectPayloadType | null>(null);

  return (
    <MapStyleContext.Provider value={mapStyle}>
      <SetMapStyleContext.Provider value={setMapStyle}>
        <MapLayersContext.Provider value={mapLayers}>
          <SetMapLayersContext.Provider value={setMapLayers}>
            <MapSourcesContext.Provider value={mapSources}>
              <SetMapSourcesContext.Provider value={setMapSources}>
                <CurrentLayerContext.Provider value={currentLayer}>
                  <SetCurrentLayerContext.Provider value={setCurrentLayer}>
                    <DeckLayersContext.Provider value={deckLayers}>
                      <SetDeckLayersContext.Provider value={setDeckLayers}>
                        <ViewStateContext.Provider value={viewState}>
                          <SetViewStateContext.Provider value={setViewState}>
                            <InspectPaylodContext.Provider
                              value={inspectPayload}
                            >
                              <SetInspectPaylodContext.Provider
                                value={setInspectPayload}
                              >
                                <CurrentModeContext.Provider
                                  value={currentMode}
                                >
                                  <SetCurrentModeContext.Provider
                                    value={setCurrentMode}
                                  >
                                    {children}
                                  </SetCurrentModeContext.Provider>
                                </CurrentModeContext.Provider>
                              </SetInspectPaylodContext.Provider>
                            </InspectPaylodContext.Provider>
                          </SetViewStateContext.Provider>
                        </ViewStateContext.Provider>
                      </SetDeckLayersContext.Provider>
                    </DeckLayersContext.Provider>
                  </SetCurrentLayerContext.Provider>
                </CurrentLayerContext.Provider>
              </SetMapSourcesContext.Provider>
            </MapSourcesContext.Provider>
          </SetMapLayersContext.Provider>
        </MapLayersContext.Provider>
      </SetMapStyleContext.Provider>
    </MapStyleContext.Provider>
  );
}

export default CustomProvider;
