"use client";

import { SetCurrentLayerContext } from "@/app/providers/contexts";
import CustomTooltip from "@/components/custom-ui/CustomTooltip";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Bomb,
  Calculator,
  Dice5,
  Focus,
  Grid2X2Plus,
  Shapes,
  SquareDashed,
  SquareDashedMousePointer,
  SquareRoundCorner,
  Tag,
  Tangent
} from "lucide-react";
import { useContext } from "react";
import { PiIntersectSquareDuotone } from "react-icons/pi";
import { TbArrowsRandom, TbPolygon } from "react-icons/tb";
import { VscSymbolClass } from "react-icons/vsc";
import { TbLayersDifference } from "react-icons/tb";
import { TbGitCherryPick } from "react-icons/tb";

function Transform() {
  const setCurrentLayer = useContext(SetCurrentLayerContext);

  return (
    <DropdownMenu modal={false}>
      <CustomTooltip content="Transform" sideOffset={5}>
        <DropdownMenuTrigger asChild>
          <Button
            variant={"ghost"}
            size={"icon"}
            className="hover:bg-pink-100 hover:text-pink-500"
          >
            <Shapes className="size-6" />
          </Button>
        </DropdownMenuTrigger>
      </CustomTooltip>
      <DropdownMenuContent sideOffset={15} className=" w-[230px]">
        <DropdownMenuLabel>SINGLE LAYER</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="flex relative items-center justify-between"
            onSelect={() => setCurrentLayer("Bounding")}
          >
            <SquareDashed /> Bounds
            <DropdownMenuShortcut></DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex relative items-center justify-between"
            onSelect={() => setCurrentLayer("Buffer")}
          >
            <SquareDashedMousePointer /> Buffer
            <DropdownMenuShortcut></DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex relative items-center justify-between"
            onSelect={() => setCurrentLayer("Centroid")}
          >
            <Focus /> Centroid
            <DropdownMenuShortcut></DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex relative items-center justify-between"
            onSelect={() => {
              setCurrentLayer("Disslove");
            }}
          >
            <Grid2X2Plus /> Dissolve
            <DropdownMenuShortcut></DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex relative items-center justify-between"
            onSelect={() => {
              setCurrentLayer("BezierSpline");
            }}
          >
            <Tangent /> BezierSpline
            <DropdownMenuShortcut></DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex relative items-center justify-between"
            onSelect={() => {
              setCurrentLayer("Simplify");
            }}
          >
            <SquareRoundCorner /> Simplify
            <DropdownMenuShortcut></DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex relative items-center justify-between"
            onSelect={() => {
              setCurrentLayer("Explode");
            }}
          >
            <Bomb /> Explode
            <DropdownMenuShortcut></DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <VscSymbolClass />
              Cluster
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem onSelect={() => setCurrentLayer("Dbscan")}>
                  <VscSymbolClass />
                  Dbscan
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setCurrentLayer("Kmeans")}>
                  <VscSymbolClass />
                  Kmeans
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <TbPolygon />
              PointToPolygon
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem onSelect={() => setCurrentLayer("Concave")}>
                  <TbPolygon />
                  Concave
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setCurrentLayer("Convex")}>
                  <TbPolygon />
                  Convex
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setCurrentLayer("Voronoi")}>
                  <TbPolygon />
                  Voronoi
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Calculator />
              Interpolation
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem
                  onSelect={() => setCurrentLayer("Interpolate")}
                >
                  <Calculator />
                  Interpolate
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setCurrentLayer("TIN")}>
                  <Calculator />
                  TIN
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <TbArrowsRandom />
              Random
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem
                  onSelect={() => setCurrentLayer("RandomPoint")}
                >
                  <TbArrowsRandom />
                  RandomPoint
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => setCurrentLayer("RandomLineString")}
                >
                  <TbArrowsRandom />
                  RandomLIineString
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => setCurrentLayer("RandomPolygon")}
                >
                  <TbArrowsRandom />
                  RandomPolygon
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setCurrentLayer("Sample")}>
                  <TbArrowsRandom />
                  Sample
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <Separator />
        <DropdownMenuLabel>MULTI LAYER</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="flex relative items-center justify-between"
            onSelect={() => setCurrentLayer("Intersect")}
          >
            <PiIntersectSquareDuotone /> Intersect
            <DropdownMenuShortcut></DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex relative items-center justify-between"
            onSelect={() => setCurrentLayer("Difference")}
          >
            <TbLayersDifference /> Difference
            <DropdownMenuShortcut></DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex relative items-center justify-between"
            onSelect={() => setCurrentLayer("PointsWithinPolygon")}
          >
            <Dice5 /> PointsWithinPolygon
            <DropdownMenuShortcut></DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex relative items-center justify-between"
            onSelect={() => setCurrentLayer("Tag")}
          >
            <Tag /> Tag
            <DropdownMenuShortcut></DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex relative items-center justify-between"
            onSelect={() => setCurrentLayer("Collect")}
          >
            <TbGitCherryPick /> Collect
            <DropdownMenuShortcut></DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default Transform;
