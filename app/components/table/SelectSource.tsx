"use client";

import { MapSourcesContext } from "@/app/providers/contexts";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useContext } from "react";

function SelectSource() {
  const mapSources = useContext(MapSourcesContext);

  return (
    <div className="col-span-3 flex items-center justify-center relative">
      <Select>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Change data source" />
        </SelectTrigger>
        <SelectContent>
          {mapSources.map((item) => (
            <SelectItem value={item.id} key={item.id}>
              <div className="flex items-center gap-4">
                <Badge variant={"outline"}>{item.type}</Badge>
                <p className="">{item.id}</p>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default SelectSource;
