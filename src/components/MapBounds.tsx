import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { FeatureCollection } from "geojson";

interface MapBoundsProps {
  geoJsonData: FeatureCollection;
}

const MapBounds: React.FC<MapBoundsProps> = ({ geoJsonData }) => {
  const map = useMap();

  useEffect(() => {
    if (
      geoJsonData &&
      geoJsonData.features &&
      geoJsonData.features.length > 0
    ) {
      // Calculate bounds from all features
      let allBounds: L.LatLngBounds | null = null;

      geoJsonData.features.forEach((feature: any) => {
        if (
          feature.geometry &&
          feature.geometry.coordinates &&
          feature.geometry.type === "Polygon"
        ) {
          const coordinates = feature.geometry.coordinates[0];
          const latLngs: [number, number][] = coordinates.map(
            (coord: number[]) => [coord[1], coord[0]]
          );
          const featureBounds = L.latLngBounds(latLngs);

          if (allBounds) {
            allBounds.extend(featureBounds);
          } else {
            allBounds = featureBounds;
          }
        }
      });

      if (allBounds) {
        // Add some padding and fit the map
        map.fitBounds(allBounds, {
          padding: [50, 50],
          maxZoom: 18,
        });
      }
    }
  }, [geoJsonData, map]);

  return null;
};

export default MapBounds;
