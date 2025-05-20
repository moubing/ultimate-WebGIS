"use client";

import {
  InspectLayersContext,
  MapLayersContext,
  SetInspectLayersContext,
  SetInspectPaylodContext
} from "@/app/providers/contexts";
import CustomSelect from "@/components/custom-ui/CustomSelect";
import CustomTooltip from "@/components/custom-ui/CustomTooltip";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { inspectFeatureType } from "@/lib/types";
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates
} from "@dnd-kit/sortable";
import _ from "lodash";
import { SquareDashedMousePointerIcon } from "lucide-react";
import { useCallback, useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { MapMouseEvent, useMap } from "react-map-gl/maplibre";
import { Field } from "../layer-configure-com/Labels";
import {
  ContainerOverlay,
  InspectContainer,
  NoInspectContainer
} from "./Container";
import { InspectLayerCardOverlay } from "./InspectLayerCard";

const inspectArr = ["none", "click", "hover"];
type inspectType = "none" | "click" | "hover";
type dataType = { type: "inspect" | "noInspect" | "container" };
const container = ["Inspected", "Uninspected"];

function InspectConfigurePanel() {
  const [inspectMode, setInspectMode] = useState<inspectType>("click");
  const [isFitView, setIsFitView] = useState(false);

  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [activeContainer, setActiveContainer] = useState<{
    arr: string[];
    name: string;
  } | null>(null);

  const { mainMap } = useMap();
  const setInspectPayload = useContext(SetInspectPaylodContext);
  const mapLayers = useContext(MapLayersContext);
  const inspectLayers = useContext(InspectLayersContext);
  const setInspectLayers = useContext(SetInspectLayersContext);

  const [noInspectLayers, setNoInspectLayers] = useState(() => {
    const newArr: string[] = [];
    mapLayers.forEach((layer) => {
      const result = inspectLayers?.find((item) => item === layer.id);
      if (!!result) return;
      newArr.push(layer.id);
    });
    return newArr;
  });

  useEffect(() => {
    setNoInspectLayers(() => {
      const newArr: string[] = [];
      mapLayers.forEach((layer) => {
        const result = inspectLayers?.find((item) => item === layer.id);
        if (!!result) return;
        newArr.push(layer.id);
      });
      return newArr;
    });
  }, [inspectLayers, mapLayers, setNoInspectLayers]);

  useEffect(() => {
    if (!mainMap || inspectMode === "none" || inspectMode === "hover") return;

    const handleClick = (e: MapMouseEvent) => {
      const features = mainMap.getMap().queryRenderedFeatures(e.point, {
        layers: inspectLayers ?? []
      });

      if (features && features?.length > 0) {
        if (isFitView) {
          mainMap.getMap().panTo(e.lngLat);
        }
        const inspectFeatures = features.map((fea) => {
          return {
            layerId: fea.layer.id,
            sourceId: fea.layer.source,
            properties: fea.properties,
            geometryType: fea.geometry.type
          } as inspectFeatureType;
        });
        setInspectPayload({
          longitude: e.lngLat.lng,
          latitude: e.lngLat.lat,
          inspectFeatures
        });
      } else {
        setInspectPayload(null);
      }
    };

    if (inspectMode === "click") {
      mainMap.getMap().on("click", handleClick);
    }

    return () => {
      mainMap.getMap().off("click", handleClick);
    };
  }, [mainMap, setInspectPayload, inspectLayers, inspectMode, isFitView]);

  const changeInspectMode = useCallback((mode: string) => {
    setInspectMode(mode as inspectType);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 3 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = useCallback((e: DragStartEvent) => {
    const type = e.active.data.current?.type;
    if (!type) return;
    if (type === "container") {
      setActiveContainer({
        arr: e.active.data.current?.arr,
        name: e.active.id as string
      });
    } else {
      setActiveCard(e.active.id as string);
    }
  }, []);

  const handleDragEnd = useCallback(
    (e: DragEndEvent) => {
      setActiveCard(null);
      setActiveContainer(null);
      const { active, over } = e;
      if (!over || active.id === over.id) return;

      const activeData = active?.data?.current as dataType;
      const overData = over?.data?.current as dataType;

      const isInspectCardActive = activeData.type === "inspect";
      const isNoInspectCardActive = activeData.type === "noInspect";
      const isInspectCardOver = overData.type === "inspect";
      const isNoInspectCardOver = overData.type === "noInspect";

      if (isInspectCardActive && isInspectCardOver) {
        setInspectLayers((pre) => {
          if (pre.length === 0) return [];
          const activeIndex = pre.findIndex((item) => item === active.id);
          const overIndex = pre.findIndex((item) => item === over.id);

          return arrayMove(pre, activeIndex, overIndex);
        });
      }

      if (isNoInspectCardActive && isNoInspectCardOver) {
        setNoInspectLayers((pre) => {
          if (pre.length === 0) return [];
          const activeIndex = pre.findIndex((item) => item === active.id);
          const overIndex = pre.findIndex((item) => item === over.id);

          return arrayMove(pre, activeIndex, overIndex);
        });
      }
    },
    [setInspectLayers, setNoInspectLayers]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleDragOver = useCallback(
    _.throttle(
      (e) => {
        const { active, over } = e;
        if (!over || active.id === over.id) return;

        const activeData = active?.data?.current as dataType;
        const overData = over?.data?.current as dataType;

        const isInspectCardActive = activeData.type === "inspect";
        const isInspectCardOver = overData.type === "inspect";

        const isNoInspectCardActive = activeData.type === "noInspect";
        const isNoInspectCardOver = overData.type === "noInspect";

        const isContainerActive = activeData.type === "container";
        const isContianerOver = overData.type === "container";

        if (isContainerActive) return;
        if (isInspectCardActive && isInspectCardOver) return;
        if (isNoInspectCardActive && isNoInspectCardOver) return;

        if (isContianerOver && isInspectCardActive) {
          setInspectLayers((pre) => {
            return pre.filter((layer) => layer !== active.id);
          });

          setNoInspectLayers((pre) => {
            return [...pre, active.id];
          });
        }
        if (isContianerOver && isNoInspectCardActive) {
          setNoInspectLayers((pre) => {
            return pre.filter((layer) => layer !== active.id);
          });

          setInspectLayers((pre) => {
            return [...pre, active.id];
          });
        }

        if (isInspectCardActive && isNoInspectCardOver) {
          setInspectLayers((pre) => {
            return pre.filter((layer) => layer !== active.id);
          });
          const noInspectCardIndex = noInspectLayers.findIndex(
            (item) => item === over.id
          );
          setNoInspectLayers((pre) => {
            return pre.toSpliced(noInspectCardIndex, 0, active.id);
          });
        }

        if (isNoInspectCardActive && isInspectCardOver) {
          setNoInspectLayers((pre) => {
            return pre.filter((layer) => layer !== active.id);
          });
          const inspectCardIndex = inspectLayers.findIndex(
            (item) => item === over.id
          );
          setInspectLayers((pre) => {
            return pre.toSpliced(inspectCardIndex, 0, active.id);
          });
        }
      },
      100,
      { leading: true, trailing: true }
    ),
    []
  );

  return (
    <Popover>
      <CustomTooltip content="inspect configure">
        <PopoverTrigger asChild>
          <Button variant={"ghost"} size={"icon"}>
            <SquareDashedMousePointerIcon className="size-5" />
          </Button>
        </PopoverTrigger>
      </CustomTooltip>
      <PopoverContent
        align={"start"}
        side={"right"}
        sideOffset={70}
        className="w-[430px] flex flex-col gap-2"
      >
        <h1 className="text-foreground">Inspect configure</h1>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2">
            <Field>Mode:</Field>
            <CustomSelect
              arr={[...inspectArr]}
              initialSelection="click"
              updateSelection={changeInspectMode}
            />
          </div>
          <div className="flex items-center justify-between gap-2">
            <Field>Fit view:</Field>
            <Switch checked={isFitView} onCheckedChange={setIsFitView} />
          </div>
        </div>

        <DndContext
          collisionDetection={closestCorners}
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
        >
          <div className="grid grid-cols-2 gap-4">
            <SortableContext items={container}>
              <InspectContainer inspectLayers={inspectLayers} />
              <NoInspectContainer noInspectLayers={noInspectLayers} />
            </SortableContext>
          </div>
          {typeof document !== "undefined" &&
            createPortal(
              <DragOverlay>
                {activeCard && <InspectLayerCardOverlay name={activeCard} />}
                {activeContainer && (
                  <ContainerOverlay
                    arr={activeContainer.arr}
                    name={activeContainer.name}
                  />
                )}
              </DragOverlay>,
              document.body
            )}
        </DndContext>
      </PopoverContent>
    </Popover>
  );
}

export default InspectConfigurePanel;
