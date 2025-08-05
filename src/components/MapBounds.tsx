import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { FeatureCollection } from "geojson";
import { SCALE_FACTOR, MAP_CONFIG } from "../contants";

interface MapBoundsProps {
  geoJsonData: FeatureCollection;
}

const MapBounds: React.FC<MapBoundsProps> = ({ geoJsonData }) => {
  const map = useMap();

  useEffect(() => {
    if (!geoJsonData?.features?.length) return;

    // Calculate bounds from all features
    let allBounds: L.LatLngBounds | null = null;

    geoJsonData.features.forEach((feature: any) => {
      if (!feature.geometry?.coordinates) return;

      let polygons: number[][][][];

      if (feature.geometry.type === "Polygon") {
        polygons = [feature.geometry.coordinates];
      } else if (feature.geometry.type === "MultiPolygon") {
        polygons = feature.geometry.coordinates;
      } else {
        return; // Skip unsupported geometry types
      }

      polygons.forEach((polygon: number[][][]) => {
        const ring = polygon[0]; // Outer ring

        // Scale coordinates down
        const latLngs: [number, number][] = ring.map((coord: number[]) => [
          coord[1] / SCALE_FACTOR,
          coord[0] / SCALE_FACTOR,
        ]);

        const featureBounds = L.latLngBounds(latLngs);

        if (allBounds) {
          allBounds.extend(featureBounds);
        } else {
          allBounds = featureBounds;
        }
      });
    });

    if (allBounds) {
      // Add padding and fit the map
      map.fitBounds(allBounds, {
        padding: MAP_CONFIG.fitBoundsPadding,
        maxZoom: MAP_CONFIG.fitBoundsMaxZoom,
      });
    }
  }, [geoJsonData, map]);

  return null;
};

export default MapBounds;
