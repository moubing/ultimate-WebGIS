"use client";

import React, { useState } from "react";
import { MapProvider } from "react-map-gl/maplibre";
import {
  DeckOverlayContext,
  DrawContext,
  DrawFeaturesContext,
  InspectLayersContext,
  SetDeckOverlayContext,
  SetDrawContext,
  SetDrawFeaturesContext,
  SetInspectLayersContext
} from "./contexts";
import { MapboxOverlay } from "@deck.gl/mapbox";
import MapboxDraw from "@mapbox/mapbox-gl-draw";

import { drawFeatureType } from "@/lib/types";

function MapsProvider({ children }: { children: React.ReactNode }) {
  const [deck, setDeck] = useState<MapboxOverlay | null>(null);
  const [inspectLayers, setInspectLayers] = useState<string[]>(["example"]);
  const [draw, setDraw] = useState<MapboxDraw | null>(null);
  const [drawFeatures, setDrawFeatures] = useState<drawFeatureType>({});
  return (
    <MapProvider>
      <DeckOverlayContext.Provider value={deck}>
        <SetDeckOverlayContext.Provider value={setDeck}>
          <InspectLayersContext.Provider value={inspectLayers}>
            <SetInspectLayersContext.Provider value={setInspectLayers}>
              <DrawContext.Provider value={draw}>
                <SetDrawContext.Provider value={setDraw}>
                  <DrawFeaturesContext.Provider value={drawFeatures}>
                    <SetDrawFeaturesContext.Provider value={setDrawFeatures}>
                      {children}
                    </SetDrawFeaturesContext.Provider>
                  </DrawFeaturesContext.Provider>
                </SetDrawContext.Provider>
              </DrawContext.Provider>
            </SetInspectLayersContext.Provider>
          </InspectLayersContext.Provider>
        </SetDeckOverlayContext.Provider>
      </DeckOverlayContext.Provider>
    </MapProvider>
  );
}

export default MapsProvider;
