"use client";

import ShowButton from "@/components/custom-ui/ShowButton";
import { Field, Header } from "../../layer-configure-com/Labels";
import { memo } from "react";
import { BandStats } from "@/lib/types";

const Stats = memo(function Stats({ stats }: { stats: BandStats }) {
  return (
    <div className="flex flex-col gap-2">
      <Header>Stats</Header>
      <div className="flex items-center justify-between pr-0.5">
        <Field>Min</Field>

        <ShowButton content={stats.min.toString()} />
      </div>
      <div className="flex items-center justify-between pr-0.5">
        <Field>Max</Field>

        <ShowButton content={stats.max.toString()} />
      </div>
      <div className="flex items-center justify-between pr-0.5">
        <Field>Mean</Field>

        <ShowButton content={stats.mean.toString()} />
      </div>
      <div className="flex items-center justify-between pr-0.5">
        <Field>StdDev</Field>

        <ShowButton content={stats.stdDev.toString()} />
      </div>
    </div>
  );
});
export default Stats;
