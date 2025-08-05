// Location interface
export interface Location {
  lat: number;
  lng: number;
  name: string;
  id: string;
}

// Demo QR codes with predefined locations in the airport
export const demoQRLocations: Record<string, Location> = {
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

// Demo user locations for auto-detection simulation
export const demoUserLocations: Location[] = [
  { lat: 110, lng: 150, name: "Quầy thông tin 1", id: "TC1" },
  { lat: 108, lng: 200, name: "Nhà vệ sinh 1", id: "WC1" },
  { lat: 105, lng: 180, name: "Khu làm thủ tục", id: "KLTHUTUC" },
  {
    lat: 115,
    lng: 220,
    name: "Quầy nhận hành lý 1",
    id: "QNHANHLY1",
  },
  {
    lat: 112,
    lng: 250,
    name: "Phòng đợi khách đi",
    id: "PHONGDOIKHACHDI",
  },
];
