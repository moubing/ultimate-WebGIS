"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChartArea } from "lucide-react";
import React, { useState } from "react";
import AddChartForm from "./AddChartForm";
import { Table } from "@tanstack/react-table";

function AddChartBtn<TData>({ table }: { table: Table<TData> }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button
          className="text-pink-500 hover:text-pink-500"
          variant={"outline"}
          onClick={() => {}}
        >
          <ChartArea className="size-5" /> Add chart
        </Button>
      </DialogTrigger>
      <DialogContent className=" max-w-2xl h-[700px] overflow-auto ">
        <DialogHeader>
          <DialogTitle>Chart option</DialogTitle>
          <DialogDescription>Configure you chart</DialogDescription>
        </DialogHeader>
        <AddChartForm table={table} closeDialog={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

export default AddChartBtn;
