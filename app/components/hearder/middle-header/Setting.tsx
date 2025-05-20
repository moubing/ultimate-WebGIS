"use client";

import { SetCurrentLayerContext } from "@/app/providers/contexts";
import CustomTooltip from "@/components/custom-ui/CustomTooltip";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useContext } from "react";

function Setting() {
  const setCurrentLayer = useContext(SetCurrentLayerContext);

  return (
    <CustomTooltip content="map settings" sideOffset={5}>
      <Button
        variant={"ghost"}
        size={"icon"}
        className="hover:bg-pink-100 hover:text-pink-500"
        onClick={() => setCurrentLayer("mapSetting")}
      >
        <Settings className="size-6" />
      </Button>
    </CustomTooltip>
  );
}

export default Setting;
