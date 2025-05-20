"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DeckLayerList from "./DeckLayerList";
import MapLayerList from "./MapLayerList";
import LayerListPanelTools from "./LayerListPanelTools";

function LayerListPanel() {
  return (
    <Card className=" bg-background/80 dark:bg-background/90 p-4 ">
      <CardHeader className="p-0">
        <CardTitle>Layer list</CardTitle>
      </CardHeader>
      <LayerListPanelTools />
      <CardContent className="p-0">
        <DeckLayerList />
        <MapLayerList />
      </CardContent>
    </Card>
  );
}

export default LayerListPanel;
