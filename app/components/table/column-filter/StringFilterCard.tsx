"use client";

import CustomSelect from "@/components/custom-ui/CustomSelect";
import CustomTooltip from "@/components/custom-ui/CustomTooltip";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Column } from "@tanstack/react-table";
import { FunnelX } from "lucide-react";
import { useCallback, useState } from "react";
import { Field, Header } from "../../layer-list/layer-configure-com/Labels";
import TextFilter from "./TextFilter";
import UniqueValueFilter from "./UniqueValueFilter";

type stringFilterType = "text" | "unique";

function StringFilterCard<TData>({ column }: { column: Column<TData> }) {
  const [type, setType] = useState<stringFilterType>("text");

  const changeSelectType = useCallback(
    (select: string) => {
      setType(select as stringFilterType);
      column.setFilterValue(undefined);
    },
    [column]
  );

  const isFiltered = !!column.getFilterValue();

  return (
    <div className="flex flex-col gap-2 p-2 rounded-md shadow border">
      <div className="flex items-center justify-between h-8">
        <Header
          className={cn(isFiltered && "text-pink-500 hover:text-pink-500")}
        >
          {column.id}
        </Header>
        {isFiltered && (
          <CustomTooltip content="reset filter">
            <Button
              onClick={() => column.setFilterValue(undefined)}
              variant={"outline"}
              size={"icon"}
              className={cn(isFiltered && "text-pink-500 hover:text-pink-500")}
            >
              <FunnelX className="size-5" />
            </Button>
          </CustomTooltip>
        )}
      </div>
      <div className="flex items-center justify-between">
        <Field> Type</Field>
        <CustomSelect
          arr={["text", "unique"]}
          initialSelection={type}
          updateSelection={changeSelectType}
        />
      </div>
      {type === "text" ? (
        <TextFilter column={column} />
      ) : (
        <UniqueValueFilter column={column} />
      )}
    </div>
  );
}

export default StringFilterCard;
