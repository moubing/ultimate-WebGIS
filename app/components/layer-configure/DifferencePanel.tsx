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
  caculateDifference,
  generateFillLayer,
  generateGeojsonSource,
  generateLineLayer
} from "@/lib/transformUtils";
import { useQuery } from "@tanstack/react-query";
import { FeatureCollection, MultiPolygon, Polygon } from "geojson";
import { GeoJSONSourceSpecification, MapSourceDataEvent } from "maplibre-gl";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useMap } from "react-map-gl/maplibre";
import { toast } from "sonner";
import { Field } from "../layer-list/layer-configure-com/Labels";

function DifferencePanel() {
  const [selectedBaseLayerName, setSelectedBaseLayerName] = useState("none");
  const [selectedOverlayLayerName, setSelectedOverlayLayerName] =
    useState("none");
  const [outputLayerName, setOutputLayerName] = useState("unnamed");
  const [isSourceLoaded, setIsSourceLoaded] = useState(false);

  const mapSources = useContext(MapSourcesContext);
  const mapLayers = useContext(MapLayersContext);
  const setMapLayers = useContext(SetMapLayersContext);
  const setMapSources = useContext(SetMapSourcesContext);
  const { mainMap } = useMap();

  const polygonLayers = useMemo(() => {
    const filtered = mapLayers.filter((layer) => layer.type === "fill");

    return filtered.map((layer) => layer.id);
  }, [mapLayers]);

  const currentSourceBase = useMemo(() => {
    if (selectedBaseLayerName === "none") return undefined;
    const currentLayer = mapLayers.find(
      (layer) => layer.id === selectedBaseLayerName
    );
    if (!currentLayer) {
      setSelectedBaseLayerName("none");
      return undefined;
    }
    return mapSources.find(
      (source) => source.id === currentLayer!.source
    ) as GeoJSONSourceSpecification & { id: string };
  }, [mapLayers, mapSources, selectedBaseLayerName]);

  const currentSourceOverlay = useMemo(() => {
    if (selectedOverlayLayerName === "none") return undefined;
    const currentLayer = mapLayers.find(
      (layer) => layer.id === selectedOverlayLayerName
    );
    if (!currentLayer) {
      setSelectedOverlayLayerName("none");
      return undefined;
    }
    return mapSources.find(
      (source) => source.id === currentLayer!.source
    ) as GeoJSONSourceSpecification & { id: string };
  }, [mapLayers, mapSources, selectedOverlayLayerName]);

  const isUrlDataBase = useMemo(() => {
    if (!currentSourceBase) return false;
    if (typeof currentSourceBase?.data === "string") return true;
    return false;
  }, [currentSourceBase]);

  const { data } = useQuery({
    queryKey: [currentSourceBase?.id ?? "error"],
    queryFn: async () => {
      if (!isUrlDataBase) return currentSourceBase?.data;
      const res = await fetch(currentSourceBase?.data as string);
      return await res.json();
    }
  });

  const isUrlDataOverlay = useMemo(() => {
    if (!currentSourceOverlay) return false;
    if (typeof currentSourceOverlay?.data === "string") return true;
    return false;
  }, [currentSourceOverlay]);

  const { data: overlayerData } = useQuery({
    queryKey: [currentSourceOverlay?.id ?? "error"],
    queryFn: async () => {
      if (!isUrlDataOverlay) return currentSourceOverlay?.data;
      const res = await fetch(currentSourceOverlay?.data as string);
      return await res.json();
    }
  });

  const changeSeletedBaseLayerName = useCallback((value: string) => {
    setSelectedBaseLayerName(value);
  }, []);

  const changeSeletedOverlayLayerName = useCallback((value: string) => {
    setSelectedOverlayLayerName(value);
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

  const generateDifference = useCallback(() => {
    if (!data || !overlayerData) {
      toast.error("data is not loaded yet");
      return;
    }

    toast.loading(`generate difference layer for ${selectedBaseLayerName}`, {
      id: "difference"
    });

    setTimeout(() => {
      const difference = caculateDifference(
        data as FeatureCollection<MultiPolygon | Polygon>,
        overlayerData as FeatureCollection<MultiPolygon | Polygon>
      );
      const newSource = generateGeojsonSource(
        difference,
        `${outputLayerName}-source`
      );

      if (mapSources.find((source) => source.id === newSource.id)) {
        toast.error(`${newSource.id} is already exist`, { id: "difference" });
        return;
      }
      setMapSources((pre) => [...pre, newSource]);
    }, 16);
  }, [
    data,
    selectedBaseLayerName,
    overlayerData,
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
      toast.success("difference success", { id: "difference" });
    }
  }, [isSourceLoaded, mapLayers, newFill, newLine, setMapLayers]);

  return (
    <div className="flex flex-col gap-2 pr-6">
      <Block>
        <BlockTitle>select layer</BlockTitle>
        <div className="flex items-center justify-between">
          <Field>Base</Field>
          <CustomSelect
            initialSelection={selectedBaseLayerName ?? ""}
            arr={["none", ...polygonLayers]}
            updateSelection={changeSeletedBaseLayerName}
          />
        </div>
        <div className="flex items-center justify-between">
          <Field>Overlay</Field>
          <CustomSelect
            initialSelection={selectedOverlayLayerName ?? ""}
            arr={["none", ...polygonLayers]}
            updateSelection={changeSeletedOverlayLayerName}
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
      <Button onClick={generateDifference}>Apply</Button>
    </div>
  );
}

export default DifferencePanel;
