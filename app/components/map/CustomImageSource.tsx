"use client";

import { layerBounds } from "@/lib/constants";
import { coordinatesToBound } from "@/lib/utils";
import { useEffect } from "react";
import { ImageSourceSpecification, Source } from "react-map-gl/maplibre";

function CustomImageSource({
  source
}: {
  source: ImageSourceSpecification & { id: string };
}) {
  useEffect(() => {
    const imagebound = coordinatesToBound(source.coordinates) as [
      number,
      number,
      number,
      number
    ];
    layerBounds[source.id] = imagebound;
  }, [source]);

  return <Source {...source} />;
}

export default CustomImageSource;
