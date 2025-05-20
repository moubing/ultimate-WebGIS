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
import { gridArr, unitArr } from "@/lib/constants";
import {
  caculateInterpolate,
  generateCircleLayer,
  generateFillLayer,
  generateGeojsonSource,
  generateLineLayer
} from "@/lib/transformUtils";
import { grid } from "@/lib/types";
import { getFieldsFromFeatureCollection } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import * as turf from "@turf/turf";
import { FeatureCollection, Point } from "geojson";
import { GeoJSONSourceSpecification, MapSourceDataEvent } from "maplibre-gl";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useMap } from "react-map-gl/maplibre";
import { toast } from "sonner";
import { Field } from "../layer-list/layer-configure-com/Labels";

function InterpolatePanel() {
  const [selectedLayerName, setSelectedLayerName] = useState("none");
  const [outputLayerName, setOutputLayerName] = useState("unnamed");
  const [isSourceLoaded, setIsSourceLoaded] = useState(false);

  const [cellSize, setCellSize] = useState(200);
  const [gridType, setGridType] = useState<grid>("square");
  const [property, setProperty] = useState("none");
  const [unit, setUnit] = useState<turf.Units>("meters");
  const [weight, setWeight] = useState(1);

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

  const fields = useMemo(() => {
    if (!data) return ["none"];
    const result = getFieldsFromFeatureCollection(data);
    if (result) return ["none", ...result];
    return ["none"];
  }, [data]);

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

  const generateInterpolate = useCallback(() => {
    if (!data) {
      toast.error("data is not loaded yet");
      return;
    }

    if (property === "none") {
      toast.error("please select a property to interpolate");

      return;
    }

    toast.loading(`generate interpolate layer for ${selectedLayerName}`, {
      id: "interpolate"
    });

    setTimeout(() => {
      const interpolate = caculateInterpolate(
        data as FeatureCollection<Point>,
        cellSize,
        gridType,
        property,
        unit,
        weight
      );
      const newSource = generateGeojsonSource(
        interpolate,
        `${outputLayerName}-source`
      );

      if (mapSources.find((source) => source.id === newSource.id)) {
        toast.error(`${newSource.id} is already exist`, { id: "interpolate" });
        return;
      }
      setMapSources((pre) => [...pre, newSource]);
    }, 16);
  }, [
    data,
    selectedLayerName,
    cellSize,
    gridType,
    property,
    unit,
    weight,
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
          (layer) =>
            layer.id === newFill.id ||
            layer.id === newLine.id ||
            layer.id === newCircle.id
        )
      ) {
        return;
      }

      if (gridType === "point") {
        setMapLayers((pre) => [...pre, newCircle]);
      } else {
        setMapLayers((pre) => [...pre, newFill, newLine]);
      }
      setIsSourceLoaded(false);
      toast.success("interpolate success", { id: "interpolate" });
    }
  }, [
    gridType,
    isSourceLoaded,
    mapLayers,
    newCircle,
    newFill,
    newLine,
    setMapLayers
  ]);

  const changeCellSize = useCallback((value: number) => {
    setCellSize(value);
  }, []);
  const changeGridType = useCallback((value: string) => {
    setGridType(value as grid);
  }, []);
  const changeProperty = useCallback((value: string) => {
    setProperty(value);
  }, []);
  const changeUnit = useCallback((value: string) => {
    setUnit(value as turf.Units);
  }, []);
  const changeWeight = useCallback((value: number) => {
    setWeight(value);
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
          Generate a grid of interpolated values (e.g., temperature, elevation).
        </Field>
      </Block>
      <Block>
        <BlockTitle>option</BlockTitle>
        <div className="flex items-center justify-between">
          <Field>Cell size</Field>
          <CustomNumberInput
            initialValue={cellSize}
            updateValue={changeCellSize}
          />
        </div>
        <div className="flex items-center justify-between">
          <Field>Grid type</Field>
          <CustomSelect
            arr={gridArr}
            initialSelection={gridType}
            updateSelection={changeGridType}
          />
        </div>
        <div className="flex items-center justify-between">
          <Field>Property</Field>
          <CustomSelect
            arr={fields}
            initialSelection={property}
            updateSelection={changeProperty}
          />
        </div>
        <div className="flex items-center justify-between">
          <Field>Unit</Field>
          <CustomSelect
            arr={unitArr}
            initialSelection={unit}
            updateSelection={changeUnit}
          />
        </div>
        <div className="flex items-center justify-between">
          <Field>Weight</Field>
          <CustomNumberInput initialValue={weight} updateValue={changeWeight} />
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
      <Button onClick={generateInterpolate}>Apply</Button>
    </div>
  );
}

export default InterpolatePanel;
