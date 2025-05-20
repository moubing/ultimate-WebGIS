"use client";

import {
  DeckLayersContext,
  SetDeckLayersContext,
} from "@/app/providers/contexts";
import { DeckLayer } from "@/lib/types";
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

function DeckLayerList() {
  const deckLayers = useContext(DeckLayersContext);
  const setDeckLayers = useContext(SetDeckLayersContext);

  const deckLayerIds = useMemo(
    () => deckLayers.map((layer) => layer.id),
    [deckLayers]
  );
  const [activeLayer, setActiveLayer] = useState<DeckLayer | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 3 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = useCallback((e: DragStartEvent) => {
    const activeData = e.active?.data?.current as DeckLayer;
    setActiveLayer(activeData);
  }, []);

  const handleDragEnd = useCallback(
    (e: DragEndEvent) => {
      setActiveLayer(null);

      const { active, over } = e;
      if (!over || active.id === over.id) return;

      setDeckLayers((pre) => {
        const activeIndex = pre.findIndex((item) => item.id === active.id);
        const overIndex = pre.findIndex((item) => item.id === over.id);

        return arrayMove(pre, activeIndex, overIndex);
      });
    },
    [setDeckLayers]
  );
  return (
    deckLayers &&
    deckLayers.length > 0 && (
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className=" flex flex-col gap-2">
          <h1>deck layers</h1>
          <SortableContext items={deckLayerIds}>
            {deckLayers.map((layer) => (
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
    )
  );
}

export default DeckLayerList;
