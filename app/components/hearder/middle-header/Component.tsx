"use client";

import CustomTooltip from "@/components/custom-ui/CustomTooltip";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  BarChartBase64,
  FilterBase64,
  FindBase64,
  HistogramBase64,
  StatisticBase64,
  TimeSeriesBase64
} from "@/lib/base64";
import {
  ChartBar,
  ChartNoAxesColumn,
  ChartNoAxesCombined,
  Clock,
  ComponentIcon,
  Funnel,
  ScanSearch,
  TextSearch
} from "lucide-react";
import Image from "next/image";
import Measure from "./Measure/Measure";

function Component() {
  return (
    <DropdownMenu modal={false}>
      <CustomTooltip delayDuration={0} content="Component" sideOffset={5}>
        <DropdownMenuTrigger asChild>
          <Button
            variant={"ghost"}
            size={"icon"}
            className="hover:bg-pink-100 hover:text-pink-500"
          >
            <ComponentIcon className="size-6" />
          </Button>
        </DropdownMenuTrigger>
      </CustomTooltip>
      <DropdownMenuContent sideOffset={15} className=" w-[230px]">
        <DropdownMenuLabel>ADD TO LAYER</DropdownMenuLabel>
        <DropdownMenuGroup>
          <CustomTooltip
            delayDuration={0}
            side="right"
            sideOffset={17}
            align="start"
            content={
              <div className="p-1 flex flex-col gap-2  ">
                <Image
                  className="w-[203px] h-[114px] rounded-md object-cover ring-2 dark:ring-pink-200 ring-zinc-200 object-center"
                  height={228}
                  width={406}
                  alt="statistic"
                  src={StatisticBase64}
                />
                <h1 className="text-white dark:text-black w-[203px] ">
                  Highlight a stat about a layer
                </h1>
              </div>
            }
          >
            <DropdownMenuItem className="flex relative items-center justify-between">
              <ChartNoAxesCombined /> Statistic
              <DropdownMenuShortcut></DropdownMenuShortcut>
            </DropdownMenuItem>
          </CustomTooltip>
          <CustomTooltip
            delayDuration={0}
            side="right"
            sideOffset={17}
            align="start"
            content={
              <div className="p-1 flex flex-col gap-2  ">
                <Image
                  className="w-[203px] h-[114px] rounded-md object-cover ring-2 dark:ring-pink-200 ring-zinc-200 object-center"
                  height={228}
                  width={406}
                  alt="Bar chart"
                  src={BarChartBase64}
                />
                <h1 className="text-white dark:text-black w-[203px] ">
                  View stats and filter across categories
                </h1>
              </div>
            }
          >
            <DropdownMenuItem className="flex relative items-center justify-between">
              <ChartBar /> Bar chart
              <DropdownMenuShortcut></DropdownMenuShortcut>
            </DropdownMenuItem>
          </CustomTooltip>

          <CustomTooltip
            delayDuration={0}
            side="right"
            sideOffset={17}
            align="start"
            content={
              <div className="p-1 flex flex-col gap-2  ">
                <Image
                  className="w-[203px] h-[114px] rounded-md object-cover ring-2 dark:ring-pink-200 ring-zinc-200 object-center"
                  height={228}
                  width={406}
                  alt="histogram"
                  src={HistogramBase64}
                />
                <h1 className="text-white dark:text-black w-[203px] ">
                  Visualize and filter by a numeric attribute
                </h1>
              </div>
            }
          >
            <DropdownMenuItem className="flex relative items-center justify-between">
              <ChartNoAxesColumn /> Histogramm
              <DropdownMenuShortcut></DropdownMenuShortcut>
            </DropdownMenuItem>
          </CustomTooltip>

          <CustomTooltip
            delayDuration={0}
            side="right"
            sideOffset={17}
            align="start"
            content={
              <div className="p-1 flex flex-col gap-2  ">
                <Image
                  className="w-[203px] h-[114px] rounded-md object-cover ring-2 dark:ring-pink-200 ring-zinc-200 object-center"
                  height={228}
                  width={406}
                  alt="filter"
                  src={FilterBase64}
                />
                <h1 className="text-white dark:text-black w-[203px] ">
                  Add a simple attribute filter
                </h1>
              </div>
            }
          >
            <DropdownMenuItem className="flex relative items-center justify-between">
              <Funnel /> Filter
              <DropdownMenuShortcut></DropdownMenuShortcut>
            </DropdownMenuItem>
          </CustomTooltip>
          <CustomTooltip
            delayDuration={0}
            side="right"
            sideOffset={17}
            align="start"
            content={
              <div className="p-1 flex flex-col gap-2  ">
                <Image
                  className="w-[203px] h-[114px] rounded-md object-cover ring-2 dark:ring-pink-200 ring-zinc-200 object-center"
                  height={228}
                  width={406}
                  alt="time series"
                  src={TimeSeriesBase64}
                />
                <h1 className="text-white dark:text-black w-[203px] ">
                  Visualize a layer across time
                </h1>
              </div>
            }
          >
            <DropdownMenuItem className="flex relative items-center justify-between">
              <Clock /> Time series
              <DropdownMenuShortcut></DropdownMenuShortcut>
            </DropdownMenuItem>
          </CustomTooltip>
        </DropdownMenuGroup>
        <Separator />
        <DropdownMenuLabel>ADD TO MAP</DropdownMenuLabel>
        <DropdownMenuGroup>
          <CustomTooltip
            delayDuration={0}
            side="right"
            sideOffset={17}
            align="start"
            content={
              <div className="p-1 flex flex-col gap-2  ">
                <Image
                  className="w-[203px] h-[114px] rounded-md object-cover ring-2 dark:ring-pink-200 ring-zinc-200 object-center"
                  height={228}
                  width={406}
                  alt="find"
                  src={FindBase64}
                />
                <h1 className="text-white dark:text-black w-[203px] ">
                  Allow viewers to jump to placesor and data from the legend
                </h1>
              </div>
            }
          >
            <DropdownMenuItem className="flex relative items-center justify-between">
              <TextSearch /> Find
              <DropdownMenuShortcut></DropdownMenuShortcut>
            </DropdownMenuItem>
          </CustomTooltip>
          <Measure />
          <CustomTooltip
            delayDuration={0}
            side="right"
            sideOffset={17}
            align="start"
            content={
              <div className="p-1 flex flex-col gap-2 ">
                <Image
                  className="w-[203px] h-[114px] rounded-md object-cover ring-2 dark:ring-pink-200 ring-zinc-200 object-center"
                  height={228}
                  width={406}
                  alt="spatial fitler"
                  src={"/image/spatialFilter.png"}
                />
                <h1 className="text-white dark:text-black w-[203px] ">
                  Allow viewers to filter data by area and get statistics
                </h1>
              </div>
            }
          >
            <DropdownMenuItem className="flex relative items-center justify-between">
              <ScanSearch /> Spatial filter
              <DropdownMenuShortcut></DropdownMenuShortcut>
            </DropdownMenuItem>
          </CustomTooltip>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default Component;
