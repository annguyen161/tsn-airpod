import React from "react";
import { Box, Typography, Chip } from "@mui/material";
import { FeatureCollection } from "geojson";

interface SearchStatsProps {
  geoJsonData: FeatureCollection | null;
}

const SearchStats: React.FC<SearchStatsProps> = ({ geoJsonData }) => {
  const getLocationStats = () => {
    if (!geoJsonData?.features) return {};

    const stats: Record<string, number> = {};
    geoJsonData.features.forEach((feature: any) => {
      const category = feature.properties.category || "other";
      stats[category] = (stats[category] || 0) + 1;
    });

    return stats;
  };

  const stats = getLocationStats();
  const totalLocations = Object.values(stats).reduce(
    (sum, count) => sum + count,
    0
  );

  const categoryLabels: Record<string, string> = {
    "main-area": "Khu vực chính",
    gate: "Cổng bay",
    service: "Dịch vụ",
    dining: "Ăn uống",
    shopping: "Mua sắm",
    facility: "Tiện ích",
    baggage: "Hành lý",
    vip: "VIP",
    security: "An ninh",
    medical: "Y tế",
    banking: "Ngân hàng",
  };

  if (totalLocations === 0) return null;

  return (
    <Box className="mt-2 p-2 bg-gray-50 rounded">
      <Typography
        variant="caption"
        className="font-medium text-gray-700 block mb-1"
      >
        📊 Thống kê địa điểm ({totalLocations})
      </Typography>
      <Box className="flex flex-wrap gap-1">
        {Object.entries(stats).map(([category, count]) => (
          <Chip
            key={category}
            label={`${categoryLabels[category] || category}: ${count}`}
            size="small"
            variant="outlined"
            sx={{
              fontSize: "0.6rem",
              height: "18px",
              "& .MuiChip-label": {
                padding: "0 4px",
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default SearchStats;
