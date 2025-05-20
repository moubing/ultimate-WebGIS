"use client";

import {
  DeckLayersContext,
  SetDeckLayersContext,
} from "@/app/providers/contexts";
import { Slider } from "@/components/ui/slider";
import { DeckLayer } from "@/lib/types";
import { ArcLayer } from "@deck.gl/layers";
import { useContext, useState } from "react";

function ArcLayerConfigure({ layer }: { layer?: DeckLayer }) {
  const deckLayers = useContext(DeckLayersContext);
  const setDeckLayers = useContext(SetDeckLayersContext);
  const [height, setHeight] = useState(1);
  const [width, setWidth] = useState(12);

  return (
    <div className="flex flex-col gap-2 w-full">
      <h1>height: {height}</h1>
      <Slider
        value={[height]}
        min={1}
        max={200}
        className="w-full"
        onValueChange={(value: number[]) => {
          setHeight(value[0]);
          setDeckLayers(
            deckLayers.map((deckLayer) => {
              if (layer && layer.id === deckLayer.id) {
                const newLayer = new ArcLayer({
                  ...layer.props,
                  data: layer.props.data,
                  getHeight: value[0],
                });
                return newLayer;
              }
              return deckLayer;
            })
          );
        }}
      />
      <h1>width: {width}</h1>

      <Slider
        value={[width]}
        min={1}
        max={100}
        className="w-full"
        onValueChange={(value) => {
          setWidth(value[0]);
          setDeckLayers(
            deckLayers.map((deckLayer) => {
              if (layer && layer.id === deckLayer.id) {
                const newLayer = new ArcLayer({
                  ...layer.props,
                  data: layer.props.data,
                  getWidth: value[0],
                });
                return newLayer;
              }
              return deckLayer;
            })
          );
        }}
      />
    </div>
  );
}

export default ArcLayerConfigure;
