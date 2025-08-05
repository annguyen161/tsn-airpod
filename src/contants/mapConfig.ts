// Map configuration constants
export const SCALE_FACTOR = 1000;

// Transform coordinates for scaling
export const transformCoordinates = (
  coords: any,
  geometryType: string
): any => {
  if (geometryType === "MultiPolygon") {
    return coords.map((polygon: number[][][]) =>
      polygon.map((ring: number[][]) =>
        ring.map((coord: number[]) => [
          coord[0] / SCALE_FACTOR,
          coord[1] / SCALE_FACTOR,
        ])
      )
    );
  } else if (geometryType === "Polygon") {
    return coords.map((ring: number[][]) =>
      ring.map((coord: number[]) => [
        coord[0] / SCALE_FACTOR,
        coord[1] / SCALE_FACTOR,
      ])
    );
  }
  return coords;
};

// Map view configuration
export const MAP_CONFIG = {
  // Center around the middle of expected data bounds
  center: [110, 200] as [number, number], // Closer to actual data center
  zoom: 1, // Start with higher zoom to avoid initial distortion
  minZoom: 0,
  maxZoom: 5,
  fitBoundsPadding: [20, 20] as [number, number], // Reduced padding for better fit
  fitBoundsMaxZoom: 4, // Lower max zoom for better overview
};
