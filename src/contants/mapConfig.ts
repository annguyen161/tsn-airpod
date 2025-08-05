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
  center: [63, 205] as [number, number],
  zoom: 0,
  minZoom: 0,
  maxZoom: 5,
  fitBoundsPadding: [50, 50] as [number, number],
  fitBoundsMaxZoom: 18,
};
