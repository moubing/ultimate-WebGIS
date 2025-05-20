"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

function MapSetting() {
  return (
    <div className=" w-full flex flex-col gap-2 pr-6">
      <h1>Description</h1>
      <Textarea placeholder="Add map description..." rows={4} />
      <Separator />
      <h1>Map constraints</h1>
      <Button variant={"outline"} className="w-full">
        Add constraints
      </Button>
      <Separator />
      <h1>Table settings</h1>

      <div className="flex items-center justify-between space-x-2">
        <Label className="text-muted-foreground" htmlFor="switch-1">
          Viewers can open table
        </Label>
        <Switch id="switch-1" defaultChecked />
      </div>
      <div className="flex items-center justify-between space-x-2">
        <Label className="text-muted-foreground" htmlFor="switch-2">
          Open table by default
        </Label>
        <Switch id="switch-2" defaultChecked />
      </div>
      <Separator />
      <h1>Viewer permissions</h1>

      <div className="flex items-center justify-between space-x-2">
        <Label className="text-muted-foreground" htmlFor="switch-1">
          Duplicate map and data
        </Label>
        <Switch id="switch-1" defaultChecked />
      </div>
      <div className="flex items-center justify-between space-x-2">
        <Label className="text-muted-foreground" htmlFor="switch-2">
          See map presence
        </Label>
        <Switch id="switch-2" />
      </div>
      <div className="flex items-center justify-between space-x-2">
        <Label className="text-muted-foreground" htmlFor="switch-2">
          Export data
        </Label>
        <Switch id="switch-2" defaultChecked />
      </div>
    </div>
  );
}

export default MapSetting;
