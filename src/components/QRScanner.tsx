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
import { demoQRLocations } from "../contants";

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
          handleScanSuccess(decodedText);
          newScanner.clear();
          setScanner(null);
        },
        (error) => {
          // Scan errors can be ignored for continuous scanning
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
