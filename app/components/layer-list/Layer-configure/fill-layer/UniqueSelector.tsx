"use client";

import React, { useEffect, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

function UniqueSelector({
  uniqueValues,
  initialSelection,
  updateSelection
}: {
  uniqueValues: [string, number][];
  initialSelection: string;
  updateSelection: (value: [string, number]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = React.useState<string | null>(
    initialSelection
  );

  useEffect(() => {
    setSelectedItem(initialSelection);
  }, [initialSelection]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className=" w-full flex items-center justify-between"
        >
          {selectedItem ? (
            <>{selectedItem}</>
          ) : (
            <div className="text-muted-foreground">Select value</div>
          )}
          <ChevronDown className="size-4 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0"
        side="right"
        sideOffset={20}
        align="start"
      >
        <Command>
          <CommandInput placeholder="Search unique value..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {uniqueValues.map((item) => (
                <CommandItem
                  className="flex items-center justify-between"
                  key={item[0]}
                  value={item[0]}
                  onSelect={() => {
                    setSelectedItem(item[0]);
                    setOpen(false);
                    updateSelection(item);
                  }}
                >
                  <h1>{item[0]}</h1>
                  <h1>{item[1]}</h1>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default UniqueSelector;
