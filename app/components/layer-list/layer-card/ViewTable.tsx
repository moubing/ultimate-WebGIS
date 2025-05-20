"use client";

import {
  CurrentSourceContext,
  MapSourcesContext,
  SetCurrentSourceContext
} from "@/app/providers/contexts";
import {
  SetColumnFiltersStateContext,
  SetPaginationStateContext,
  SetRowSelectionStateContext,
  SetSortingStateContext,
  SetTableOpenContext,
  SetVisibilityStateContext
} from "@/app/providers/tabelContext";
import {
  ContextMenuItem,
  ContextMenuShortcut
} from "@/components/ui/context-menu";
import { MapLayer } from "@/lib/types";
import { GeoJSONSourceSpecification } from "maplibre-gl";
import { useCallback, useContext, useMemo } from "react";
import { toast } from "sonner";

function ViewTable({ layer }: { layer: MapLayer }) {
  const setSorting = useContext(SetSortingStateContext);
  const setColumnFilters = useContext(SetColumnFiltersStateContext);
  const setVisibility = useContext(SetVisibilityStateContext);
  const setPagination = useContext(SetPaginationStateContext);
  const setRowSelection = useContext(SetRowSelectionStateContext);
  const setTableOpen = useContext(SetTableOpenContext);

  const setCurrentSource = useContext(SetCurrentSourceContext);
  const currentSource = useContext(CurrentSourceContext);
  const mapSources = useContext(MapSourcesContext);

  const layerSource = useMemo(
    () => mapSources.find((source) => source.id === (layer as MapLayer).source),
    [mapSources, layer]
  );

  const handleClick = useCallback(() => {
    setTableOpen(true);
    toast.success(`open ${currentSource?.id} table`);

    if (currentSource?.id === layerSource?.id) return;
    setCurrentSource(
      layerSource as GeoJSONSourceSpecification & { id: string }
    );

    setSorting([]);
    setColumnFilters([]);
    setVisibility({});
    setPagination({ pageIndex: 0, pageSize: 20 });
    setRowSelection({});
  }, [
    setCurrentSource,
    setSorting,
    setColumnFilters,
    setVisibility,
    setPagination,
    setRowSelection,
    layerSource,
    setTableOpen,
    currentSource?.id
  ]);

  return (
    <ContextMenuItem inset onClick={handleClick}>
      View talbe
      <ContextMenuShortcut>⌘]</ContextMenuShortcut>
    </ContextMenuItem>
  );
}

export default ViewTable;
