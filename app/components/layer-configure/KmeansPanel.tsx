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
  caculateKmeans,
  generateCircleLayer,
  generateGeojsonSource
} from "@/lib/transformUtils";
import { useQuery } from "@tanstack/react-query";
import { FeatureCollection, Point } from "geojson";
import { GeoJSONSourceSpecification, MapSourceDataEvent } from "maplibre-gl";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useMap } from "react-map-gl/maplibre";
import { toast } from "sonner";
import { Field } from "../layer-list/layer-configure-com/Labels";

function KmeansPanel() {
  const [selectedLayerName, setSelectedLayerName] = useState("none");
  const [outputLayerName, setOutputLayerName] = useState("unnamed");
  const [isSourceLoaded, setIsSourceLoaded] = useState(false);
  const [numberOfClusters, setNumberOfClusters] = useState(0);

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

  const newCircle = useMemo(
    () =>
      generateCircleLayer(
        `${outputLayerName}-source`,
        `${outputLayerName}-circle`
      ),
    [outputLayerName]
  );

  const generateKmeans = useCallback(() => {
    if (!data) {
      toast.error("data is not loaded yet");
      return;
    }

    toast.loading(`generate kmeans layer for ${selectedLayerName}`, {
      id: "kmeans"
    });

    setTimeout(() => {
      const kmeans = caculateKmeans(
        data as FeatureCollection<Point>,
        numberOfClusters
      );
      const newSource = generateGeojsonSource(
        kmeans,
        `${outputLayerName}-source`
      );

      if (mapSources.find((source) => source.id === newSource.id)) {
        toast.error(`${newSource.id} is already exist`, { id: "kmeans" });
        return;
      }
      setMapSources((pre) => [...pre, newSource]);
    }, 16);
  }, [
    data,
    selectedLayerName,
    numberOfClusters,
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
      if (mapLayers.find((layer) => layer.id === newCircle.id)) {
        return;
      }
      setMapLayers((pre) => [...pre, newCircle]);
      setIsSourceLoaded(false);
      toast.success("kmeans success", { id: "kmeans" });
    }
  }, [isSourceLoaded, mapLayers, newCircle, setMapLayers]);

  const changeNumberOfCluster = useCallback((value: number) => {
    setNumberOfClusters(value);
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
          Group Point features into clusters using the K-means algorithm.
        </Field>
      </Block>
      <Block>
        <BlockTitle>option</BlockTitle>
        <Field>Number of Clusters</Field>
        <CustomNumberInput
          className="w-full"
          initialValue={numberOfClusters}
          updateValue={changeNumberOfCluster}
        />
        <p className="text-sm text-muted-foreground">
          Predefined number of clusters.{" "}
          <span className="text-pink-500">
            if value is zero, the method will use Math.sqrt(numberOfPoints/2).{" "}
          </span>
        </p>
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
      <Button onClick={generateKmeans}>Apply</Button>
    </div>
  );
}

export default KmeansPanel;
