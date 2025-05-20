"use client";

import { CurrentSourceContext } from "@/app/providers/contexts";
import {
  SetTableOpenContext,
  TableOpenContext
} from "@/app/providers/tabelContext";
import CustomTooltip from "@/components/custom-ui/CustomTooltip";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle
} from "@/components/ui/drawer";
import { useQuery } from "@tanstack/react-query";
import { FeatureCollection } from "geojson";
import { Zoomies } from "ldrs/react";
import "ldrs/react/Zoomies.css";
import { X } from "lucide-react";
import { useContext, useMemo } from "react";
import AttributeTable from "./AttributeTable";
import SelectSource from "./SelectSource";

export function TableDrawerContaier() {
  const currentSource = useContext(CurrentSourceContext);

  if (!!currentSource) return <TableDrawer />;
  return null;
}

function TableDrawer() {
  const currentSource = useContext(CurrentSourceContext);
  const tableOpen = useContext(TableOpenContext);
  const setTableOpen = useContext(SetTableOpenContext);

  const isUrlData = useMemo(() => {
    if (!currentSource) return false;
    if (typeof currentSource?.data === "string") return true;
    return false;
  }, [currentSource]);

  const { data, isSuccess, isLoading } = useQuery<FeatureCollection>({
    queryKey: [currentSource?.id],
    queryFn: async () => {
      if (!isUrlData) return currentSource?.data;
      const res = await fetch(currentSource?.data as string);
      return await res.json();
    }
  });

  return (
    <Drawer open={tableOpen} onOpenChange={setTableOpen}>
      <DrawerContent>
        <DrawerHeader className="grid grid-cols-5 grid-rows-1 gap-2 border-b-zinc-500/20 border-b-2 dark:border-slate-500/20 mb-4">
          <div className="flex flex-col gap-2  ">
            <DrawerTitle className=" uppercase">Attribute Table</DrawerTitle>
            <DrawerDescription>
              current source:{" "}
              <span className="text-sky-500">{currentSource?.id}</span>
            </DrawerDescription>
          </div>
          <SelectSource />
          <div className="flex items-center justify-end">
            <CustomTooltip content="exit basemap library">
              <Button
                size={"icon"}
                variant={"ghost"}
                onClick={() => setTableOpen(false)}
              >
                <X />
              </Button>
            </CustomTooltip>
          </div>
        </DrawerHeader>

        {!isLoading && isSuccess ? (
          <AttributeTable data={data?.features} />
        ) : (
          <div className="w-full flex h-[500px] items-center justify-between">
            <div className="flex flex-col gap-2">
              <Zoomies
                size="80"
                stroke="5"
                bgOpacity="0.1"
                speed="1.4"
                color="black"
              />
              <h1>data loading</h1>
            </div>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
}
