"use client";

import {
  CurrentModeContext,
  DeckLayersContext,
  MapLayersContext,
  MapSourcesContext,
  MapStyleContext,
  SetViewStateContext,
  ViewStateContext
} from "@/app/providers/contexts";
import { Mode } from "@/lib/types";
import "maplibre-gl/dist/maplibre-gl.css";
import { CSSProperties, useCallback, useContext, useMemo } from "react";
import Map, {
  AttributionControl,
  FullscreenControl,
  GeolocateControl,
  Layer,
  NavigationControl,
  Source,
  TerrainControl,
  TerrainSpecification,
  ViewStateChangeEvent
} from "react-map-gl/maplibre";
import InspectPanle from "../inspect/InspectPanle";
import CustomImageSource from "./CustomImageSource";
import CustomSource from "./CustomSource";
import DeckGLOverlay from "./DeckGLOverlay";
import DrawControl from "./DrawControl";
import { mapboxDrawStyle } from "@/lib/constants";

const mainMapStyle: Record<Mode, CSSProperties> = {
  overview: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    zIndex: 10
  },
  "side-by-side": {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "50%",
    zIndex: 10
  },
  "split-screen": {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "50%",
    zIndex: 10
  }
};
const secondaryMapStyle: Record<Mode, CSSProperties> = {
  overview: {
    position: "absolute",
    bottom: "1rem",
    left: "1rem",
    height: "200px",
    width: "300px",
    zIndex: 20,
    borderWidth: "4px",
    borderColor: "#d4d4d8",
    borderRadius: "10px",
    cursor: "not-allowed"
  },
  "side-by-side": {
    position: "absolute",
    top: 0,
    left: "50%",
    height: "100%",
    width: "50%",
    zIndex: 1
  },
  "split-screen": {
    position: "absolute",
    top: 0,
    left: "50%",
    zIndex: 1,

    height: "100%",
    width: "50%"
  }
};

function MainMap() {
  const viewState = useContext(ViewStateContext);
  const setViewState = useContext(SetViewStateContext);

  const mapStyle = useContext(MapStyleContext);
  const layers = useContext(DeckLayersContext);

  const mapSources = useContext(MapSourcesContext);
  const mapLayers = useContext(MapLayersContext);

  const mode = useContext(CurrentModeContext);

  const onMove = useCallback(
    (evt: ViewStateChangeEvent) => setViewState(evt.viewState),
    [setViewState]
  );

  const secondaryMapView = useMemo(() => {
    if (mode === "side-by-side" || mode === "split-screen")
      return {
        ...viewState
      };
    else {
      return {
        ...viewState,
        zoom: (viewState?.zoom || 14) - 3
      };
    }
  }, [mode, viewState]);

  const width = typeof window === "undefined" ? 100 : window.innerWidth;
  const leftMapPadding = useMemo(() => {
    return {
      left: mode === "split-screen" ? width / 2 : 0,
      top: 0,
      right: 0,
      bottom: 0
    };
  }, [width, mode]);
  const rightMapPadding = useMemo(() => {
    return {
      right: mode === "split-screen" ? width / 2 : 0,
      top: 0,
      left: 0,
      bottom: 0
    };
  }, [width, mode]);

  const terrain: TerrainSpecification = {
    source: "terrain-dem",
    exaggeration: 1.5
  };

  const mapSourcesMemo = useMemo(
    () =>
      mapSources.map((source) => {
        return source.type === "geojson" ? (
          <CustomSource key={source.id} source={source} />
        ) : source.type === "image" ? (
          <CustomImageSource source={source} key={source.id} />
        ) : (
          <Source key={source.id} {...source} />
        );
      }),
    [mapSources]
  );

  const mapLayersMemo = useMemo(
    () => mapLayers.map((layer) => <Layer key={layer.id} {...layer} />),
    [mapLayers]
  );

  return (
    <>
      <Map
        id="mainMap"
        {...viewState}
        onMove={onMove}
        style={mainMapStyle[mode]}
        cancelPendingTileRequestsWhileZooming={false}
        mapStyle={mapStyle.mainMap}
        padding={leftMapPadding}
        terrain={terrain}
      >
        <Source
          id="terrain-dem"
          type="raster-dem"
          url="https://api.maptiler.com/tiles/terrain-rgb-v2/tiles.json?key=hkhr31LjR6YMcVLLIxW4"
          tileSize={256}
        />
        {mapSourcesMemo}
        {mapLayersMemo}

        <InspectPanle />
        <DeckGLOverlay
          getTooltip={(info) => JSON.stringify(info.object)}
          layers={layers}
        />
        <NavigationControl
          style={{ top: "3.5rem", position: "fixed", right: "0rem" }}
        />
        <FullscreenControl
          style={{ top: "9.5rem", position: "fixed", right: "0rem" }}
        />
        <AttributionControl />
        <GeolocateControl
          style={{ top: "12rem", position: "fixed", right: "0rem" }}
        />
        <TerrainControl
          {...terrain}
          style={{ top: "14.5rem", position: "fixed", right: "0rem" }}
        />
        <DrawControl
          position="bottom-right"
          displayControlsDefault={true}
          controls={{
            polygon: true,
            trash: true
          }}
          userProperties={true}
          defaultMode="draw_polygon"
          styles={mapboxDrawStyle}
        />
      </Map>
      <Map
        key={mode}
        onMove={onMove}
        id="secondaryMap"
        {...secondaryMapView}
        attributionControl={false}
        cancelPendingTileRequestsWhileZooming={false}
        padding={rightMapPadding}
        mapStyle={mapStyle.secondaryMap}
        interactive={mode !== "overview"}
        style={secondaryMapStyle[mode]}
      >
        <AttributionControl />
      </Map>
    </>
  );
}

export default MainMap;
