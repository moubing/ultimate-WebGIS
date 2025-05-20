"use client";

import {
  MapLayersContext,
  MapSourcesContext,
  SetMapLayersContext,
  SetMapSourcesContext
} from "@/app/providers/contexts";
import { Block, BlockTitle } from "@/components/custom-ui/Block";
import CustomSelect from "@/components/custom-ui/CustomSelect";
import CustomSlider from "@/components/custom-ui/CustomSlider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  caculateBezierSpline,
  generateGeojsonSource,
  generateLineLayer
} from "@/lib/transformUtils";
import { useQuery } from "@tanstack/react-query";
import { FeatureCollection, LineString } from "geojson";
import { GeoJSONSourceSpecification, MapSourceDataEvent } from "maplibre-gl";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useMap } from "react-map-gl/maplibre";
import { toast } from "sonner";
import { Field } from "../layer-list/layer-configure-com/Labels";

function BezierSplinePanel() {
  const [selectedLayerName, setSelectedLayerName] = useState("none");
  const [outputLayerName, setOutputLayerName] = useState("unnamed");
  const [sharpness, setSharpness] = useState(0.85);
  const [isSourceLoaded, setIsSourceLoaded] = useState(false);

  const mapSources = useContext(MapSourcesContext);
  const mapLayers = useContext(MapLayersContext);
  const setMapLayers = useContext(SetMapLayersContext);
  const setMapSources = useContext(SetMapSourcesContext);
  const { mainMap } = useMap();

  const lineLayers = useMemo(() => {
    const filtered = mapLayers.filter((layer) => layer.type === "line");

    return filtered.map((layer) => layer.id);
  }, [mapLayers]);

  const currentSource = useMemo(() => {
    if (selectedLayerName === "none") return undefined;
    const currentLayer = mapLayers.find(
      (layer) => layer.id === selectedLayerName
    );
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

  const newLine = useMemo(
    () =>
      generateLineLayer(`${outputLayerName}-source`, `${outputLayerName}-line`),
    [outputLayerName]
  );

  const generateBezierSpline = useCallback(() => {
    if (!data) {
      toast.error("data is not loaded yet");
      return;
    }

    toast.loading(`generate bezierSpline layer for ${selectedLayerName}`, {
      id: "bezierSpline"
    });

    setTimeout(() => {
      const bezierSpline = caculateBezierSpline(
        data as FeatureCollection<LineString>,
        sharpness
      );
      const newSource = generateGeojsonSource(
        bezierSpline,
        `${outputLayerName}-source`
      );

      if (mapSources.find((source) => source.id === newSource.id)) {
        toast.error(`${newSource.id} is already exist`, { id: "bezierSpline" });
        return;
      }
      setMapSources((pre) => [...pre, newSource]);
    }, 16);
  }, [
    data,
    selectedLayerName,
    sharpness,
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
      if (mapLayers.find((layer) => layer.id === newLine.id)) {
        return;
      }
      setMapLayers((pre) => [...pre, newLine]);
      setIsSourceLoaded(false);
      toast.success("bezierSpline success", { id: "bezierSpline" });
    }
  }, [isSourceLoaded, mapLayers, newLine, setMapLayers]);

  const changeSharpness = useCallback((value: number) => {
    setSharpness(value);
  }, []);

  return (
    <div className="flex flex-col gap-2 pr-6">
      <Block>
        <BlockTitle>select layer</BlockTitle>
        <CustomSelect
          initialSelection={selectedLayerName ?? ""}
          className="w-full"
          arr={["none", ...lineLayers]}
          updateSelection={changeSeletedLayerName}
        />
        <Field>Create boxes around each feature of selected layer.</Field>
      </Block>
      <Block>
        <BlockTitle>option</BlockTitle>
        <div className="flex items-center justify-between">
          <Field>Sharpness</Field>
          <CustomSlider
            initialOpacity={sharpness}
            min={0.1}
            max={2}
            step={0.01}
            updateOpacity={changeSharpness}
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
      <Button onClick={generateBezierSpline}>Apply</Button>
    </div>
  );
}

export default BezierSplinePanel;
