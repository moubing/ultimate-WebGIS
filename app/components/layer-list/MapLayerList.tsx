"use client";

import {
  MapLayersContext,
  SetMapLayersContext,
} from "@/app/providers/contexts";
import { MapLayer } from "@/lib/types";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { useCallback, useContext, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import LayerCard, { LayerCardOverlay } from "./LayerCard";
import MapLayerListTools from "./MapLayerListTools";

function MapLayerList() {
  const mapLayers = useContext(MapLayersContext);
  const setMapLayers = useContext(SetMapLayersContext);

  const mapLayersIds = useMemo(
    () => mapLayers.map((layer) => layer.id),
    [mapLayers]
  );
  const [activeLayer, setActiveLayer] = useState<MapLayer | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 3 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = useCallback((e: DragStartEvent) => {
    const activeData = e.active?.data?.current as MapLayer;
    setActiveLayer(activeData);
  }, []);

  const handleDragEnd = useCallback(
    (e: DragEndEvent) => {
      setActiveLayer(null);

      const { active, over } = e;
      if (!over || active.id === over.id) return;

      setMapLayers((pre) => {
        const activeIndex = pre.findIndex((item) => item.id === active.id);
        const overIndex = pre.findIndex((item) => item.id === over.id);

        return arrayMove(pre, activeIndex, overIndex);
      });
    },
    [setMapLayers]
  );
  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className=" flex flex-col gap-2">
        <MapLayerListTools />
        <SortableContext items={mapLayersIds}>
          {mapLayers.map((layer) => (
            <LayerCard layer={layer} key={layer.id} />
          ))}
        </SortableContext>
      </div>

      {typeof document !== "undefined" &&
        createPortal(
          <DragOverlay>
            {activeLayer && <LayerCardOverlay layer={activeLayer} />}
          </DragOverlay>,
          document.body
        )}
    </DndContext>
  );
}

export default MapLayerList;
