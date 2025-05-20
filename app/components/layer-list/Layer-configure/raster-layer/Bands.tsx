"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Band } from "@/lib/types";
import { cn } from "@/lib/utils";
import { memo } from "react";
import { Header } from "../../layer-configure-com/Labels";

const Bands = memo(function Bands({
  bands,
  setSelectedBand,
  selectedBand
}: {
  bands: Band[];
  setSelectedBand: (band: Band) => void;
  selectedBand: Band;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Header>Bands</Header>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>band</TableHead>
            <TableHead>type</TableHead>
            <TableHead className="text-right">description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bands.map((band) => (
            <TableRow
              key={band.band}
              className={cn(
                "hover:bg-pink-100 hover:cursor-pointer dark:hover:bg-muted-foreground",
                selectedBand.band === band.band &&
                  "bg-pink-100 dark:bg-muted-foreground"
              )}
              onClick={() => {
                setSelectedBand(band);
              }}
            >
              <TableCell>{band.band}</TableCell>
              <TableCell>{band.type}</TableCell>
              <TableCell className="text-right">
                {band.description || band.colorInterpretation || "none"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
});

export default Bands;
