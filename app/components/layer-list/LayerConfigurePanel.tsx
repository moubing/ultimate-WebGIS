"use client";

import {
  CurrentLayerContext,
  SetCurrentLayerContext
} from "@/app/providers/contexts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { layerConfigureMap } from "@/lib/layerConfigureMap";
import { layerTypeId } from "@/lib/types";
import { Cardio } from "ldrs/react";
import "ldrs/react/Cardio.css";
import { X } from "lucide-react";
import { useContext, useMemo } from "react";
import Title from "./layer-configure-com/Title";
import ConfigureTool from "./layer-configure-com/ConfigureTool";
import SearchTransform from "./layer-configure-com/SearchTransform";

function LayerConfigurePanel() {
  const currentLayerObject = useContext(CurrentLayerContext);
  const setCurrentLayer = useContext(SetCurrentLayerContext);

  const layerType = useMemo(() => {
    if (!currentLayerObject) return null;

    if (typeof currentLayerObject === "string") {
      return currentLayerObject;
    } else if ("paint" in currentLayerObject) {
      return currentLayerObject.type;
    } else {
      return currentLayerObject.constructor.layerName as layerTypeId;
    }
  }, [currentLayerObject]);

  const ConfigureComponent = layerType ? layerConfigureMap[layerType] : null;

  if (!currentLayerObject) return null;

  return (
    <Card className="bg-background/80 dark:bg-background/90  ">
      <CardHeader className="pb-2 pt-2">
        <CardTitle>
          <Title
            name={
              typeof currentLayerObject === "string"
                ? currentLayerObject
                : currentLayerObject.id
            }
          />
        </CardTitle>
      </CardHeader>
      <Button
        onClick={() => setCurrentLayer(null)}
        className="absolute right-6 top-2"
        variant={"ghost"}
        size={"icon"}
      >
        <X />
      </Button>
      <CardContent className="flex flex-col gap-2 h-fit pr-0 ">
        {typeof currentLayerObject === "string" &&
        currentLayerObject !== "mapSetting" &&
        currentLayerObject !== "Measure" ? (
          <SearchTransform />
        ) : layerType !== "raster" && layerType !== "Measure" ? (
          <ConfigureTool />
        ) : null}

        {ConfigureComponent ? (
          <ConfigureComponent />
        ) : (
          <div className="h-72 flex items-center justify-center flex-col ">
            <Cardio
              size="60"
              stroke="4"
              speed="2"
              color={`hsl(var(--foreground))`}
            />
            <h1 className="text-sm text-foreground text-center mt-2">
              Feature in progress. Coming soon!
            </h1>
            <p className="text-xs text-center text-muted-foreground">
              Oops! I am still polishing this feature. Keep an eye out!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default LayerConfigurePanel;
