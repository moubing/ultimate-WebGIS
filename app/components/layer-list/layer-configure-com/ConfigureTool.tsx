"use client";

import {
  CurrentLayerContext,
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
import CustomTooltip from "@/components/custom-ui/CustomTooltip";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MapLayer } from "@/lib/types";
import { Group, MoreHorizontal, Rocket, Table2Icon } from "lucide-react";
import { GeoJSONSourceSpecification } from "maplibre-gl";
import { useContext, useMemo } from "react";
import ZoomToFit from "../Layer-configure/tools/ZoomToFit";
// todo 这个组件后面需要进行整改，就是它的这些工具都是基于当前图层的类型来生成的
// 比如说，geojson的图层就可以有查看属性表这个功能，而vector，raster，等等的就不行

function ConfigureTool() {
  return (
    <div className="pr-6 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div>
          <ZoomToFit />
          <CustomTooltip content="Group">
            <Button variant={"ghost"} size={"icon"}>
              <Group className="size-5" />
            </Button>
          </CustomTooltip>
          <OpenTableBtn />
          <CustomTooltip content="Publish">
            <Button variant={"ghost"} size={"icon"}>
              <Rocket className="size-5" />
            </Button>
          </CustomTooltip>
        </div>
        <Button variant={"ghost"} size={"icon"}>
          <MoreHorizontal className="size-5" />
        </Button>
      </div>
      <Separator />
    </div>
  );
}

export default ConfigureTool;

function OpenTableBtn() {
  const setSorting = useContext(SetSortingStateContext);
  const setColumnFilters = useContext(SetColumnFiltersStateContext);
  const setVisibility = useContext(SetVisibilityStateContext);
  const setPagination = useContext(SetPaginationStateContext);
  const setRowSelection = useContext(SetRowSelectionStateContext);
  const setTableOpen = useContext(SetTableOpenContext);

  const setCurrentSource = useContext(SetCurrentSourceContext);
  const currentLayer = useContext(CurrentLayerContext) as MapLayer;
  const mapSources = useContext(MapSourcesContext);
  const currentSource = useContext(CurrentSourceContext);

  const layerSource = useMemo(
    () => mapSources.find((source) => source.id === currentLayer.source),
    [mapSources, currentLayer]
  );

  return (
    <CustomTooltip content="View table">
      <Button
        variant={"ghost"}
        size={"icon"}
        onClick={() => {
          setTableOpen(true);
          if (currentSource?.id === layerSource?.id) return;
          setCurrentSource(
            layerSource as GeoJSONSourceSpecification & { id: string }
          );
          setSorting([]);
          setColumnFilters([]);
          setVisibility({});
          setPagination({ pageIndex: 0, pageSize: 20 });
          setRowSelection({});
        }}
      >
        <Table2Icon className="size-5" />
      </Button>
    </CustomTooltip>
  );
}
