import React, { useRef, useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";
import { QrCodeScanner as QRIcon } from "@mui/icons-material";

interface QRScannerProps {
  open: boolean;
  onClose: () => void;
  onLocationDetected: (location: {
    lat: number;
    lng: number;
    name: string;
    id: string;
  }) => void;
}

// Demo QR codes with predefined locations in the airport
const demoQRLocations: Record<
  string,
  { lat: number; lng: number; name: string; id: string }
> = {
  TSN_GATE_A1: { lat: 280, lng: 350, name: "Gate A1", id: "gate-a1" },
  TSN_GATE_B2: { lat: 320, lng: 450, name: "Gate B2", id: "gate-b2" },
  TSN_CHECKIN_1: {
    lat: 250,
    lng: 300,
    name: "Check-in Counter 1",
    id: "checkin-1",
  },
  TSN_TOILET_1: {
    lat: 290,
    lng: 380,
    name: "Toilet - Terminal 1",
    id: "toilet-1",
  },
  TSN_CAFE_1: { lat: 310, lng: 420, name: "Coffee Shop", id: "cafe-1" },
  TSN_SECURITY: {
    lat: 270,
    lng: 360,
    name: "Security Checkpoint",
    id: "security-1",
  },
  TSN_BAGGAGE: { lat: 240, lng: 320, name: "Baggage Claim", id: "baggage-1" },
  TSN_INFO: { lat: 300, lng: 400, name: "Information Desk", id: "info-1" },
};

const QRScanner: React.FC<QRScannerProps> = ({
  open,
  onClose,
  onLocationDetected,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scanner, setScanner] = useState<Html5QrcodeScanner | null>(null);
  const scannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && !scanner) {
      setIsScanning(true);
      setError(null);

      const newScanner = new Html5QrcodeScanner(
        "qr-reader",
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        false
      );

      newScanner.render(
        (decodedText) => {
          // Handle successful scan
          handleScanSuccess(decodedText);
          newScanner.clear();
          setScanner(null);
        },
        (error) => {
          // Handle scan error (can be ignored for continuous scanning)
          console.log("Scan error:", error);
        }
      );

      setScanner(newScanner);
    }

    return () => {
      if (scanner) {
        scanner.clear();
        setScanner(null);
      }
    };
  }, [open]);

  const handleScanSuccess = (decodedText: string) => {
    setIsScanning(false);

    // Check if it's a demo QR code
    const location = demoQRLocations[decodedText];

    if (location) {
      onLocationDetected(location);
      onClose();
    } else {
      setError(
        `QR code không hợp lệ: ${decodedText}. Vui lòng thử lại với QR code của sân bay.`
      );
    }
  };

  const handleClose = () => {
    if (scanner) {
      scanner.clear();
      setScanner(null);
    }
    setIsScanning(false);
    setError(null);
    onClose();
  };

  const handleDemoLocation = (locationKey: string) => {
    const location = demoQRLocations[locationKey];
    if (location) {
      onLocationDetected(location);
      handleClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle className="flex items-center">
        <QRIcon className="mr-2" />
        Quét QR Code để xác định vị trí
      </DialogTitle>

      <DialogContent>
        <Box className="mb-4">
          <Typography variant="body2" color="text.secondary" className="mb-2">
            Quét QR code tại các vị trí trong sân bay để xác định vị trí hiện
            tại của bạn.
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" className="mb-3">
            {error}
          </Alert>
        )}

        {isScanning && (
          <Box className="flex justify-center items-center mb-3">
            <CircularProgress size={24} className="mr-2" />
            <Typography variant="body2">Đang khởi động camera...</Typography>
          </Box>
        )}

        <div id="qr-reader" className="w-full mb-4"></div>

        {/* Demo QR Codes Section */}
        <Box className="mt-4">
          <Typography variant="subtitle2" className="mb-2 font-semibold">
            Demo QR Codes (Chọn vị trí):
          </Typography>
          <Box className="grid grid-cols-2 gap-2">
            {Object.entries(demoQRLocations).map(([key, location]) => (
              <Button
                key={key}
                variant="outlined"
                size="small"
                onClick={() => handleDemoLocation(key)}
                className="text-xs p-2"
              >
                {location.name}
              </Button>
            ))}
          </Box>
          <Typography
            variant="caption"
            color="text.secondary"
            className="mt-2 block"
          >
            * Trong thực tế, bạn sẽ quét QR code thực tế tại các vị trí này
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
};

export default QRScanner;
