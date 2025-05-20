"use client";

import {
  MapLayersContext,
  MapSourcesContext,
  SetMapLayersContext,
  SetMapSourcesContext
} from "@/app/providers/contexts";
import { Block, BlockTitle } from "@/components/custom-ui/Block";
import CustomInput from "@/components/custom-ui/CustomInput";
import CustomSelect from "@/components/custom-ui/CustomSelect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  caculateCollect,
  generateFillLayer,
  generateGeojsonSource,
  generateLineLayer
} from "@/lib/transformUtils";
import { getFieldsFromFeatureCollection } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { FeatureCollection, Point, Polygon } from "geojson";
import { GeoJSONSourceSpecification, MapSourceDataEvent } from "maplibre-gl";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useMap } from "react-map-gl/maplibre";
import { toast } from "sonner";
import { Field } from "../layer-list/layer-configure-com/Labels";
import { aggregateType } from "@/lib/types";

const aggregateArr = ["count", "sum", "average", "min", "max"];

function CollectPanel() {
  const [selectedPointLayerName, setSelectedPointLayerName] = useState("none");
  const [selectedPolygonLayerName, setSelectedPolygonLayerName] =
    useState("none");
  const [outputLayerName, setOutputLayerName] = useState("unnamed");
  const [isSourceLoaded, setIsSourceLoaded] = useState(false);

  const [inField, setInField] = useState("none");
  const [outField, setOutField] = useState("");

  const [aggregate, setAggregate] = useState<aggregateType>("count");

  const mapSources = useContext(MapSourcesContext);
  const mapLayers = useContext(MapLayersContext);
  const setMapLayers = useContext(SetMapLayersContext);
  const setMapSources = useContext(SetMapSourcesContext);
  const { mainMap } = useMap();

  const circleLayers = useMemo(() => {
    const filtered = mapLayers.filter((layer) => layer.type === "circle");

    return filtered.map((layer) => layer.id);
  }, [mapLayers]);

  const polygonLayers = useMemo(() => {
    const filtered = mapLayers.filter((layer) => layer.type === "fill");

    return filtered.map((layer) => layer.id);
  }, [mapLayers]);

  const currentSourceBase = useMemo(() => {
    if (selectedPointLayerName === "none") return undefined;
    const currentLayer = mapLayers.find(
      (layer) => layer.id === selectedPointLayerName
    );
    if (!currentLayer) {
      setSelectedPointLayerName("none");
      return undefined;
    }
    return mapSources.find(
      (source) => source.id === currentLayer.source
    ) as GeoJSONSourceSpecification & { id: string };
  }, [mapLayers, mapSources, selectedPointLayerName]);

  const currentSourceOverlay = useMemo(() => {
    if (selectedPolygonLayerName === "none") return undefined;
    const currentLayer = mapLayers.find(
      (layer) => layer.id === selectedPolygonLayerName
    );
    if (!currentLayer) {
      setSelectedPolygonLayerName("none");
      return undefined;
    }
    return mapSources.find(
      (source) => source.id === currentLayer!.source
    ) as GeoJSONSourceSpecification & { id: string };
  }, [mapLayers, mapSources, selectedPolygonLayerName]);

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

  const { data: PolygonlayerData } = useQuery({
    queryKey: [currentSourceOverlay?.id ?? "error"],
    queryFn: async () => {
      if (!isUrlDataOverlay) return currentSourceOverlay?.data;
      const res = await fetch(currentSourceOverlay?.data as string);
      return await res.json();
    }
  });

  const inFields = useMemo(() => {
    if (!data) return ["none"];
    const result = getFieldsFromFeatureCollection(data);
    if (result) return ["none", ...result];
    return ["none"];
  }, [data]);

  const changeSeletedPointLayerName = useCallback((value: string) => {
    setSelectedPointLayerName(value);
  }, []);

  const changeSeletedPolygonLayerName = useCallback((value: string) => {
    setSelectedPolygonLayerName(value);
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

  const generateCollect = useCallback(() => {
    if (!data || !PolygonlayerData) {
      toast.error("data is not loaded yet");
      return;
    }
    if (outField === "") {
      toast.error("out field is null");
      return;
    }

    toast.loading(`generate collect layer for ${selectedPointLayerName}`, {
      id: "collect"
    });

    setTimeout(() => {
      const collect = caculateCollect(
        data as FeatureCollection<Point>,
        PolygonlayerData as FeatureCollection<Polygon>,
        inField,
        outField,
        aggregate
      );
      const newSource = generateGeojsonSource(
        collect,
        `${outputLayerName}-source`
      );

      if (mapSources.find((source) => source.id === newSource.id)) {
        toast.error(`${newSource.id} is already exist`, { id: "collect" });
        return;
      }
      setMapSources((pre) => [...pre, newSource]);
    }, 16);
  }, [
    data,
    PolygonlayerData,
    selectedPointLayerName,
    inField,
    outField,
    aggregate,
    outputLayerName,
    mapSources,
    setMapSources
  ]);

  useEffect(() => {
    if (!data || inField === "none") return;
    const value = (data as FeatureCollection<Point>).features[0].properties![
      inField
    ];
    if (typeof value === "string" && aggregate !== "count") {
      setAggregate("count");
      toast.message(
        'The current field is of string type, so only the "count" aggregation is supported.'
      );
    }
  }, [aggregate, data, inField]);

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
      toast.success("collect success", { id: "collect" });
    }
  }, [isSourceLoaded, mapLayers, newFill, newLine, setMapLayers]);

  const changeInField = useCallback((value: string) => {
    setInField(value);
  }, []);
  const changeOutField = useCallback((value: string) => {
    setOutField(value);
  }, []);
  const changeAggregate = useCallback((value: string) => {
    setAggregate(value as aggregateType);
  }, []);

  return (
    <div className="flex flex-col gap-2 pr-6">
      <Block>
        <BlockTitle>select layer</BlockTitle>
        <div className="flex items-center justify-between">
          <Field>Point</Field>
          <CustomSelect
            initialSelection={selectedPointLayerName ?? ""}
            arr={["none", ...circleLayers]}
            updateSelection={changeSeletedPointLayerName}
          />
        </div>
        <div className="flex items-center justify-between">
          <Field>Polygon</Field>
          <CustomSelect
            initialSelection={selectedPolygonLayerName ?? ""}
            arr={["none", ...polygonLayers]}
            updateSelection={changeSeletedPolygonLayerName}
          />
        </div>
      </Block>
      <Block>
        <BlockTitle>option</BlockTitle>
        <div className="flex items-center justify-between">
          <Field>In Field</Field>
          <CustomSelect
            arr={inFields}
            initialSelection={inField}
            updateSelection={changeInField}
          />
        </div>
        <div className="flex items-center justify-between">
          <Field>Out Field</Field>
          <CustomInput initialValue={outField} updateValue={changeOutField} />
        </div>
        <div className="flex items-center justify-between">
          <Field>Aggregate</Field>
          <CustomSelect
            initialSelection={aggregate}
            updateSelection={changeAggregate}
            arr={aggregateArr}
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
      <Button onClick={generateCollect}>Apply</Button>
    </div>
  );
}

export default CollectPanel;
