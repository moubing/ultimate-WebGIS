import { SetDrawFeaturesContext } from "@/app/providers/contexts";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import { useCallback, useContext, useMemo } from "react";
import { useControl } from "react-map-gl/maplibre";
import * as turf from "@turf/turf";

import type { ControlPosition } from "react-map-gl/maplibre";
import { Feature } from "geojson";

MapboxDraw.constants.classes.CANVAS = "maplibregl-canvas";
MapboxDraw.constants.classes.CONTROL_BASE = "maplibregl-ctrl";
MapboxDraw.constants.classes.CONTROL_PREFIX = "maplibregl-ctrl-";
MapboxDraw.constants.classes.CONTROL_GROUP = "maplibregl-ctrl-group";
MapboxDraw.constants.classes.ATTRIBUTION = "maplibregl-ctrl-attrib";

type DrawControlProps = ConstructorParameters<typeof MapboxDraw>[0] & {
  position?: ControlPosition;
};

export default function DrawControl(props: DrawControlProps) {
  const setDrawFeatures = useContext(SetDrawFeaturesContext);
  const draw = useMemo(() => new MapboxDraw(props), [props]);
  const onUpdate = useCallback(
    (e) => {
      setDrawFeatures((currentFeatures) => {
        const newFeatures = { ...currentFeatures };
        for (const f of e.features as Feature[]) {
          if (f.geometry.type === "Polygon") {
            if (!f.properties?.area) {
              f.properties = {
                ...f.properties,
                area: `${turf.area(f).toFixed(2)} m²` // 添加用户可见属性
              };
            }
          } else if (f.geometry.type === "LineString") {
            if (!f.properties?.length) {
              f.properties = {
                ...f.properties,
                length: `${turf.length(f).toFixed(2)} km`
              };
            }
          } else if (f.geometry.type === "Point") {
            if (!f.properties?.coordinate) {
              f.properties = {
                ...f.properties,
                coordinate: f.geometry.coordinates
                  .map((v) => v.toFixed(4))
                  .join(", ")
              };
            }
          }
          newFeatures[f.id!] = f;
        }
        draw.set(turf.featureCollection(Object.values(newFeatures)));
        return newFeatures;
      });
    },
    [draw, setDrawFeatures]
  );

  const onDelete = useCallback(
    (e) => {
      setDrawFeatures((currentFeatures) => {
        const newFeatures = { ...currentFeatures };
        for (const f of e.features) {
          delete newFeatures[f.id];
        }
        return newFeatures;
      });
    },
    [setDrawFeatures]
  );
  useControl<MapboxDraw>(
    () => {
      return draw;
    },
    ({ map }) => {
      map.on("draw.create", onUpdate);
      map.on("draw.update", onUpdate);
      map.on("draw.delete", onDelete);
    },
    ({ map }) => {
      map.off("draw.create", onUpdate);
      map.off("draw.update", onUpdate);
      map.off("draw.delete", onDelete);
    },
    {
      position: props.position
    }
  );

  return null;
}

DrawControl.defaultProps = {
  onCreate: () => {},
  onUpdate: () => {},
  onDelete: () => {}
};
