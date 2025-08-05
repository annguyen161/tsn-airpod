import React, { useState, useRef, useEffect } from "react";
import { MapContainer, GeoJSON } from "react-leaflet";
import {
  Paper,
  Box,
  Typography,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
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
  areaColors,
  getFeatureInfo,
  demoUserLocations,
} from "../contants";

import MapBounds from "./MapBounds";
import UserLocationMarker from "./UserLocationMarker";

// User location interface
interface UserLocation {
  lat: number;
  lng: number;
  name: string;
  id: string;
  accuracy?: number;
  timestamp: number;
}

const IndoorMap: React.FC = () => {
  const [geoJsonData, setGeoJsonData] = useState<FeatureCollection | null>(
    null
  );
  const mapRef = useRef<L.Map>(null);

  // User location states
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locationMessage, setLocationMessage] = useState<string | null>(null);
  const [showLocationAlert, setShowLocationAlert] = useState(false);

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
      })
      .catch((error) => {
        console.error("Error loading map data:", error);
      });
  }, []);

  // Auto-detect user location on app startup
  useEffect(() => {
    const initializeUserLocation = () => {
      // Simulate GPS delay
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

        // Center map on user location
        if (mapRef.current) {
          mapRef.current.setView([randomLocation.lat, randomLocation.lng], 3);
        }
      }, 2000);
    };

    // Initialize location detection after a short delay to ensure map is ready
    const timer = setTimeout(initializeUserLocation, 500);
    return () => clearTimeout(timer);
  }, []);

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
      mapRef.current.setView([userLocation.lat, userLocation.lng], 3);
      setLocationMessage(
        `Đã di chuyển đến vị trí của bạn: ${userLocation.name}`
      );
      setShowLocationAlert(true);
    }
  };

  // Style function for GeoJSON features
  const geoJsonStyle = (feature?: Feature): L.PathOptions => {
    const layer = feature?.properties?.Layer || "default";
    const featureInfo = getFeatureInfo(layer);

    return {
      fillColor: featureInfo.color,
      weight: 2,
      opacity: 1,
      color: "#ffffff",
      dashArray: "",
      fillOpacity: featureInfo.type === "structure" ? 0.3 : 0.7,
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
        const layer = e.target;
        layer.setStyle({
          weight: 3,
          fillOpacity: 0.9,
        });
      },
      mouseout: (e: L.LeafletMouseEvent) => {
        const layer = e.target;
        const originalOpacity = featureInfo.type === "structure" ? 0.3 : 0.7;
        layer.setStyle({
          weight: 2,
          fillOpacity: originalOpacity,
        });
      },
    });
  };

  return (
    <div className="relative h-full w-full">
      {/* Search Controls */}
      <div className="map-controls">
        <Paper
          elevation={3}
          className="p-4 bg-white/95 backdrop-blur-sm"
          sx={{ borderRadius: 2 }}
        >
          <Box className="mb-3">
            <Typography variant="h6" className="font-bold text-gray-800 mb-1">
              Tân Sơn Nhất Airport
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              Indoor Navigation Map
            </Typography>
          </Box>

          {/* Legend */}
          <Box className="mt-3">
            <Typography
              variant="body2"
              className="font-medium mb-2 text-gray-700"
            >
              Chú thích:
            </Typography>
            <div className="grid grid-cols-1 gap-1 text-xs">
              <div className="flex items-center">
                <div
                  className="w-3 h-3 rounded mr-2"
                  style={{ backgroundColor: areaColors.gate }}
                />
                <span>Cổng bay</span>
              </div>
              <div className="flex items-center">
                <div
                  className="w-3 h-3 rounded mr-2"
                  style={{ backgroundColor: areaColors["check-in"] }}
                />
                <span>Check-in</span>
              </div>
              <div className="flex items-center">
                <div
                  className="w-3 h-3 rounded mr-2"
                  style={{ backgroundColor: areaColors.restaurant }}
                />
                <span>Ăn uống</span>
              </div>
              <div className="flex items-center">
                <div
                  className="w-3 h-3 rounded mr-2"
                  style={{ backgroundColor: areaColors["duty-free"] }}
                />
                <span>Mua sắm</span>
              </div>
              <div className="flex items-center">
                <div
                  className="w-3 h-3 rounded mr-2"
                  style={{ backgroundColor: areaColors.toilet }}
                />
                <span>Tiện ích</span>
              </div>
              <div className="flex items-center">
                <div
                  className="w-3 h-3 rounded mr-2"
                  style={{ backgroundColor: areaColors.lounge }}
                />
                <span>VIP</span>
              </div>
            </div>
          </Box>
        </Paper>
      </div>

      {/* Custom Zoom Controls */}
      <div className="zoom-controls">
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

      {/* Location Control */}
      <div className="location-control">
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

      {/* Map */}
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
      >
        {geoJsonData && (
          <>
            <MapBounds geoJsonData={geoJsonData} />
            <GeoJSON
              data={geoJsonData}
              style={geoJsonStyle}
              onEachFeature={onEachFeature}
            />
          </>
        )}

        {/* User Location Marker */}
        {userLocation && (
          <UserLocationMarker
            position={[userLocation.lat, userLocation.lng]}
            name={userLocation.name}
            accuracy={userLocation.accuracy}
          />
        )}
      </MapContainer>

      {/* Location Notification */}
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
