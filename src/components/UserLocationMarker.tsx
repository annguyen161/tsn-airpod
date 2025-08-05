import React from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";

interface UserLocationMarkerProps {
  position: [number, number];
  name: string;
  accuracy?: number;
}

// Create combined user location icon with accuracy circle
const createUserLocationIcon = (accuracy: number) => {
  // Calculate accuracy circle size
  const baseRadius = 35;
  const accuracyRadius = accuracy * 2;
  const radius = Math.max(accuracyRadius, baseRadius);
  const circleSize = radius * 2;

  return L.divIcon({
    className: "user-location-marker",
    html: `
      <!-- Accuracy Circle -->
      <div style="
        width: ${circleSize}px;
        height: ${circleSize}px;
        background-color: rgba(59, 130, 246, 0.15);
        border: 2px solid rgba(59, 130, 246, 0.4);
        border-radius: 50%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1;
      "></div>
      
      <!-- User Marker -->
      <div style="
        width: 20px;
        height: 20px;
        background-color: #ef4444;
        border: 3px solid #ffffff;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        animation: pulse 2s infinite;
        z-index: 2;
      ">
        <style>
          @keyframes pulse {
            0% {
              box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
            }
            70% {
              box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
            }
          }
        </style>
      </div>
    `,
    iconSize: [circleSize, circleSize],
    iconAnchor: [circleSize / 2, circleSize / 2],
    popupAnchor: [0, -13],
  });
};

const UserLocationMarker: React.FC<UserLocationMarkerProps> = ({
  position,
  name,
  accuracy = 15,
}) => {
  const userIcon = createUserLocationIcon(accuracy);

  return (
    <Marker position={position} icon={userIcon}>
      <Popup>
        <div className="p-2">
          <h3 className="font-bold text-lg mb-2 text-red-600">
            📍 Vị trí của bạn
          </h3>
          <p className="text-sm text-gray-700 mb-1">
            <strong>Địa điểm:</strong> {name}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Tọa độ:</strong> ({position[0].toFixed(1)},{" "}
            {position[1].toFixed(1)})
          </p>
          {accuracy > 0 && (
            <p className="text-sm text-gray-600">
              <strong>Độ chính xác:</strong> ±{accuracy}m
            </p>
          )}
          <div className="mt-2 text-xs text-blue-600">
            🕐 Cập nhật: {new Date().toLocaleTimeString("vi-VN")}
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

export default UserLocationMarker;
