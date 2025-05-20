"use client";

import {
  InspectPaylodContext,
  SetInspectPaylodContext
} from "@/app/providers/contexts";
import CustomCopyBtn from "@/components/custom-ui/CustomCopyBtn";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi
} from "@/components/ui/carousel";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableRow
} from "@/components/ui/table";
import { useGSAP } from "@gsap/react";
import { BouncyArc } from "ldrs/react";
import "ldrs/react/BouncyArc.css";
import gsap from "gsap";
import { ChevronLeft, ChevronRight, MoreHorizontal, X } from "lucide-react";

import { memo, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Marker } from "react-map-gl/maplibre";

const InspectPanle = memo(function InspectPanle() {
  const inspectPayload = useContext(InspectPaylodContext);
  const setInspectPayload = useContext(SetInspectPaylodContext);
  const animatePoint = useRef(null);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const uniqueInspectPayload = useMemo(() => {
    const features = inspectPayload?.inspectFeatures;
    const map = new Map();
    features?.forEach((feature) => map.set(feature.layerId, feature));
    return Array.from(map.values());
  }, [inspectPayload]);

  useGSAP(
    () => {
      if (!animatePoint.current) return;
      gsap.to(animatePoint.current, {
        ease: "power1.out",
        scale: 2,
        opacity: 0,
        duration: 0.8,
        repeat: -1,
        repeatDelay: 1
      });
    },
    {
      dependencies: [inspectPayload],
      revertOnUpdate: true
    }
  );

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    const handleSelect = () => {
      setCurrent(api.selectedScrollSnap() + 1);
    };
    api.on("select", handleSelect);

    return () => {
      api.off("select", handleSelect);
    };
  }, [api, uniqueInspectPayload]);

  return (
    inspectPayload && (
      <Marker
        latitude={inspectPayload?.latitude ?? 90}
        longitude={inspectPayload?.longitude ?? 180}
      >
        <div className="rounded-full size-3 bg-white ring-pink-300  ring-1">
          <div
            ref={animatePoint}
            className="rounded-full size-3 bg-transparent ring-2 ring-white"
          />
          <div
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            onWheel={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            <div className="absolute bottom-16 -translate-x-1/2 left-1/2 subpixel-antialiased cursor-auto">
              <Carousel
                setApi={setApi}
                className=" w-[270px] bg-background/10 backdrop-blur-md rounded-xl"
                opts={{ align: "center", loop: true }}
              >
                <CarouselContent>
                  {uniqueInspectPayload.map((feature, index) => (
                    <CarouselItem key={index}>
                      <Card
                        className=" w-full bg-background/80 p-2 "
                        key={index}
                      >
                        <CardHeader className="relative p-0 pl-2 pb-2">
                          <CardTitle className="text-base font-medium ">
                            {feature.layerId}
                          </CardTitle>
                          <CardDescription className="text-sm text-muted-foreground">
                            {feature.geometryType}
                          </CardDescription>
                          <div className="absolute right-1 -top-1 flex items-center gap-1">
                            <Button
                              variant={"ghost"}
                              className="size-7"
                              size={"icon"}
                            >
                              <MoreHorizontal className="size-4" />
                            </Button>
                            <Button
                              variant={"ghost"}
                              className="size-7"
                              size={"icon"}
                              onClick={() => setInspectPayload(null)}
                            >
                              <X className="size-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="p-0">
                          <ScrollArea className="h-[220px]">
                            <Table>
                              <TableCaption className="text-pink-400">
                                {feature.sourceId}
                              </TableCaption>
                              <TableBody>
                                {Object.keys(feature.properties).length > 0 ? (
                                  Object.keys(feature.properties).map((key) => (
                                    <TableRow
                                      key={key}
                                      className="hover:bg-zinc-300/20"
                                    >
                                      <TableCell className="text-muted-foreground w-1/2">
                                        {key}
                                      </TableCell>
                                      <TableCell className="text-left font-medium w-1/2 relative group">
                                        {feature.properties[key] as string}
                                        <CustomCopyBtn
                                          copyContent={
                                            feature.properties[key] as string
                                          }
                                        />
                                      </TableCell>
                                    </TableRow>
                                  ))
                                ) : (
                                  <TableCell className="w-full h-[150px]  flex items-center justify-center flex-col gap-3">
                                    <BouncyArc
                                      size="80"
                                      speed="1.65"
                                      color="black"
                                    />
                                    no properties
                                  </TableCell>
                                )}
                              </TableBody>
                            </Table>
                            <ScrollBar orientation="horizontal" />
                          </ScrollArea>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 bottom-8 w-[100px] bg-background/10 backdrop-blur-md  rounded-md">
              <div className="bg-background/80 dark:bg-background/90 rounded-md flex items-center justify-center">
                <Button
                  onClick={() => api?.scrollPrev()}
                  variant={"ghost"}
                  className="p-1 size-7 hover:bg-transparent hover:text-pink-500"
                >
                  <ChevronLeft className="size-5" />
                </Button>
                <div className="flex items-center justify-center text-sm gap-1">
                  {current} <span className="text-muted-foreground">of</span>{" "}
                  {count}
                </div>
                <Button
                  onClick={() => api?.scrollNext()}
                  variant={"ghost"}
                  className="p-1 size-7 hover:bg-transparent hover:text-pink-500"
                >
                  <ChevronRight className="size-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Marker>
    )
  );
});

export default InspectPanle;
