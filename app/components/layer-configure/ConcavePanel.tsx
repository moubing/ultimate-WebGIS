"use client";

import {
  MapLayersContext,
  MapSourcesContext,
  SetMapLayersContext,
  SetMapSourcesContext
} from "@/app/providers/contexts";
import { Block, BlockTitle } from "@/components/custom-ui/Block";
import CustomSelect from "@/components/custom-ui/CustomSelect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  caculateConcave,
  generateFillLayer,
  generateGeojsonSource,
  generateLineLayer
} from "@/lib/transformUtils";
import { useQuery } from "@tanstack/react-query";
import { FeatureCollection, Point } from "geojson";
import { GeoJSONSourceSpecification, MapSourceDataEvent } from "maplibre-gl";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useMap } from "react-map-gl/maplibre";
import { toast } from "sonner";
import { Field } from "../layer-list/layer-configure-com/Labels";
import * as turf from "@turf/turf";
import CustomNumberInput from "@/components/custom-ui/CustomNumberInput";
import { unitArr } from "@/lib/constants";

function ConcavePanel() {
  const [selectedLayerName, setSelectedLayerName] = useState("none");
  const [outputLayerName, setOutputLayerName] = useState("unnamed");
  const [isSourceLoaded, setIsSourceLoaded] = useState(false);

  const [maxEdge, setMaxEdge] = useState(200);
  const [unit, setUnit] = useState<turf.Units>("meters");

  const mapSources = useContext(MapSourcesContext);
  const mapLayers = useContext(MapLayersContext);
  const setMapLayers = useContext(SetMapLayersContext);
  const setMapSources = useContext(SetMapSourcesContext);
  const { mainMap } = useMap();

  const circleLayers = useMemo(() => {
    const filtered = mapLayers.filter((layer) => layer.type === "circle");

    return filtered.map((layer) => layer.id);
  }, [mapLayers]);

  const currentSource = useMemo(() => {
    if (selectedLayerName === "none") return undefined;
    const currentLayer = mapLayers.find(
      (layer) => layer.id === selectedLayerName
    );
    if (!currentLayer) {
      setSelectedLayerName("none");
      return undefined;
    }
    return mapSources.find(
      (source) => source.id === currentLayer!.source
    ) as GeoJSONSourceSpecification & { id: string };
  }, [mapLayers, mapSources, selectedLayerName]);

  const isUrlData = useMemo(() => {
    if (!currentSource) return false;
    if (typeof currentSource?.data === "string") return true;
    return false;
  }, [currentSource]);

  const { data } = useQuery({
    queryKey: [currentSource?.id ?? "error"],
    queryFn: async () => {
      if (!isUrlData) return currentSource?.data;
      const res = await fetch(currentSource?.data as string);
      return await res.json();
    }
  });

  const changeSeletedLayerName = useCallback((value: string) => {
    setSelectedLayerName(value);
  }, []);

  const newSourceId = useMemo(
    () => `${outputLayerName}-source`,
    [outputLayerName]
  );

  const newFill = useMemo(
    () =>
      generateFillLayer(`${outputLayerName}-source`, `${outputLayerName}-fill`),
    [outputLayerName]
  );

  const newLine = useMemo(
    () =>
      generateLineLayer(`${outputLayerName}-source`, `${outputLayerName}-line`),
    [outputLayerName]
  );

  const generateConcave = useCallback(() => {
    if (!data) {
      toast.error("data is not loaded yet");
      return;
    }
    toast.loading(`generate concave layer for ${selectedLayerName}`, {
      id: "concave"
    });

    setTimeout(() => {
      const concave = caculateConcave(
        data as FeatureCollection<Point>,
        maxEdge,
        unit
      );
      if (concave.features.length === 0) {
        toast.error(`unable to compute hull for ${selectedLayerName}`, {
          id: "concave"
        });
        return;
      }
      const newSource = generateGeojsonSource(
        concave,
        `${outputLayerName}-source`
      );

      if (mapSources.find((source) => source.id === newSource.id)) {
        toast.error(`${newSource.id} is already exist`, { id: "concave" });
        return;
      }
      setMapSources((pre) => [...pre, newSource]);
    }, 16);
  }, [
    data,
    selectedLayerName,
    maxEdge,
    unit,
    outputLayerName,
    mapSources,
    setMapSources
  ]);

  useEffect(() => {
    if (!mainMap) return;

    const handleSourceLoaded = (e: MapSourceDataEvent) => {
      if (
        e.sourceId === newSourceId &&
        e.isSourceLoaded &&
        e.sourceDataType === "idle"
      ) {
        setIsSourceLoaded(true);
      }
    };

    mainMap?.getMap().on("sourcedata", handleSourceLoaded);

    return () => {
      mainMap.getMap().off("sourcedata", handleSourceLoaded);
    };
  }, [newSourceId, mainMap]);

  useEffect(() => {
    if (isSourceLoaded) {
      if (
        mapLayers.find(
          (layer) => layer.id === newFill.id || layer.id === newLine.id
        )
      ) {
        return;
      }
      setMapLayers((pre) => [...pre, newFill, newLine]);
      setIsSourceLoaded(false);
      toast.success("concave success", { id: "concave" });
    }
  }, [isSourceLoaded, mapLayers, newFill, newLine, setMapLayers]);

  const changeMaxEdge = useCallback((value: number) => {
    setMaxEdge(value);
  }, []);

  const changeUnit = useCallback((value: string) => {
    setUnit(value as turf.Units);
  }, []);

  return (
    <div className="flex flex-col gap-2 pr-6">
      <Block>
        <BlockTitle>select layer</BlockTitle>
        <CustomSelect
          initialSelection={selectedLayerName ?? ""}
          className="w-full"
          arr={["none", ...circleLayers]}
          updateSelection={changeSeletedLayerName}
        />
        <Field>
          Generate a concave hull (a tight-fitting polygon) around a set of
          Point features.
        </Field>
      </Block>
      <Block>
        <BlockTitle>option</BlockTitle>
        <div className="flex items-center justify-between">
          <Field>Max edge</Field>
          <CustomNumberInput
            initialValue={maxEdge}
            updateValue={changeMaxEdge}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          <span className="text-pink-500">
            if value is zero, the method will use Infinite.
          </span>
        </p>
        <div className="flex items-center justify-between">
          <Field>Unit</Field>
          <CustomSelect
            arr={unitArr}
            initialSelection={unit}
            updateSelection={changeUnit}
          />
        </div>
      </Block>
      <Block>
        <BlockTitle>output</BlockTitle>

        <Input
          className="w-full"
          type="text"
          value={outputLayerName}
          onChange={(e) => setOutputLayerName(e.target.value)}
        />
        <Field>output layer name</Field>
      </Block>
      <Button onClick={generateConcave}>Apply</Button>
    </div>
  );
}

export default ConcavePanel;
