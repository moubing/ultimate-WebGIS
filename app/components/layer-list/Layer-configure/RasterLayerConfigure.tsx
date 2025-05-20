"use client";

import { CurrentLayerContext } from "@/app/providers/contexts";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { generateGdalInfoApi } from "@/lib/fetchUtils";
import { Band, BandStats, GdalInfoResponse } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { Square } from "ldrs/react";
import "ldrs/react/Square.css";

import { RasterLayerSpecification } from "maplibre-gl";
import { useContext, useEffect, useMemo, useState } from "react";
import Bands from "./raster-layer/Bands";
import Extent from "./raster-layer/Extent";
import Histogram from "./raster-layer/Histogram";
import RasterConfigureTool from "./raster-layer/RasterConfigureTool";
import Stats from "./raster-layer/Stats";
import Contrast from "./raster-layer/Contrast";
import { Header } from "../layer-configure-com/Labels";
import Opacity from "./raster-layer/Opacity";
import Saturation from "./raster-layer/Saturation";

function RasterLayerConfigure() {
  const currentLayer = useContext(
    CurrentLayerContext
  ) as RasterLayerSpecification;

  const url = useMemo(() => {
    return generateGdalInfoApi(currentLayer.source);
  }, [currentLayer.source]);

  const { data, isLoading } = useQuery({
    queryKey: [currentLayer.source, url],
    queryFn: async () => {
      const res = await fetch(url);
      return res.json() as Promise<GdalInfoResponse>;
    }
  });

  const bands = useMemo(() => {
    if (!data) return;
    return data.bands;
  }, [data]);

  const [selectedBand, setSelectedBand] = useState<Band | null>(
    (bands && bands[0]) || null
  );

  useEffect(() => {
    if (!data || !bands) return;
    setSelectedBand(bands[0]);
  }, [bands, data]);

  const currentHistogram = useMemo(() => {
    if (!data || !selectedBand) return;
    return selectedBand.histogram;
  }, [data, selectedBand]);

  const currentStats = useMemo(() => {
    if (!selectedBand) return;
    return {
      min: selectedBand.min,
      max: selectedBand.max,
      mean: selectedBand.mean,
      stdDev: selectedBand.stdDev
    } as BandStats;
  }, [selectedBand]);

  const extent = useMemo(() => {
    if (!data) return;
    return data.cornerCoordinates;
  }, [data]);

  return isLoading ? (
    <div className="h-72 flex items-center justify-center flex-col ">
      <Square
        size="35"
        stroke="5"
        strokeLength="0.25"
        bgOpacity="0.1"
        speed="1.2"
        color="black"
      />
      <h1 className="text-sm text-foreground text-center mt-2">Loading...</h1>
    </div>
  ) : (
    <>
      {data && <RasterConfigureTool data={data} />}
      <ScrollArea className="h-[550px] pr-6">
        <div className="flex flex-col gap-2">
          {bands && selectedBand && (
            <Bands
              bands={bands}
              setSelectedBand={setSelectedBand}
              selectedBand={selectedBand}
            />
          )}
          <Separator />
          {currentHistogram && <Histogram histogram={currentHistogram} />}
          <Separator />
          <div className="flex flex-col gap-2">
            <Header>Styles</Header>
            <Opacity />
            <Contrast />
            <Saturation />
          </div>
          <Separator />
          {currentStats && <Stats stats={currentStats} />}
          <Separator />
          {extent && <Extent extent={extent} />}
        </div>
      </ScrollArea>
    </>
  );
}

export default RasterLayerConfigure;
