"use client";

import {
  MapLayersContext,
  MapSourcesContext,
  SetMapLayersContext,
  SetMapSourcesContext
} from "@/app/providers/contexts";
import { Block, BlockTitle } from "@/components/custom-ui/Block";
import CustomInput from "@/components/custom-ui/CustomInput";
import CustomNumberInput from "@/components/custom-ui/CustomNumberInput";
import CustomSelect from "@/components/custom-ui/CustomSelect";
import { Button } from "@/components/ui/button";
import {
  caculateBuffer,
  generateFillLayer,
  generateGeojsonSource,
  generateLineLayer
} from "@/lib/transformUtils";
import { useQuery } from "@tanstack/react-query";
import * as turf from "@turf/turf";
import { FeatureCollection } from "geojson";
import { GeoJSONSourceSpecification, MapSourceDataEvent } from "maplibre-gl";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useMap } from "react-map-gl/maplibre";
import { toast } from "sonner";
import { Field } from "../layer-list/layer-configure-com/Labels";
import { unitArr } from "@/lib/constants";

type directionType = "inside" | "outside";
// 单位类型定义
const directionArr = ["inside", "outside"];

function BufferPanel() {
  const [selectedLayerName, setSelectedLayerName] = useState("none");
  const [outputLayerName, setOutputLayerName] = useState("unnamed");
  const [direction, setDirection] = useState<directionType>("outside");
  const [radius, setRadius] = useState(10);
  const [unit, setUnit] = useState<turf.Units>("meters");
  const [steps, setSteps] = useState(10);

  const [isSourceLoaded, setIsSourceLoaded] = useState(false);

  const mapSources = useContext(MapSourcesContext);
  const mapLayers = useContext(MapLayersContext);
  const setMapLayers = useContext(SetMapLayersContext);
  const setMapSources = useContext(SetMapSourcesContext);
  const { mainMap } = useMap();

  const pointLinePolygonLayers = useMemo(() => {
    const filtered = mapLayers.filter(
      (layer) =>
        layer.type === "fill" ||
        layer.type === "line" ||
        layer.type === "circle"
    );

    return filtered.map((layer) => layer.id);
  }, [mapLayers]);

  const curentSource = useMemo(() => {
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
    if (!curentSource) return false;
    if (typeof curentSource?.data === "string") return true;
    return false;
  }, [curentSource]);

  const { data } = useQuery({
    queryKey: [curentSource?.id ?? "error"],
    queryFn: async () => {
      if (!isUrlData) return curentSource?.data;
      const res = await fetch(curentSource?.data as string);
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

  const generateBuffer = useCallback(() => {
    if (!data) {
      toast.error("data is not loaded yet");
      return;
    }

    toast.loading(`generate buffer layer for ${selectedLayerName}`, {
      id: "buffer"
    });

    setTimeout(() => {
      const buffer = caculateBuffer(
        data as FeatureCollection,
        radius,
        steps,
        unit,
        direction
      );
      const newSource = generateGeojsonSource(buffer, newSourceId);

      if (mapSources.find((source) => source.id === newSource.id)) {
        toast.error(`${newSource.id} is already exist`, { id: "buffer" });
        return;
      }

      setMapSources((pre) => [...pre, newSource]);
    }, 16);
  }, [
    data,
    selectedLayerName,
    radius,
    steps,
    unit,
    direction,
    newSourceId,
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
  }, [mainMap, newSourceId]);

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
      toast.success("buffer success", { id: "buffer" });
    }
  }, [isSourceLoaded, mapLayers, newFill, newLine, setMapLayers]);

  const changeDirection = useCallback((value: string) => {
    setDirection(value as directionType);
  }, []);

  const changeRadius = useCallback((value: number) => {
    setRadius(value);
  }, []);

  const changeUnit = useCallback((value: string) => {
    setUnit(value as turf.Units);
  }, []);

  const changeSteps = useCallback((value: number) => {
    setSteps(value);
  }, []);

  const changeOutputLayerName = useCallback((value: string) => {
    setOutputLayerName(value);
  }, []);

  return (
    <div className="flex flex-col gap-2 pr-6">
      <Block>
        <BlockTitle>select layer</BlockTitle>
        <CustomSelect
          initialSelection={selectedLayerName ?? ""}
          className="w-full"
          arr={["none", ...pointLinePolygonLayers]}
          updateSelection={changeSeletedLayerName}
        />
        <Field>Create buffer around each feature of selected layer.</Field>
      </Block>
      <Block>
        <BlockTitle>option</BlockTitle>

        <div className="flex items-center justify-between">
          <Field>Direction</Field>
          <CustomSelect
            initialSelection={direction}
            arr={directionArr}
            updateSelection={changeDirection}
          />
        </div>
        <div className="flex items-center justify-between">
          <Field>Radius</Field>
          <CustomNumberInput initialValue={radius} updateValue={changeRadius} />
        </div>
        <div className="flex items-center justify-between">
          <Field>Unit</Field>
          <CustomSelect
            initialSelection={unit}
            arr={unitArr}
            updateSelection={changeUnit}
          />
        </div>
        <div className="flex items-center justify-between">
          <Field>Steps</Field>
          <CustomNumberInput initialValue={steps} updateValue={changeSteps} />
        </div>
      </Block>
      <Block>
        <BlockTitle>output</BlockTitle>

        <CustomInput
          initialValue={outputLayerName}
          updateValue={changeOutputLayerName}
          className="w-full"
        />
        <Field>output layer name</Field>
      </Block>
      <Button onClick={generateBuffer}>Apply</Button>
    </div>
  );
}

export default BufferPanel;
