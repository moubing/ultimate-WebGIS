"use client";

import CustomTooltip from "@/components/custom-ui/CustomTooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import _ from "lodash";
import { Eraser, SearchIcon, Wrench } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { Bouncy } from "ldrs/react";
import "ldrs/react/Bouncy.css";

export function SearchInput({
  setFilter,
  filter,
}: {
  setFilter: (filter: string) => void;
  filter: string;
}) {
  const [inputValue, setInputValue] = useState(filter);
  const [isSearching, setIsSearching] = useState(false);
  const deBounceSetFilter = useMemo(() => {
    return _.debounce((filter: string) => {
      setFilter(filter);
      setIsSearching(false);
    }, 200);
  }, [setFilter]);

  useEffect(() => {
    if (filter === "") setInputValue("");
  }, [filter]);

  return (
    <div className=" col-span-3 flex items-center justify-center relative">
      <Input
        value={inputValue}
        onChange={(e) => {
          setIsSearching(true);
          setInputValue(e.target.value);
          deBounceSetFilter(e.target.value);
        }}
        type="text"
        placeholder="Search basemap..."
        className=" focus-visible:ring-2 focus-visible:ring-pink-500 pl-8 ring-pink-200 ring-1 dark:ring-slate-200 dark:focus-visible:ring-slate-500"
      />
      <SearchIcon className="absolute size-5 left-2 text-muted-foreground" />
      {isSearching && (
        <div className="absolute -top-5 left-1">
          <Bouncy size={"30"} speed={"1"} color="gray" />
        </div>
      )}
      <div className="absolute right-1">
        <CustomTooltip content={"clear the search string"}>
          <Button
            variant={"ghost"}
            size={"sm"}
            className="px-2"
            onClick={() => {
              setFilter("");
              setInputValue("");
            }}
          >
            <Eraser className=" size-5  text-muted-foreground" />
          </Button>
        </CustomTooltip>
        <Popover>
          <CustomTooltip content="modify search options">
            <PopoverTrigger asChild>
              <Button variant={"ghost"} size={"sm"} className="p-2">
                <Wrench className=" size-5 text-muted-foreground" />
              </Button>
            </PopoverTrigger>
          </CustomTooltip>
          <PopoverContent className="flex items-center justify-center flex-col">
            <h1 className=" text-muted-foreground text-center">
              Here you can adjust the search options for the search box.
            </h1>
            <p className="text-muted-foreground text-sm italic text-center">
              However, this feature is not yet available.
            </p>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
