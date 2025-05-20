"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChevronRight } from "lucide-react";

function Category() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"link"}
          className="px-0 flex gap-1 text-base text-muted-foreground"
        >
          Drafts
          <ChevronRight className="size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Move map</DialogTitle>
          <DialogDescription>Change the map category</DialogDescription>
        </DialogHeader>
        {/* <ScrollArea className=" h-[200px] bg-slate-100 rounded-md">
          <div className="bg-pink-200 pl-8 mt-2">Drafts</div>
          <div className=" pl-8">General</div>
        </ScrollArea> */}
        <DialogFooter>
          <Button variant={"secondary"}>Canel</Button>
          <Button disabled variant={"default"}>
            Move
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default Category;
