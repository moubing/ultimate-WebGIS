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
import { layerBounds } from "@/lib/constants";
import {
  caculateRandomLineString,
  generateGeojsonSource,
  generateLineLayer
} from "@/lib/transformUtils";
import { GeoJSONSourceSpecification, MapSourceDataEvent } from "maplibre-gl";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useMap } from "react-map-gl/maplibre";
import { toast } from "sonner";
import { Field } from "../layer-list/layer-configure-com/Labels";

function RandomLineStringPanel() {
  const [selectedLayerName, setSelectedLayerName] = useState("none");
  const [outputLayerName, setOutputLayerName] = useState("unnamed");
  const [isSourceLoaded, setIsSourceLoaded] = useState(false);

  const [count, setCount] = useState(300);
  const [vertices, setVertices] = useState(10);
  const [maxLength, setMaxLength] = useState(0.0001);
  const [rotation, setRotation] = useState(0.4);

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

  const currentBbox = useMemo(() => {
    if (selectedLayerName === "none") return undefined;
    const currentLayer = mapLayers.find(
      (layer) => layer.id === selectedLayerName
    );
    if (!currentLayer) {
      setSelectedLayerName("none");
      return undefined;
    }
    const currentSource = mapSources.find(
      (source) => source.id === currentLayer!.source
    ) as GeoJSONSourceSpecification & { id: string };

    return layerBounds[currentSource.id];
  }, [mapLayers, mapSources, selectedLayerName]);

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

  const generateRandomLineString = useCallback(() => {
    if (!currentBbox) {
      toast.error("data is not loaded yet");

      return;
    }

    toast.loading(`generate randomLineString layer for ${selectedLayerName}`, {
      id: "randomLineString"
    });
    setTimeout(() => {
      const randomLineString = caculateRandomLineString(
        count,
        currentBbox,
        vertices,
        maxLength,
        rotation
      );
      const newSource = generateGeojsonSource(
        randomLineString,
        `${outputLayerName}-source`
      );

      if (mapSources.find((source) => source.id === newSource.id)) {
        toast.error(`${newSource.id} is already exist`, {
          id: "randomLineString"
        });
        return;
      }
      setMapSources((pre) => [...pre, newSource]);
    }, 16);
  }, [
    currentBbox,
    selectedLayerName,
    count,
    vertices,
    maxLength,
    rotation,
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
      toast.success("randomLineString success", { id: "randomLineString" });
    }
  }, [isSourceLoaded, mapLayers, newLine, setMapLayers]);

  const changeCount = useCallback((value: number) => {
    setCount(value);
  }, []);
  const changeVertices = useCallback((value: number) => {
    setVertices(value);
  }, []);
  const changeMaxLength = useCallback((value: number) => {
    setMaxLength(value);
  }, []);
  const changeRotation = useCallback((value: number) => {
    setRotation(value);
  }, []);

  return (
    <div className="flex flex-col gap-2 pr-6">
      <Block>
        <BlockTitle>select bbox from layer</BlockTitle>
        <CustomSelect
          initialSelection={selectedLayerName ?? ""}
          className="w-full"
          arr={["none", ...linePolygonCircleLayers]}
          updateSelection={changeSeletedLayerName}
        />
        <Field>
          Generate random lineString features within a specified bounding box.
        </Field>
      </Block>

      <Block>
        <BlockTitle>option</BlockTitle>
        <div className="flex items-center justify-between">
          <Field>Count</Field>
          <CustomNumberInput initialValue={count} updateValue={changeCount} />
        </div>
        <div className="flex items-center justify-between">
          <Field>Vertices</Field>
          <CustomNumberInput
            initialValue={vertices}
            updateValue={changeVertices}
          />
        </div>
        <div className="flex items-center justify-between">
          <Field>Max length</Field>
          <CustomNumberInput
            initialValue={maxLength}
            updateValue={changeMaxLength}
          />
        </div>
        <div className="flex items-center justify-between">
          <Field>Max rotation</Field>
          <CustomNumberInput
            initialValue={rotation}
            updateValue={changeRotation}
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
      <Button onClick={generateRandomLineString}>Apply</Button>
    </div>
  );
}

export default RandomLineStringPanel;
