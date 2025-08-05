import React, { useState, useRef, useEffect } from "react";
import { MapContainer, GeoJSON } from "react-leaflet";
import {
  Paper,
  Autocomplete,
  TextField,
  Box,
  Typography,
  Chip,
  IconButton,
  Button,
  Fab,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Add as ZoomInIcon,
  Remove as ZoomOutIcon,
  QrCodeScanner as QRIcon,
  MyLocation as GPSIcon,
  Navigation as NavigationIcon,
} from "@mui/icons-material";
import L from "leaflet";
import { FeatureCollection, Feature, Polygon } from "geojson";
import MapBounds from "./MapBounds";
import QRScanner from "./QRScanner";
import UserLocationMarker from "./UserLocationMarker";
import AdvancedSearch from "./AdvancedSearch";
import SearchStats from "./SearchStats";

// Types using standard GeoJSON types
interface FeatureProperties {
  name: string;
  id: string;
  type: string;
}

type PolygonFeature = Feature<Polygon, FeatureProperties>;

interface SearchOption {
  label: string;
  id: string;
  type: string;
  feature: PolygonFeature;
}

interface UserLocation {
  lat: number;
  lng: number;
  name: string;
  id: string;
  accuracy?: number;
  timestamp: number;
}

// Color scheme for different area types
const areaColors: Record<string, string> = {
  // Main areas
  zone: "#3b82f6", // Blue for zones

  // Gates
  gate: "#f59e0b", // Amber for gates

  // Services
  "check-in": "#10b981", // Green for check-in
  information: "#06b6d4", // Cyan for information
  security: "#ef4444", // Red for security

  // Dining
  restaurant: "#f97316", // Orange for restaurants
  cafe: "#84cc16", // Lime for cafes

  // Shopping
  "duty-free": "#8b5cf6", // Purple for duty-free
  shop: "#a855f7", // Violet for shops

  // Facilities
  toilet: "#ec4899", // Pink for toilets
  atm: "#14b8a6", // Teal for ATMs
  pharmacy: "#22c55e", // Green for pharmacy

  // Baggage & Transport
  baggage: "#0ea5e9", // Sky blue for baggage

  // VIP
  lounge: "#d97706", // Orange for lounges

  // Default
  default: "#6b7280", // Gray for others
};

const IndoorMap: React.FC = () => {
  const [selectedArea, setSelectedArea] = useState<SearchOption | null>(null);
  const [geoJsonData, setGeoJsonData] = useState<FeatureCollection | null>(
    null
  );
  const mapRef = useRef<L.Map>(null);

  // User location states
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationMessage, setLocationMessage] = useState<string | null>(null);
  const [showLocationAlert, setShowLocationAlert] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Advanced search states
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);

  // Load GeoJSON data
  useEffect(() => {
    fetch("/data/map-data.geojson")
      .then((response) => response.json())
      .then((data: FeatureCollection) => setGeoJsonData(data))
      .catch((error) => console.error("Error loading map data:", error));
  }, []);

  // Auto-detect user location on app startup
  useEffect(() => {
    const initializeUserLocation = () => {
      setIsLocating(true);
      setIsInitialLoading(true);

      // Simulate GPS delay
      setTimeout(() => {
        // Generate random location within airport bounds
        const demoLocations = [
          { lat: 285, lng: 375, name: "Khu vực chờ A", id: "waiting-a" },
          { lat: 295, lng: 395, name: "Khu vực chờ B", id: "waiting-b" },
          { lat: 275, lng: 355, name: "Hành lang chính", id: "main-hall" },
          { lat: 305, lng: 415, name: "Khu vực thương mại", id: "shopping" },
          { lat: 265, lng: 345, name: "Lối vào chính", id: "main-entrance" },
        ];

        const randomLocation =
          demoLocations[Math.floor(Math.random() * demoLocations.length)];

        const newUserLocation: UserLocation = {
          ...randomLocation,
          accuracy: Math.floor(Math.random() * 20) + 10, // 10-30m accuracy
          timestamp: Date.now(),
        };

        setUserLocation(newUserLocation);
        // setLocationMessage(`🎯 Tự động định vị thành công! Vị trí hiện tại: ${randomLocation.name}`);
        // setShowLocationAlert(true);
        setIsLocating(false);
        setIsInitialLoading(false);

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

  // Handle search selection
  const handleSearchSelect = (
    event: React.SyntheticEvent,
    value: SearchOption | null
  ) => {
    if (value && mapRef.current) {
      const map = mapRef.current;
      const feature = value.feature;

      // Calculate bounds for the selected feature
      if (feature.geometry.type === "Polygon") {
        const coordinates = feature.geometry.coordinates[0];
        const latLngs: [number, number][] = coordinates.map((coord) => [
          coord[1],
          coord[0],
        ]);
        const bounds = L.latLngBounds(latLngs);

        // Fit map to feature bounds
        map.fitBounds(bounds, { padding: [50, 50] });

        // Set selected area for popup
        setSelectedArea(value);
      }
    }
  };

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

  // Handle QR code location detection
  const handleQRLocationDetected = (location: {
    lat: number;
    lng: number;
    name: string;
    id: string;
  }) => {
    const newUserLocation: UserLocation = {
      ...location,
      accuracy: 5, // High accuracy for QR code detection
      timestamp: Date.now(),
    };

    setUserLocation(newUserLocation);
    setLocationMessage(`Đã xác định vị trí tại: ${location.name}`);
    setShowLocationAlert(true);

    // Center map on user location
    if (mapRef.current) {
      mapRef.current.setView([location.lat, location.lng], 3);
    }
  };

  // Simulate GPS location (for demo)
  const handleGPSLocation = () => {
    setIsLocating(true);

    // Simulate GPS delay
    setTimeout(() => {
      // Generate random location within airport bounds
      const demoLocations = [
        { lat: 285, lng: 375, name: "Khu vực chờ A", id: "waiting-a" },
        { lat: 295, lng: 395, name: "Khu vực chờ B", id: "waiting-b" },
        { lat: 275, lng: 355, name: "Hành lang chính", id: "main-hall" },
        { lat: 305, lng: 415, name: "Khu vực thương mại", id: "shopping" },
        { lat: 265, lng: 345, name: "Lối vào chính", id: "main-entrance" },
      ];

      const randomLocation =
        demoLocations[Math.floor(Math.random() * demoLocations.length)];

      const newUserLocation: UserLocation = {
        ...randomLocation,
        accuracy: Math.floor(Math.random() * 20) + 10, // 10-30m accuracy
        timestamp: Date.now(),
      };

      setUserLocation(newUserLocation);
      setLocationMessage(`GPS đã xác định vị trí tại: ${randomLocation.name}`);
      setShowLocationAlert(true);
      setIsLocating(false);

      // Center map on user location
      if (mapRef.current) {
        mapRef.current.setView([randomLocation.lat, randomLocation.lng], 3);
      }
    }, 2000);
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

  // Handle advanced search location selection
  const handleAdvancedSearchSelect = (option: any) => {
    if (option && mapRef.current) {
      const map = mapRef.current;
      const feature = option.feature;

      // Calculate bounds for the selected feature
      if (feature.geometry.type === "Polygon") {
        const coordinates = feature.geometry.coordinates[0];
        const latLngs: [number, number][] = coordinates.map(
          (coord: number[]) => [coord[1], coord[0]]
        );
        const bounds = L.latLngBounds(latLngs);

        // Fit map to feature bounds
        map.fitBounds(bounds, { padding: [50, 50] });

        // Set selected area for popup
        setSelectedArea({
          label: option.label,
          id: option.id,
          type: option.type,
          feature: option.feature,
        });
      }
    }

    setLocationMessage(`Đã tìm thấy: ${option.label}`);
    setShowLocationAlert(true);
  };

  // Style function for GeoJSON features
  const geoJsonStyle = (feature?: Feature): L.PathOptions => {
    const type = feature?.properties?.type || "default";
    const color = areaColors[type] || areaColors.default;

    return {
      fillColor: color,
      weight: 2,
      opacity: 1,
      color: "#ffffff",
      dashArray: "",
      fillOpacity: 0.7,
    };
  };

  // Handle feature click
  const onEachFeature = (feature: Feature, layer: L.Layer) => {
    layer.on({
      click: (e: L.LeafletMouseEvent) => {
        const popupContent = `
          <div class="p-2">
            <h3 class="font-bold text-lg mb-2">${feature.properties?.name}</h3>
            <p class="text-sm text-gray-600 mb-1">Type: ${feature.properties?.type}</p>
            <p class="text-sm text-gray-600">ID: ${feature.properties?.id}</p>
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
        layer.setStyle({
          weight: 2,
          fillOpacity: 0.7,
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

          <Button
            variant="outlined"
            fullWidth
            startIcon={<SearchIcon />}
            onClick={() => setIsAdvancedSearchOpen(true)}
            sx={{
              justifyContent: "flex-start",
              padding: "12px 16px",
              textTransform: "none",
              color: "#6b7280",
              borderColor: "#d1d5db",
              "&:hover": {
                borderColor: "#3b82f6",
                backgroundColor: "#f3f4f6",
              },
            }}
          >
            Tìm kiếm địa điểm...
          </Button>

          {/* Legend */}
          <Box className="mt-3">
            <Typography
              variant="body2"
              className="font-medium mb-2 text-gray-700"
            >
              Chú thích:
            </Typography>
            <div className="grid grid-cols-1 gap-1 text-xs">
              {/* Main Categories */}
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

          {/* Search Statistics */}
          {/* <SearchStats geoJsonData={geoJsonData} /> */}
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

      {/* Location Controls */}
      <div className="location-controls">
        <Paper
          elevation={2}
          className="bg-white/95 backdrop-blur-sm p-3"
          sx={{ borderRadius: 2 }}
        >
          <Typography
            variant="subtitle2"
            className="font-semibold mb-2 text-gray-700"
          >
            Định vị
          </Typography>

          <div className="space-y-2">
            <Tooltip title="Quét QR code để xác định vị trí">
              <Button
                variant="outlined"
                size="small"
                startIcon={<QRIcon />}
                onClick={() => setIsQRScannerOpen(true)}
                fullWidth
                sx={{ justifyContent: "flex-start" }}
              >
                QR Code
              </Button>
            </Tooltip>

            <Tooltip title="Sử dụng GPS để xác định vị trí (Demo)">
              <Button
                variant="outlined"
                size="small"
                startIcon={<GPSIcon />}
                onClick={handleGPSLocation}
                disabled={isLocating}
                fullWidth
                sx={{ justifyContent: "flex-start" }}
              >
                {isLocating ? "Đang định vị..." : "GPS"}
              </Button>
            </Tooltip>

            {userLocation && (
              <>
                <Tooltip title="Di chuyển đến vị trí của bạn">
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<NavigationIcon />}
                    onClick={handleGoToUserLocation}
                    fullWidth
                    color="primary"
                    sx={{ justifyContent: "flex-start" }}
                  >
                    Về vị trí
                  </Button>
                </Tooltip>
              </>
            )}
          </div>

          {userLocation && (
            <Box className="mt-3 p-2 bg-blue-50 rounded">
              <Typography
                variant="caption"
                className="font-medium text-blue-800"
              >
                📍 Vị trí hiện tại:
              </Typography>
              <Typography variant="caption" className="block text-blue-700">
                {userLocation.name}
              </Typography>
              <Typography variant="caption" className="block text-blue-600">
                Độ chính xác: ±{userLocation.accuracy || 0}m
              </Typography>
            </Box>
          )}
        </Paper>
      </div>

      {/* Map */}
      <MapContainer
        center={[300, 400] as L.LatLngExpression}
        zoom={1}
        className="h-full w-full"
        ref={mapRef}
        zoomControl={false}
        attributionControl={false}
        crs={L.CRS.Simple}
        minZoom={0}
        maxZoom={5}
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

      {/* QR Scanner Dialog */}
      <QRScanner
        open={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
        onLocationDetected={handleQRLocationDetected}
      />

      {/* Advanced Search Dialog */}
      <AdvancedSearch
        open={isAdvancedSearchOpen}
        onClose={() => setIsAdvancedSearchOpen(false)}
        geoJsonData={geoJsonData}
        onLocationSelect={handleAdvancedSearchSelect}
      />

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
