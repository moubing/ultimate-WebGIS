"use client";

import { layerBounds } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { GeoJSONSourceSpecification, Source } from "react-map-gl/maplibre";
import * as turf from "@turf/turf";

function CustomSource({
  source
}: {
  source: GeoJSONSourceSpecification & { id: string };
}) {
  const { data } = useQuery({
    queryKey: [source.id],
    queryFn: async () => {
      if (typeof source.data === "string") {
        const res = await fetch(source.data);
        return await res.json();
      } else {
        return source.data;
      }
    }
  });

  useEffect(() => {
    if (data)
      layerBounds[source.id] = turf.bbox(data) as [
        number,
        number,
        number,
        number
      ];
  }, [data, source]);

  return data && <Source {...source} data={data} />;
}

export default CustomSource;
