// Airport layer types and info
export interface LayerInfo {
  name: string;
  type: string;
  color: string;
}

// Layer mapping system for map-airpod.geojson
export const layerMapping: Record<string, LayerInfo> = {
  // Offices
  "OFFICE 1": { name: "Văn phòng 1", type: "office", color: "#3b82f6" },
  "OFFICE 2": { name: "Văn phòng 2", type: "office", color: "#3b82f6" },
  OFFICE3: { name: "Văn phòng 3", type: "office", color: "#3b82f6" },
  OFFICE4: { name: "Văn phòng 4", type: "office", color: "#3b82f6" },
  OFFICE5: { name: "Văn phòng 5", type: "office", color: "#3b82f6" },
  OFFICE6: { name: "Văn phòng 6", type: "office", color: "#3b82f6" },
  OFFICE7: { name: "Văn phòng 7", type: "office", color: "#3b82f6" },
  OFFICE8: { name: "Văn phòng 8", type: "office", color: "#3b82f6" },
  OFFICE9: { name: "Văn phòng 9", type: "office", color: "#3b82f6" },
  OFFICE10: { name: "Văn phòng 10", type: "office", color: "#3b82f6" },
  OFFICE11: { name: "Văn phòng 11", type: "office", color: "#3b82f6" },

  // Toilets
  WC1: { name: "Nhà vệ sinh 1", type: "toilet", color: "#ec4899" },
  WC2: { name: "Nhà vệ sinh 2", type: "toilet", color: "#ec4899" },
  WC3: { name: "Nhà vệ sinh 3", type: "toilet", color: "#ec4899" },
  WC4: { name: "Nhà vệ sinh 4", type: "toilet", color: "#ec4899" },
  WC5: { name: "Nhà vệ sinh 5", type: "toilet", color: "#ec4899" },
  WC7: { name: "Nhà vệ sinh 7", type: "toilet", color: "#ec4899" },
  WC9: { name: "Nhà vệ sinh 9", type: "toilet", color: "#ec4899" },

  // Check-in counters
  TC1: { name: "Quầy thông tin 1", type: "information", color: "#06b6d4" },
  TC2: { name: "Quầy thông tin 2", type: "information", color: "#06b6d4" },
  TC3: { name: "Quầy thông tin 3", type: "information", color: "#06b6d4" },
  TC4: { name: "Quầy thông tin 4", type: "information", color: "#06b6d4" },
  TC5: { name: "Quầy thông tin 5", type: "information", color: "#06b6d4" },
  TC6: { name: "Quầy thông tin 6", type: "information", color: "#06b6d4" },
  TC7: { name: "Quầy thông tin 7", type: "information", color: "#06b6d4" },
  TC8: { name: "Quầy thông tin 8", type: "information", color: "#06b6d4" },
  TC9: { name: "Quầy thông tin 9", type: "information", color: "#06b6d4" },
  TC10: { name: "Quầy thông tin 10", type: "information", color: "#06b6d4" },
  TC11: { name: "Quầy thông tin 11", type: "information", color: "#06b6d4" },

  // Baggage claim areas
  QNHANHLY1: { name: "Quầy nhận hành lý 1", type: "baggage", color: "#0ea5e9" },
  QNHANHLY2: { name: "Quầy nhận hành lý 2", type: "baggage", color: "#0ea5e9" },
  QNHANHLY3: { name: "Quầy nhận hành lý 3", type: "baggage", color: "#0ea5e9" },
  QNHANHLY4: { name: "Quầy nhận hành lý 4", type: "baggage", color: "#0ea5e9" },
  QNHANHLY5: { name: "Quầy nhận hành lý 5", type: "baggage", color: "#0ea5e9" },
  QNHANHLY6: { name: "Quầy nhận hành lý 6", type: "baggage", color: "#0ea5e9" },
  KHUNHANHANHLY: {
    name: "Khu nhận hành lý",
    type: "baggage",
    color: "#0ea5e9",
  },

  // Airlines and gates
  "QV VNA DG31": {
    name: "Quầy Bamboo Airways DG31",
    type: "check-in",
    color: "#10b981",
  },
  "QV VNA DG34": {
    name: "Quầy Bamboo Airways DG34",
    type: "check-in",
    color: "#10b981",
  },
  "JESTAR PACIFIC": {
    name: "Jetstar Pacific",
    type: "check-in",
    color: "#10b981",
  },

  // Services
  KLTHUTUC: { name: "Khu làm thủ tục", type: "check-in", color: "#10b981" },
  KLTHUTUC2: { name: "Khu làm thủ tục 2", type: "check-in", color: "#10b981" },
  KLTHUTUC3: { name: "Khu làm thủ tục 3", type: "check-in", color: "#10b981" },
  KLTHUTUC4: { name: "Khu làm thủ tục 4", type: "check-in", color: "#10b981" },
  KHULAMTTHANGKHONG: {
    name: "Khu làm thủ tục hàng không",
    type: "check-in",
    color: "#10b981",
  },

  // Restaurants and shops
  NHAHANG1: { name: "Nhà hàng 1", type: "restaurant", color: "#f97316" },

  // Emergency and facilities
  CAPCUU: { name: "Cấp cứu", type: "emergency", color: "#ef4444" },
  BUUDIENDG36: { name: "Bưu điện DG36", type: "service", color: "#14b8a6" },

  // Ticket counters
  QUAYVE: { name: "Quầy vé", type: "ticket", color: "#f59e0b" },
  QUAYTHUTUCHANGKHONG2: {
    name: "Quầy thủ tục hàng không 2",
    type: "check-in",
    color: "#10b981",
  },
  QUAYTHUTUCHANGKHONG3: {
    name: "Quầy thủ tục hàng không 3",
    type: "check-in",
    color: "#10b981",
  },

  // Waiting areas
  PHONGDOIKHACHDI: {
    name: "Phòng đợi khách đi",
    type: "waiting",
    color: "#a855f7",
  },
  KVLTTHANGKHONG: {
    name: "Khu vực làm thủ tục hàng không",
    type: "check-in",
    color: "#10b981",
  },

  // Technical areas
  KT1: { name: "Khu kỹ thuật 1", type: "technical", color: "#6b7280" },
  KT2: { name: "Khu kỹ thuật 2", type: "technical", color: "#6b7280" },
  KT3: { name: "Khu kỹ thuật 3", type: "technical", color: "#6b7280" },
  KT4: { name: "Khu kỹ thuật 4", type: "technical", color: "#6b7280" },
  KT5: { name: "Khu kỹ thuật 5", type: "technical", color: "#6b7280" },
  KHUKT: { name: "Khu kỹ thuật", type: "technical", color: "#6b7280" },

  // Storage and utilities
  KHO1: { name: "Kho 1", type: "storage", color: "#78716c" },
  TRAMBOMPCCC: { name: "Trạm bơm PCCC", type: "utility", color: "#78716c" },
  PMCHILLER: { name: "Phòng máy chiller", type: "utility", color: "#78716c" },
  TRAMBIENAP: { name: "Trạm biến áp", type: "utility", color: "#78716c" },

  // Lost and found
  "L&FDG24": { name: "Đồ thất lạc DG24", type: "service", color: "#14b8a6" },
  "L&FDG23": { name: "Đồ thất lạc DG23", type: "service", color: "#14b8a6" },

  // Default/structure
  DRAWDEMO: { name: "Cấu trúc", type: "structure", color: "#e5e7eb" },
  DEMODOOR: { name: "Cửa", type: "door", color: "#d1d5db" },
};

// Color scheme for legend display
export const areaColors: Record<string, string> = {
  gate: "#f59e0b", // Amber for gates
  "check-in": "#10b981", // Green for check-in
  restaurant: "#f97316", // Orange for restaurants
  "duty-free": "#8b5cf6", // Purple for duty-free
  toilet: "#ec4899", // Pink for toilets
  lounge: "#d97706", // Orange for lounges
};

// Helper function to get feature info from layer
export const getFeatureInfo = (layer: string): LayerInfo => {
  return (
    layerMapping[layer] || {
      name: layer,
      type: "default",
      color: "#6b7280",
    }
  );
};
