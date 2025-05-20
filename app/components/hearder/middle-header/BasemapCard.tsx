"use client";

import {
  CurrentMapStyleContext,
  SetMapStyleContext
} from "@/app/providers/contexts";
import CustomTooltip from "@/components/custom-ui/CustomTooltip";
import { Button } from "@/components/ui/button";
import { generateImageUrl, generateMaptilerUrl } from "@/lib/basemaps";
import { tiltRate } from "@/lib/constants";
import { BasemapObject } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { NewtonsCradle } from "ldrs/react";
import "ldrs/react/NewtonsCradle.css";
import { MapPlus, ScanEye } from "lucide-react";
import Image from "next/image";
import { useContext, useRef, useState } from "react";
import { toast } from "sonner";

function BasemapCard({ basemap }: { basemap: BasemapObject }) {
  const currentMap = useContext(CurrentMapStyleContext);
  const setMapStyle = useContext(SetMapStyleContext);

  const [imageIndex, setImageIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { contextSafe } = useGSAP(() => {}, {
    dependencies: [],
    revertOnUpdate: true,
    scope: containerRef
  });

  const handleMouseMove = contextSafe((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const { left, top, width, height } =
      containerRef.current.getBoundingClientRect();

    const relativeX = (e.clientX - left) / width;
    const relativeY = (e.clientY - top) / height;

    const rotateX = (relativeY - 0.5) * tiltRate;
    const rotateY = (relativeX - 0.5) * -tiltRate;

    gsap.to(containerRef.current, {
      rotateX,
      rotateY,
      duration: 0.1,
      ease: "power1.inOut",
      transformPerspective: 500
    });
  });

  const handleMouseLeave = contextSafe(() => {
    gsap.to(containerRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.1,
      ease: "power1.inOut"
    });
  });

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      ref={containerRef}
      className=" ring-2 ring-sky-500/20 dark:ring-zinc-200/20 bg-background text-foreground p-4 flex flex-col gap-2 rounded-lg shadow-lg group basemap-card"
    >
      <div className="w-full relative ">
        <Image
          className="w-full h-[200px] rounded-lg object-center object-cover"
          height={256}
          width={256}
          alt={basemap.name}
          src={generateImageUrl(basemap.images[imageIndex])}
        />
        <div className="flex items-center gap-1 opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-150 absolute right-2 top-2">
          <CustomTooltip content={"preview this basemap"}>
            <Button
              variant={"outline"}
              className="bg-white dark:bg-zinc-800 hover:dark:bg-background"
              size={"icon"}
            >
              <ScanEye className="size-5" />
            </Button>
          </CustomTooltip>
          <CustomTooltip content={"select this basemap"}>
            <Button
              variant={"outline"}
              className="bg-white dark:bg-zinc-800 hover:dark:bg-background"
              size={"icon"}
              onClick={() => {
                toast.success(
                  `You have switched to ${basemap.name}, style is ${basemap.variants[imageIndex]}.`
                );
                setMapStyle((pre) => {
                  return {
                    ...pre,
                    [currentMap]: generateMaptilerUrl(
                      basemap.images[imageIndex]
                    )
                  };
                });
              }}
            >
              <MapPlus className="size-5" />
            </Button>
          </CustomTooltip>
        </div>
      </div>
      <div className=" w-full">
        <h1 className="text-foreground">{basemap.name}</h1>
        <CustomTooltip content={basemap.description}>
          <p className="text-muted-foreground text-sm italic truncate cursor-help">
            {basemap.description}
          </p>
        </CustomTooltip>
      </div>
      <div className="flex items-center gap-1 w-full">
        {basemap.variants.map((variant, index) => (
          <Button
            className={cn(
              "text-sm px-2 py-1 ",
              index === imageIndex &&
                "bg-sky-200 text-foreground dark:bg-zinc-800"
            )}
            key={variant}
            variant={"outline"}
            onClick={() => setImageIndex(index)}
          >
            {variant}
          </Button>
        ))}
      </div>
    </div>
  );
}

export function BaseCardList({
  basemapList
}: {
  basemapList: BasemapObject[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isEmpty = basemapList.length === 0;

  const {} = useGSAP(
    () => {
      if (isEmpty) return;

      gsap.from(".basemap-card", {
        y: 100,
        opacity: 0,
        scale: 0.2,
        stagger: 0.1,
        duration: 0.5,
        ease: "power1.out"
      });
    },
    { dependencies: [basemapList], revertOnUpdate: true, scope: containerRef }
  );

  const {} = useGSAP(
    () => {
      if (!isEmpty) return;
      gsap.from(".not-found-tip", {
        y: 100,
        scale: 0.2,
        opacity: 0.2,
        duration: 0.5,
        ease: "power1.out"
      });
    },
    { dependencies: [basemapList], revertOnUpdate: true }
  );

  return isEmpty ? (
    <div className="absolute left-1/2 top-36  -translate-x-1/2  flex items-center justify-center flex-col p-4 rounded-xl shadow-lg bg-zinc-50 not-found-tip">
      <h1 className="text-3xl text-muted-foreground">
        Oops! 😵 No results found.
      </h1>
      <p className="text-muted-foreground mb-2">
        Try a different keyword or check your spelling.
      </p>
      <NewtonsCradle size="78" speed="1.4" color="gray" />
    </div>
  ) : (
    <div
      ref={containerRef}
      className="grid grid-cols-1 xl:grid-cols-4 gap-8 w-full p-4 lg:grid-cols-3 sm:grid-cols-2 "
    >
      {basemapList.map((basemap) => (
        <BasemapCard key={basemap.name} basemap={basemap} />
      ))}
    </div>
  );
}
