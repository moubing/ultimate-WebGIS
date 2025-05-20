"use client";

import {
  MapLayersContext,
  MapSourcesContext,
  SetMapLayersContext,
  SetMapSourcesContext
} from "@/app/providers/contexts";
import { Block, BlockTitle } from "@/components/custom-ui/Block";
import CustomNumberInput from "@/components/custom-ui/CustomNumberInput";
import CustomSelect from "@/components/custom-ui/CustomSelect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  caculateSample,
  generateCircleLayer,
  generateFillLayer,
  generateGeojsonSource,
  generateLineLayer
} from "@/lib/transformUtils";
import { useQuery } from "@tanstack/react-query";
import { FeatureCollection } from "geojson";
import { GeoJSONSourceSpecification, MapSourceDataEvent } from "maplibre-gl";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useMap } from "react-map-gl/maplibre";
import { toast } from "sonner";
import { Field } from "../layer-list/layer-configure-com/Labels";

function SamplePanel() {
  const [selectedLayerName, setSelectedLayerName] = useState("none");
  const [outputLayerName, setOutputLayerName] = useState("unnamed");
  const [isSourceLoaded, setIsSourceLoaded] = useState(false);

  const mapSources = useContext(MapSourcesContext);
  const mapLayers = useContext(MapLayersContext);
  const setMapLayers = useContext(SetMapLayersContext);
  const setMapSources = useContext(SetMapSourcesContext);
  const { mainMap } = useMap();

  const linePolygonCircleLayers = useMemo(() => {
    const filtered = mapLayers.filter(
      (layer) =>
        layer.type === "fill" ||
        layer.type === "line" ||
        layer.type === "circle"
    );

    return filtered.map((layer) => layer.id);
  }, [mapLayers]);

  const currentType = useMemo(() => {
    if (selectedLayerName === "none") return undefined;
    const currentLayer = mapLayers.find(
      (layer) => layer.id === selectedLayerName
    );
    return currentLayer!.type;
  }, [mapLayers, selectedLayerName]);

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

  const [count, setCount] = useState(10);
  const maxCount = useMemo(() => {
    if (!data) return undefined;
    return (data as FeatureCollection).features.length;
  }, [data]);

  useEffect(() => {
    if (!maxCount) return;
    if (maxCount < count) {
      setCount(maxCount);
    }
  }, [count, maxCount]);

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

  const newCircle = useMemo(
    () =>
      generateCircleLayer(
        `${outputLayerName}-source`,
        `${outputLayerName}-circle`
      ),
    [outputLayerName]
  );

  const generateBounding = useCallback(() => {
    if (!data) {
      toast.error("data is not loaded yet");
      return;
    }

    toast.loading(`generate sample layer for ${selectedLayerName}`, {
      id: "sample"
    });
    setTimeout(() => {
      const sample = caculateSample(data as FeatureCollection, count);
      const newSource = generateGeojsonSource(
        sample,
        `${outputLayerName}-source`
      );

      if (mapSources.find((source) => source.id === newSource.id)) {
        toast.error(`${newSource.id} is already exist`, { id: "sample" });
        return;
      }

      setMapSources((pre) => [...pre, newSource]);
    }, 16);
  }, [
    data,
    selectedLayerName,
    count,
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

      if (currentType === "fill") {
        setMapLayers((pre) => [...pre, newFill, newLine]);
      } else if (currentType === "line") {
        setMapLayers((pre) => [...pre, newLine]);
      } else if (currentType === "circle") {
        setMapLayers((pre) => [...pre, newCircle]);
      }
      setIsSourceLoaded(false);
      toast.success("sample success", { id: "sample" });
    }
  }, [
    currentType,
    isSourceLoaded,
    mapLayers,
    newCircle,
    newFill,
    newLine,
    setMapLayers
  ]);

  const changeCount = useCallback((value: number) => {
    setCount(value);
  }, []);

  return (
    <div className="flex flex-col gap-2 pr-6">
      <Block>
        <BlockTitle>select layer</BlockTitle>
        <CustomSelect
          initialSelection={selectedLayerName ?? ""}
          className="w-full"
          arr={["none", ...linePolygonCircleLayers]}
          updateSelection={changeSeletedLayerName}
        />
        <Field>Create boxes around each feature of selected layer.</Field>
      </Block>
      <Block>
        <BlockTitle>option</BlockTitle>
        <div className="flex items-center justify-between">
          <Field>Count</Field>
          <CustomNumberInput
            max={maxCount}
            initialValue={count}
            updateValue={changeCount}
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
      <Button onClick={generateBounding}>Apply</Button>
    </div>
  );
}

export default SamplePanel;
