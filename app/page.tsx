import LeftHearder from "./components/hearder/LeftHeader";
import MiddleHeader from "./components/hearder/MiddleHeader";
import RightHeader from "./components/hearder/RightHeader";
import LayerConfigurePanel from "./components/layer-list/LayerConfigurePanel";
import LayerListPanel from "./components/layer-list/LayerListPanel";
import MainMap from "./components/map/MainMap";
import ChartPanel from "./components/table/chart/ChartPanel";
import { TableDrawerContaier } from "./components/table/TableDrawer";
import CustomProvider from "./providers/CustomProvider";
import MapsProvider from "./providers/MapsProvider";
import TableProvider from "./providers/TableProvider";

function MapPage() {
  return (
    <CustomProvider>
      <TableProvider>
        <MapsProvider>
          <div className="w-full h-screen overflow-hidden relative">
            <MainMap />
            <div className="w-full fixed  bg-background/10 backdrop-blur-md text-foreground  z-10  ">
              <div className="bg-background/80 grid grid-cols-3 gap-2 px-8 py-2">
                <LeftHearder />
                <MiddleHeader />
                <RightHeader />
              </div>
            </div>
            <div className="bg-background/10 absolute z-10 left-4 top-16 w-[300px]  backdrop-blur-md">
              <LayerListPanel />
            </div>
            <div className="absolute z-10 right-12 top-16 w-[330px] bg-background/10 backdrop-blur-md">
              <LayerConfigurePanel />
            </div>
            <div className="absolute z-50  bottom-2 left-1/2 -translate-x-1/2 max-w-3xl bg-background/10 backdrop-blur-md rounded-lg">
              <ChartPanel />
            </div>
            <TableDrawerContaier />
          </div>
        </MapsProvider>
      </TableProvider>
    </CustomProvider>
  );
}

export default MapPage;
