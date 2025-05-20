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
  caculateTag,
  generateCircleLayer,
  generateGeojsonSource
} from "@/lib/transformUtils";
import { getFieldsFromFeatureCollection } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { FeatureCollection, MultiPolygon, Point, Polygon } from "geojson";
import { GeoJSONSourceSpecification, MapSourceDataEvent } from "maplibre-gl";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useMap } from "react-map-gl/maplibre";
import { toast } from "sonner";
import { Field } from "../layer-list/layer-configure-com/Labels";

function TagPanel() {
  const [selectedPointLayerName, setSelectedPointLayerName] = useState("none");
  const [selectedPolygonLayerName, setSelectedPolygonLayerName] =
    useState("none");
  const [outputLayerName, setOutputLayerName] = useState("unnamed");
  const [isSourceLoaded, setIsSourceLoaded] = useState(false);

  const [inField, setInField] = useState("none");
  const [outField, setOutField] = useState("");

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
    if (!PolygonlayerData) return ["none"];
    const result = getFieldsFromFeatureCollection(PolygonlayerData);
    if (result) return ["none", ...result];
    return ["none"];
  }, [PolygonlayerData]);

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

  const newCircle = useMemo(
    () =>
      generateCircleLayer(
        `${outputLayerName}-source`,
        `${outputLayerName}-circle`
      ),
    [outputLayerName]
  );

  const generateTag = useCallback(() => {
    if (!data || !PolygonlayerData) {
      toast.error("data is not loaded yet");
      return;
    }

    if (outField === "") {
      toast.error("out field is null");
      return;
    }

    toast.loading(`generate tag layer for ${selectedPointLayerName}`, {
      id: "tag"
    });

    setTimeout(() => {
      const tag = caculateTag(
        data as FeatureCollection<Point>,
        PolygonlayerData as FeatureCollection<MultiPolygon | Polygon>,
        inField,
        outField
      );
      const newSource = generateGeojsonSource(tag, `${outputLayerName}-source`);

      if (mapSources.find((source) => source.id === newSource.id)) {
        toast.error(`${newSource.id} is already exist`, { id: "tag" });
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
      toast.success("tag success", { id: "tag" });
    }
  }, [isSourceLoaded, mapLayers, newCircle, setMapLayers]);

  const changeInField = useCallback((value: string) => {
    setInField(value);
  }, []);
  const changeOutField = useCallback((value: string) => {
    setOutField(value);
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
      <Button onClick={generateTag}>Apply</Button>
    </div>
  );
}

export default TagPanel;
