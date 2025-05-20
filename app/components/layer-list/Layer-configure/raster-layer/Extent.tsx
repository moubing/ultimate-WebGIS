"use client";

import React, { memo } from "react";
import { Field, Header } from "../../layer-configure-com/Labels";
import ShowButton from "@/components/custom-ui/ShowButton";
import { coordinatesToBound } from "@/lib/utils";
import { CornerCoordinates } from "@/lib/types";

const Extent = memo(function Extent({ extent }: { extent: CornerCoordinates }) {
  const bound = coordinatesToBound([
    extent.upperLeft as [number, number],
    extent.upperRight as [number, number],
    extent.lowerRight as [number, number],
    extent.lowerLeft as [number, number]
  ] as const);
  return (
    <div className="flex flex-col gap-2">
      <Header>Extent</Header>
      <div className="flex items-center justify-between pr-0.5">
        <Field>MinX</Field>

        <ShowButton content={bound[0].toString()} />
      </div>
      <div className="flex items-center justify-between pr-0.5">
        <Field>MinY</Field>

        <ShowButton content={bound[1].toString()} />
      </div>
      <div className="flex items-center justify-between pr-0.5">
        <Field>MaxX</Field>

        <ShowButton content={bound[2].toString()} />
      </div>
      <div className="flex items-center justify-between pr-0.5">
        <Field>MaxY</Field>

        <ShowButton content={bound[3].toString()} />
      </div>
    </div>
  );
});

export default Extent;
