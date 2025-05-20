"use client";

import { useControl } from "react-map-gl/maplibre";
import { MapboxOverlay } from "@deck.gl/mapbox";
import { DeckProps } from "@deck.gl/core";
import { useContext, useEffect } from "react";
import { SetDeckOverlayContext } from "@/app/providers/contexts";

function DeckGLOverlay(props: DeckProps) {
  const deckOverlay = useControl<MapboxOverlay>(
    () => new MapboxOverlay({ ...props, interleaved: true })
  );
  deckOverlay.setProps(props);

  const setDeck = useContext(SetDeckOverlayContext);
  useEffect(() => {
    setDeck(deckOverlay);
  }, [deckOverlay, setDeck]);

  return null;
}

export default DeckGLOverlay;
