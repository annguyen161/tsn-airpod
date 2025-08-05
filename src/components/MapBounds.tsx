import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { FeatureCollection } from "geojson";
import { MAP_CONFIG } from "../contants";

interface MapBoundsProps {
  geoJsonData: FeatureCollection;
}

const MapBounds: React.FC<MapBoundsProps> = ({ geoJsonData }) => {
  const map = useMap();
  const hasSetBounds = useRef(false); // Prevent multiple fitBounds calls

  useEffect(() => {
    if (!geoJsonData?.features?.length || hasSetBounds.current) return;

    // Calculate bounds from all features using transformed coordinates
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

        // Use transformed coordinates directly (already scaled down)
        const latLngs: [number, number][] = ring.map((coord: number[]) => [
          coord[1], // lat
          coord[0], // lng
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
      // Set bounds only once and mark as set
      hasSetBounds.current = true;

      // Use setTimeout to ensure map is fully initialized
      setTimeout(() => {
        map.fitBounds(allBounds!, {
          padding: MAP_CONFIG.fitBoundsPadding,
          maxZoom: MAP_CONFIG.fitBoundsMaxZoom,
          animate: false, // Disable animation for initial fit
        });
      }, 100);
    }
  }, [geoJsonData, map]);

  return null;
};

export default MapBounds;
