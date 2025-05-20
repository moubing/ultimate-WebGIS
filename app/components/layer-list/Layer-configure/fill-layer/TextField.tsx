"use client";

import {
  CurrentLayerContext,
  MapLayersContext,
  MapSourcesContext,
  SetMapLayersContext
} from "@/app/providers/contexts";
import CustomSelect from "@/components/custom-ui/CustomSelect";
import { prefixSymbol } from "@/lib/constants";
import { getFieldsFromFeatureCollection } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
  FillLayerSpecification,
  GeoJSONSourceSpecification,
  SymbolLayerSpecification
} from "maplibre-gl";
import { useCallback, useContext, useMemo } from "react";
import { Field } from "../../layer-configure-com/Labels";

function TextField() {
  const setMapLayers = useContext(SetMapLayersContext);
  const currentLayer = useContext(
    CurrentLayerContext
  ) as FillLayerSpecification;
  const mapLayers = useContext(MapLayersContext);
  const mapSources = useContext(MapSourcesContext);

  const currentSelection = useMemo(() => {
    const symbolLayer = mapLayers.find(
      (layer) => layer.id === prefixSymbol + currentLayer.id
    );

    const value = (symbolLayer as SymbolLayerSpecification)!.layout![
      "text-field"
    ] as [string, string];
    if (!value || typeof value[1] === "undefined") return "none";
    return value[1] as string;
  }, [mapLayers, currentLayer]);

  const currentSource = useMemo(() => {
    return mapSources.find(
      (source) => source.id === currentLayer.source
    ) as GeoJSONSourceSpecification & { id: string };
  }, [mapSources, currentLayer]);

  const isUrlData = useMemo(() => {
    if (!currentSource) return false;
    if (typeof currentSource?.data === "string") return true;
    return false;
  }, [currentSource]);

  const { data } = useQuery({
    queryKey: [currentSource.id],
    queryFn: async () => {
      if (!isUrlData) return currentSource.data;
      const res = await fetch(currentSource.data as string);
      return await res.json();
    }
  });

  const fields = useMemo(() => {
    const result = getFieldsFromFeatureCollection(data);
    if (result) return ["none", ...result];
    return ["none"];
  }, [data]);

  const changeTextField = useCallback(
    (textField: string) => {
      setMapLayers((pre) => {
        return pre.map((layer) => {
          if (prefixSymbol + currentLayer.id === layer.id) {
            return {
              ...layer,
              layout: {
                ...layer.layout,
                "text-field":
                  textField === "none" ? undefined : ["get", textField]
              }
            } as SymbolLayerSpecification;
          }
          return layer;
        });
      });
    },
    [setMapLayers, currentLayer]
  );

  return (
    <div className="flex items-center justify-between">
      <Field>Field</Field>
      <CustomSelect
        arr={fields}
        initialSelection={currentSelection}
        updateSelection={changeTextField}
      />
    </div>
  );
}

export default TextField;
