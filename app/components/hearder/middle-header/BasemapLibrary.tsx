"use client";

import { CurrentMapStyleContext } from "@/app/providers/contexts";
import CustomSelect from "@/components/custom-ui/CustomSelect";
import CustomTooltip from "@/components/custom-ui/CustomTooltip";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { basemaps } from "@/lib/basemaps";
import { BasemapClass, currentMapStyleType, displayLayout } from "@/lib/types";
import Fuse from "fuse.js";
import { LayoutGrid, ListCollapse, MapIcon, X } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { BaseCardList } from "./BasemapCard";
import BasemapCategories from "./BasemapCategories";
import { SearchInput } from "./SearchInput";

function BasemapLibrary() {
  const [open, setOpen] = useState(false);
  const [currentBasemapClass, setCurrentBasemapClass] =
    useState<BasemapClass>("all");

  const [displayLayout, setDisplayLayout] = useState<displayLayout>("grid");
  const [filter, setFilter] = useState("");
  const [currentMap, setCurrentMap] = useState<currentMapStyleType>("mainMap");

  const basemapList = useMemo(() => {
    return basemaps[currentBasemapClass];
  }, [currentBasemapClass]);

  const filteredBasemapList = useMemo(() => {
    const fuse = new Fuse(basemaps["all"], {
      keys: ["name"],
      threshold: 0.3, // 降低匹配阈值（0.0=精确匹配，默认0.6）
      minMatchCharLength: 1, // 至少匹配 1 个连续字符
      ignoreLocation: false, // 不忽略字符位置（优先匹配开头的字符）
      distance: 5, // 允许字符间最大间隔（默认 100，数值越小越严格）
      findAllMatches: false // 不强制匹配所有可能性
    });
    const results = fuse.search(filter);
    if (results.length === 0) return [];
    return results.map((result) => result.item);
  }, [filter]);

  const handleCategoriesChange = useCallback((value: string) => {
    if (!value) return;
    setFilter("");
    setCurrentBasemapClass(value as BasemapClass);
  }, []);

  const changeCurrentMap = useCallback((value: string) => {
    setCurrentMap(value as currentMapStyleType);
  }, []);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <CustomTooltip content="Basemap library" sideOffset={5}>
        <DrawerTrigger asChild>
          <Button
            variant={"ghost"}
            size={"icon"}
            className="hover:bg-pink-100 hover:text-pink-500"
          >
            <MapIcon className="size-6" />
          </Button>
        </DrawerTrigger>
      </CustomTooltip>

      <CurrentMapStyleContext.Provider value={currentMap}>
        <DrawerContent>
          <DrawerHeader className="grid grid-cols-5 grid-rows-1 gap-2 border-b-pink-500/20 border-b-2 dark:border-slate-500/20">
            <div className="flex flex-col gap-2">
              <DrawerTitle className=" uppercase">Basemap Library</DrawerTitle>
              <DrawerDescription>
                there are a lot of basemap you can choose
              </DrawerDescription>
            </div>
            <SearchInput setFilter={setFilter} filter={filter} />
            <div className="flex items-center justify-end gap-2">
              <CustomSelect
                className="w-36"
                arr={["mainMap", "secondaryMap"]}
                initialSelection={currentMap}
                updateSelection={changeCurrentMap}
              />
              <ToggleGroup
                type="single"
                value={displayLayout}
                onValueChange={(value) =>
                  setDisplayLayout(value as displayLayout)
                }
              >
                <ToggleGroupItem value="grid">
                  <LayoutGrid />
                </ToggleGroupItem>
                <ToggleGroupItem value="list">
                  <ListCollapse />
                </ToggleGroupItem>
              </ToggleGroup>
              <CustomTooltip content="exit basemap library">
                <Button
                  size={"icon"}
                  variant={"ghost"}
                  onClick={() => setOpen(false)}
                >
                  <X />
                </Button>
              </CustomTooltip>
            </div>
          </DrawerHeader>
          <div className="w-full grid grid-cols-6 grid-rows-1 min-h-96">
            <div className="pt-4 border-pink-500/20 dark:border-slate-500/20 border-r-2">
              <BasemapCategories
                currentBasemapClass={currentBasemapClass}
                onValueChange={handleCategoriesChange}
              />
            </div>
            <ScrollArea className="h-[650px] col-span-5">
              <BaseCardList
                basemapList={filter === "" ? basemapList : filteredBasemapList}
              />
            </ScrollArea>
          </div>
        </DrawerContent>
      </CurrentMapStyleContext.Provider>
    </Drawer>
  );
}

export default BasemapLibrary;
