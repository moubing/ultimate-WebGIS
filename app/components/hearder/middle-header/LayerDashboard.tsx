"use client";

import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
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
  useSortable,
} from "@dnd-kit/sortable";
import { LAYERS } from "@/lib/constants";
import { SortableLayerItem, SortableLayerObject } from "@/lib/types";
import { CSS } from "@dnd-kit/utilities";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import AddLayerDialog from "./AddLayerDialog";

function LayerDashboard({ closeDialog }: { closeDialog: () => void }) {
  const [categories, setCategories] = useState(LAYERS);
  const categoryIds = useMemo(
    () => categories.map((category) => category.id),
    [categories]
  );

  const [selectedLayerObject, setSelectedLayerObject] =
    useState<SortableLayerObject | null>(null);

  const [activeCategory, setActiveCategory] =
    useState<SortableLayerItem | null>(null);
  const [activeLayer, setActiveLayer] = useState<SortableLayerObject | null>(
    null
  );

  const closeAllDialog = useCallback(() => {
    closeDialog();
    setSelectedLayerObject(null);
  }, [closeDialog]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 3 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = useCallback((e: DragStartEvent) => {
    const activeData = e.active?.data?.current as
      | SortableLayerObject
      | SortableLayerItem;
    if (activeData && activeData.type === "category") {
      setActiveCategory(activeData);
    }
    if (activeData && activeData.type === "item") {
      setActiveLayer(activeData);
    }
  }, []);

  const handleDragEnd = useCallback((e: DragEndEvent) => {
    setActiveCategory(null);
    setActiveLayer(null);

    const { active, over } = e;
    if (!over || active.id === over.id) return;

    const activeData = active?.data?.current as
      | SortableLayerObject
      | SortableLayerItem;
    const overData = over?.data?.current as
      | SortableLayerObject
      | SortableLayerItem;

    const isTaskActive = activeData.type === "item";
    const isCategoryActive = activeData.type === "category";
    const isTaskOver = overData.type === "item";
    const isCategoryOver = overData.type === "category";

    if (isCategoryActive && isCategoryOver) {
      setCategories((pre) => {
        const activeIndex = pre.findIndex((item) => item.id === active.id);
        const overIndex = pre.findIndex((item) => item.id === over.id);

        return arrayMove(pre, activeIndex, overIndex);
      });
    }

    if (isTaskActive && isTaskOver) {
      if (activeData.updateLayers) {
        activeData.updateLayers((pre) => {
          const activeIndex = pre.findIndex((item) => item.id === active.id);
          const overIndex = pre.findIndex((item) => item.id === over.id);

          return arrayMove(pre, activeIndex, overIndex);
        });
      }
    }
  }, []);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 ">
        <SortableContext items={categoryIds}>
          {categories.map((category) => (
            <CategroyCard
              key={category.id}
              category={category}
              setSelectedLayerObject={setSelectedLayerObject}
            />
          ))}
        </SortableContext>
      </div>
      <AddLayerDialog
        selectedLayerObject={selectedLayerObject}
        setSelectedLayerObject={setSelectedLayerObject}
        closeAllDialog={closeAllDialog}
      />
      {typeof document !== "undefined" &&
        createPortal(
          <DragOverlay>
            {activeCategory && (
              <CategoryCardOverlay category={activeCategory} />
            )}
            {activeLayer && <LayerCardOverlay layerObject={activeLayer} />}
          </DragOverlay>,
          document.body
        )}
    </DndContext>
  );
}

export default LayerDashboard;

function CategroyCard({
  category,
  setSelectedLayerObject,
}: {
  category: SortableLayerItem;
  setSelectedLayerObject: React.Dispatch<
    React.SetStateAction<SortableLayerObject | null>
  >;
}) {
  const [layers, setLayers] = useState(category.layers);
  const layerIds = useMemo(() => {
    return layers.map((layer) => layer.id);
  }, [layers]);
  const {
    setNodeRef,
    attributes,
    isDragging,
    listeners,
    transform,
    transition,
  } = useSortable({ id: category.id, data: category });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "w-[500px] h-[440px]",
        isDragging && "opacity-50 border-2 border-dashed border-sky-500"
      )}
    >
      <CardHeader {...attributes} {...listeners}>
        <CardTitle>{category.id}</CardTitle>
        <CardDescription>{category.id} + description</CardDescription>
      </CardHeader>
      <ScrollArea className="h-[340px]">
        <CardContent className="grid grid-cols-4 gap-2">
          <SortableContext items={layerIds}>
            {layers.map((layer) => (
              <LayerCard
                key={layer.id}
                layerObject={layer}
                updateLayers={setLayers}
                setSelectedLayerObject={setSelectedLayerObject}
              />
            ))}
          </SortableContext>
        </CardContent>
      </ScrollArea>
    </Card>
  );
}

function LayerCard({
  layerObject,
  updateLayers,
  setSelectedLayerObject,
}: {
  layerObject: SortableLayerObject;
  updateLayers: Dispatch<SetStateAction<SortableLayerObject[]>>;
  setSelectedLayerObject: React.Dispatch<
    React.SetStateAction<SortableLayerObject | null>
  >;
}) {
  const {
    setNodeRef,
    attributes,
    isDragging,
    listeners,
    transform,
    transition,
  } = useSortable({
    id: layerObject.id,
    data: { ...layerObject, updateLayers },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  return (
    <Card
      onClick={() => setSelectedLayerObject(layerObject)}
      style={style}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={cn(
        "rounded-lg shadow-lg flex items-center justify-center aspect-square flex-col",
        isDragging && "opacity-50 border-2 border-pink-500 border-dashed"
      )}
    >
      <div className="text-lg">{layerObject.icon}</div>
      <div className="text-xs text-muted-foreground mb-2">{layerObject.id}</div>
    </Card>
  );
}
function LayerCardOverlay({
  layerObject,
}: {
  layerObject: SortableLayerObject;
}) {
  return (
    <Card className="rounded-lg shadow-lg flex items-center justify-center aspect-square flex-col">
      <div className="text-lg">{layerObject.icon}</div>
      <div className="text-xs mb-2 text-muted-foreground">{layerObject.id}</div>
    </Card>
  );
}

function CategoryCardOverlay({ category }: { category: SortableLayerItem }) {
  const layerIds = useMemo(() => {
    return category.layers.map((layer) => layer.id);
  }, [category]);

  return (
    <Card className={cn("w-[500px] h-[440px]")}>
      <CardHeader>
        <CardTitle>{category.id}</CardTitle>
        <CardDescription>{category.id} + description</CardDescription>
      </CardHeader>
      <ScrollArea className="h-[340px]">
        <CardContent className="grid grid-cols-4 gap-2">
          <SortableContext items={layerIds}>
            {category.layers.map((layer) => (
              <LayerCardOverlay key={layer.id} layerObject={layer} />
            ))}
          </SortableContext>
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
