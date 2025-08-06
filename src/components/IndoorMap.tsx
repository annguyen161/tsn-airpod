import React, { useState, useRef, useEffect } from "react";
import { MapContainer, GeoJSON } from "react-leaflet";
import {
  Paper,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  CircularProgress,
  Box,
} from "@mui/material";
import {
  Add as ZoomInIcon,
  Remove as ZoomOutIcon,
  MyLocation as MyLocationIcon,
} from "@mui/icons-material";
import L from "leaflet";
import { FeatureCollection, Feature } from "geojson";
import {
  transformCoordinates,
  MAP_CONFIG,
  getFeatureInfo,
  demoUserLocations,
} from "../contants";

import MapBounds from "./MapBounds";
import UserLocationMarker from "./UserLocationMarker";
import SearchSidebar from "./SearchSidebar";

// User location interface
interface UserLocation {
  lat: number;
  lng: number;
  name: string;
  id: string;
  accuracy?: number;
  timestamp: number;
}

// Location item interface for search
interface LocationItem {
  id: string;
  name: string;
  type: string;
  category: string;
  layer: string;
  color: string;
}

const IndoorMap: React.FC = () => {
  const [geoJsonData, setGeoJsonData] = useState<FeatureCollection | null>(
    null
  );
  const [isLoadingMap, setIsLoadingMap] = useState(true);
  const mapRef = useRef<L.Map>(null);
  const mapInitialized = useRef(false);
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);

  // User location states
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locationMessage, setLocationMessage] = useState<string | null>(null);
  const [showLocationAlert, setShowLocationAlert] = useState(false);

  // Search states
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [highlightedLocation, setHighlightedLocation] = useState<string | null>(
    null
  );

  // Load GeoJSON data
  useEffect(() => {
    fetch("/data/map-airpod.geojson")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data: FeatureCollection) => {
        // Transform coordinates to scaled version
        const transformedData = {
          ...data,
          features: data.features?.map((feature: any) => ({
            ...feature,
            geometry: {
              ...feature.geometry,
              coordinates: transformCoordinates(
                feature.geometry.coordinates,
                feature.geometry.type
              ),
            },
          })),
        };

        setGeoJsonData(transformedData);
        setIsLoadingMap(false);
      })
      .catch((error) => {
        console.error("Error loading map data:", error);
        setIsLoadingMap(false);
      });
  }, []);

  // Initialize user location after map is properly set up
  useEffect(() => {
    if (!geoJsonData || mapInitialized.current) return;

    const initializeUserLocation = () => {
      // Wait for map bounds to be set first
      setTimeout(() => {
        const randomLocation =
          demoUserLocations[
            Math.floor(Math.random() * demoUserLocations.length)
          ];

        const newUserLocation: UserLocation = {
          ...randomLocation,
          accuracy: Math.floor(Math.random() * 20) + 10, // 10-30m accuracy
          timestamp: Date.now(),
        };

        setUserLocation(newUserLocation);
        mapInitialized.current = true;

        // Auto-zoom to user location when first loaded
        if (mapRef.current) {
          setTimeout(() => {
            mapRef.current?.setView(
              [randomLocation.lat, randomLocation.lng],
              4,
              {
                animate: true,
                duration: 1.0,
              }
            );
          }, 100); // Additional delay to ensure MapBounds has finished
        }
      }, 1000); // Increased delay to let bounds settle
    };

    // Initialize location detection after map data is loaded
    const timer = setTimeout(initializeUserLocation, 500);
    return () => clearTimeout(timer);
  }, [geoJsonData]);

  // Handle zoom in
  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.zoomIn();
    }
  };

  // Handle zoom out
  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.zoomOut();
    }
  };

  // Navigate to user location
  const handleGoToUserLocation = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.setView([userLocation.lat, userLocation.lng], 3, {
        animate: true,
        duration: 0.6,
      });
      setLocationMessage(
        `Đã di chuyển đến vị trí của bạn: ${userLocation.name}`
      );
      setShowLocationAlert(true);
    }
  };

  // Handle location selection from search
  const handleLocationSelect = (location: LocationItem) => {
    if (!geoJsonData || !mapRef.current) return;

    // Find the feature with matching layer
    const feature = geoJsonData.features?.find(
      (f: any) => f.properties?.Layer === location.layer
    );

    if (feature && feature.geometry) {
      // Calculate center of the feature
      const geometry = feature.geometry as any;
      let center: [number, number] = [0, 0];

      if (geometry.type === "Polygon") {
        const coordinates = geometry.coordinates[0];
        const centerX =
          coordinates.reduce(
            (sum: number, coord: number[]) => sum + coord[0],
            0
          ) / coordinates.length;
        const centerY =
          coordinates.reduce(
            (sum: number, coord: number[]) => sum + coord[1],
            0
          ) / coordinates.length;
        center = [centerY, centerX];
      } else if (geometry.type === "Point") {
        center = [geometry.coordinates[1], geometry.coordinates[0]];
      } else if (geometry.type === "MultiPolygon") {
        // Handle MultiPolygon geometry type
        const coordinates = geometry.coordinates[0][0];
        const centerX =
          coordinates.reduce(
            (sum: number, coord: number[]) => sum + coord[0],
            0
          ) / coordinates.length;
        const centerY =
          coordinates.reduce(
            (sum: number, coord: number[]) => sum + coord[1],
            0
          ) / coordinates.length;
        center = [centerY, centerX];
      }

      // Set highlighted location
      setHighlightedLocation(location.layer);

      // Zoom to location
      mapRef.current.setView(center, 4, {
        animate: true,
        duration: 0.8,
      });

      // Show location message
      setLocationMessage(`Đã di chuyển đến: ${location.name}`);
      setShowLocationAlert(true);

      // Clear highlight after 3 seconds
      setTimeout(() => {
        setHighlightedLocation(null);
      }, 3000);
    }
  };

  // Style function for GeoJSON features
  const geoJsonStyle = (feature?: Feature): L.PathOptions => {
    const layer = feature?.properties?.Layer || "default";
    const featureInfo = getFeatureInfo(layer);
    const isHighlighted = highlightedLocation === layer;

    // Check if this feature matches the selected category
    const matchesCategory = selectedCategory
      ? (() => {
          const categories = [
            {
              id: "check-in",
              types: ["check-in", "ticket", "information"],
            },
            {
              id: "dining",
              types: ["restaurant"],
            },
            {
              id: "services",
              types: ["service", "baggage"],
            },
            {
              id: "facilities",
              types: ["toilet", "waiting"],
            },
            {
              id: "offices",
              types: ["office"],
            },
            {
              id: "emergency",
              types: ["emergency"],
            },
            {
              id: "technical",
              types: ["technical", "utility", "storage"],
            },
          ];

          const category = categories.find(
            (cat) => cat.id === selectedCategory
          );
          return category ? category.types.includes(featureInfo.type) : false;
        })()
      : true;

    // Adjust opacity based on category filter
    const baseOpacity = featureInfo.type === "structure" ? 0.3 : 0.7;
    const filteredOpacity =
      selectedCategory && !matchesCategory ? 0.1 : baseOpacity;

    return {
      fillColor: featureInfo.color,
      weight: isHighlighted ? 4 : 2,
      opacity: selectedCategory && !matchesCategory ? 0.3 : 1,
      color: isHighlighted ? "#ff0000" : "#ffffff",
      dashArray: "",
      fillOpacity: isHighlighted ? 0.9 : filteredOpacity,
    };
  };

  // Handle feature click
  const onEachFeature = (feature: Feature, layer: L.Layer) => {
    const layerName = feature.properties?.Layer || "default";
    const featureInfo = getFeatureInfo(layerName);

    layer.on({
      click: (e: L.LeafletMouseEvent) => {
        const popupContent = `
          <div class="p-2">
            <h3 class="font-bold text-lg mb-2">${featureInfo.name}</h3>
            <p class="text-sm text-gray-600 mb-1">Loại: ${featureInfo.type}</p>
            <p class="text-sm text-gray-600">Layer: ${layerName}</p>
          </div>
        `;
        layer.bindPopup(popupContent).openPopup();
      },
      mouseover: (e: L.LeafletMouseEvent) => {
        const targetLayer = e.target;
        targetLayer.setStyle({
          weight: 3,
          fillOpacity: 0.9,
        });
      },
      mouseout: (e: L.LeafletMouseEvent) => {
        const targetLayer = e.target;
        const originalOpacity = featureInfo.type === "structure" ? 0.3 : 0.7;
        const isHighlighted = highlightedLocation === layerName;
        targetLayer.setStyle({
          weight: isHighlighted ? 4 : 2,
          fillOpacity: isHighlighted ? 0.9 : originalOpacity,
        });
      },
    });
  };

  // Show loading state while map data is being fetched
  if (isLoadingMap) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        flexDirection="column"
        gap={2}
      >
        <CircularProgress size={60} />
        <p className="text-gray-600">Đang tải bản đồ...</p>
      </Box>
    );
  }

  return (
    <div className="relative h-full w-full">
      {/* Search Sidebar */}
      <SearchSidebar
        onLocationSelect={handleLocationSelect}
        onCategoryFilter={setSelectedCategory}
        selectedCategory={selectedCategory}
      />

      <div
        className="zoom-controls"
        style={{ right: 16, bottom: 160, position: "absolute", zIndex: 1000 }}
      >
        <Paper
          elevation={2}
          className="bg-white/95 backdrop-blur-sm"
          sx={{ borderRadius: 1 }}
        >
          <div className="flex flex-col">
            <IconButton
              onClick={handleZoomIn}
              size="medium"
              className="border-b border-gray-200"
              sx={{
                borderRadius: 0,
                borderTopLeftRadius: 4,
                borderTopRightRadius: 4,
                padding: "12px",
                "&:hover": { backgroundColor: "#f3f4f6" },
              }}
            >
              <ZoomInIcon />
            </IconButton>
            <IconButton
              onClick={handleZoomOut}
              size="medium"
              sx={{
                borderRadius: 0,
                borderBottomLeftRadius: 4,
                borderBottomRightRadius: 4,
                padding: "12px",
                "&:hover": { backgroundColor: "#f3f4f6" },
              }}
            >
              <ZoomOutIcon />
            </IconButton>
          </div>
        </Paper>
      </div>

      <div
        className="location-control"
        style={{ right: 16, bottom: 100, position: "absolute", zIndex: 1000 }}
      >
        <Paper
          elevation={2}
          className="bg-white/95 backdrop-blur-sm"
          sx={{ borderRadius: 1 }}
        >
          <Tooltip
            title={
              userLocation
                ? "Di chuyển đến vị trí của bạn"
                : "Đang xác định vị trí..."
            }
          >
            <span>
              <IconButton
                onClick={handleGoToUserLocation}
                size="medium"
                disabled={!userLocation}
                sx={{
                  borderRadius: 1,
                  padding: "12px",
                  "&:disabled": {
                    color: "#bdbdbd",
                  },
                }}
              >
                <MyLocationIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Paper>
      </div>

      <MapContainer
        center={MAP_CONFIG.center as L.LatLngExpression}
        zoom={MAP_CONFIG.zoom}
        className="h-full w-full"
        ref={mapRef}
        zoomControl={false}
        attributionControl={false}
        crs={L.CRS.Simple}
        minZoom={MAP_CONFIG.minZoom}
        maxZoom={MAP_CONFIG.maxZoom}
        whenReady={() => {
          // Map is ready, components can now safely interact with it
        }}
      >
        {geoJsonData && (
          <>
            <MapBounds geoJsonData={geoJsonData} />
            <GeoJSON
              data={geoJsonData}
              style={geoJsonStyle}
              onEachFeature={onEachFeature}
              ref={geoJsonLayerRef}
            />
          </>
        )}

        {userLocation && (
          <UserLocationMarker
            position={[userLocation.lat, userLocation.lng]}
            name={userLocation.name}
            accuracy={userLocation.accuracy}
          />
        )}
      </MapContainer>

      <Snackbar
        open={showLocationAlert}
        autoHideDuration={4000}
        onClose={() => setShowLocationAlert(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setShowLocationAlert(false)}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {locationMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default IndoorMap;
