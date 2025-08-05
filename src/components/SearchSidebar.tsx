import React, { useState, useMemo } from "react";
import {
  Box,
  Paper,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Chip,
  Typography,
  IconButton,
  Fab,
} from "@mui/material";
import {
  Search as SearchIcon,
  Business as OfficeIcon,
  Restaurant as RestaurantIcon,
  Wc as ToiletIcon,
  LocalAirport as AirportIcon,
  Store as ServiceIcon,
  LocalHospital as EmergencyIcon,
  Build as TechnicalIcon,
  LocationOn as LocationIcon,
  ChevronLeft,
  Clear as ClearIcon,
} from "@mui/icons-material";
import { layerMapping } from "../contants/airportLayers";

// Category definitions based on the screenshots
interface Category {
  id: string;
  name: string;
  icon: React.ReactElement;
  color: string;
  types: string[];
}

const categories: Category[] = [
  {
    id: "check-in",
    name: "Check-in & Thủ tục",
    icon: <AirportIcon />,
    color: "#10b981",
    types: ["check-in", "ticket", "information"],
  },
  {
    id: "dining",
    name: "Ăn uống",
    icon: <RestaurantIcon />,
    color: "#f97316",
    types: ["restaurant"],
  },
  {
    id: "services",
    name: "Dịch vụ",
    icon: <ServiceIcon />,
    color: "#14b8a6",
    types: ["service", "baggage"],
  },
  {
    id: "facilities",
    name: "Tiện ích",
    icon: <ToiletIcon />,
    color: "#ec4899",
    types: ["toilet", "waiting"],
  },
  {
    id: "offices",
    name: "Văn phòng",
    icon: <OfficeIcon />,
    color: "#3b82f6",
    types: ["office"],
  },
  {
    id: "emergency",
    name: "Cấp cứu",
    icon: <EmergencyIcon />,
    color: "#ef4444",
    types: ["emergency"],
  },
  {
    id: "technical",
    name: "Khu kỹ thuật",
    icon: <TechnicalIcon />,
    color: "#6b7280",
    types: ["technical", "utility", "storage"],
  },
];

interface LocationItem {
  id: string;
  name: string;
  type: string;
  category: string;
  layer: string;
  color: string;
}

interface SearchSidebarProps {
  onLocationSelect?: (location: LocationItem) => void;
  onCategoryFilter?: (category: string | null) => void;
  selectedCategory?: string | null;
}

const SearchSidebar: React.FC<SearchSidebarProps> = ({
  onLocationSelect,
  onCategoryFilter,
  selectedCategory,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(true); // Start collapsed

  // Convert layerMapping to searchable locations
  const locations: LocationItem[] = useMemo(() => {
    return Object.entries(layerMapping).map(([layer, info]) => {
      const category = categories.find((cat) => cat.types.includes(info.type));
      return {
        id: layer,
        name: info.name,
        type: info.type,
        category: category?.id || "other",
        layer,
        color: info.color,
      };
    });
  }, []);

  // Filter locations based on search query and selected category
  const filteredLocations = useMemo(() => {
    let filtered = locations;

    if (selectedCategory) {
      filtered = filtered.filter((loc) => loc.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (loc) =>
          loc.name.toLowerCase().includes(query) ||
          loc.type.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [locations, searchQuery, selectedCategory]);

  // Get count for each category
  const getCategoryCount = (categoryId: string) => {
    return locations.filter((loc) => loc.category === categoryId).length;
  };

  const handleCategoryClick = (categoryId: string) => {
    const newCategory = selectedCategory === categoryId ? null : categoryId;
    onCategoryFilter?.(newCategory);
  };

  const clearSearch = () => {
    setSearchQuery("");
    onCategoryFilter?.(null);
  };

  return (
    <>
      {/* Floating Search Button - Only show when collapsed */}
      {isCollapsed && (
        <Fab
          color="primary"
          size="medium"
          onClick={() => setIsCollapsed(false)}
          sx={{
            position: "fixed",
            top: 24,
            left: 24,
            zIndex: 1001,
            backgroundColor: "#f3f4f6",
            "&:hover": {
              backgroundColor: "#e5e7eb",
            },
          }}
        >
          <SearchIcon sx={{ color: "#6f7071" }} />
        </Fab>
      )}

      {/* Main Sidebar - Only show when not collapsed */}
      {!isCollapsed && (
        <Paper
          elevation={3}
          sx={{
            width: 320,
            height: "calc(100vh - 32px)",
            position: "fixed",
            left: 16,
            top: 16,
            zIndex: 1000,
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            transition: "all 0.3s ease",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <Box sx={{ p: 2, borderBottom: "1px solid #e5e7eb", flexShrink: 0 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton
                size="small"
                onClick={() => setIsCollapsed(true)}
                sx={{
                  padding: "6px",
                  "&:hover": { backgroundColor: "#f3f4f6" },
                }}
              >
                <ChevronLeft />
              </IconButton>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, fontSize: "1.1rem" }}
              >
                Tìm kiếm địa điểm
              </Typography>
            </Box>
          </Box>

          {/* Search Bar */}
          <Box sx={{ p: 2, borderBottom: "1px solid #e5e7eb", flexShrink: 0 }}>
            <TextField
              fullWidth
              placeholder="Tìm kiếm địa điểm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: (searchQuery || selectedCategory) && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={clearSearch}>
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              size="small"
            />
          </Box>

          {/* Categories and Results */}
          <Box sx={{ flexGrow: 1, overflow: "auto" }}>
            {!searchQuery && (
              <Box sx={{ p: 1 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ px: 2, py: 1, color: "text.secondary" }}
                >
                  Danh mục
                </Typography>
                <List dense>
                  {categories.map((category) => (
                    <ListItem key={category.id} disablePadding>
                      <ListItemButton
                        onClick={() => handleCategoryClick(category.id)}
                        selected={selectedCategory === category.id}
                        sx={{
                          borderRadius: 1,
                          mx: 1,
                          mb: 0.5,
                          "&.Mui-selected": {
                            backgroundColor: `${category.color}20`,
                            "&:hover": {
                              backgroundColor: `${category.color}30`,
                            },
                          },
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            color: category.color,
                            minWidth: 40,
                          }}
                        >
                          {category.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={category.name}
                          sx={{
                            "& .MuiListItemText-primary": {
                              fontSize: "0.9rem",
                            },
                          }}
                        />
                        <Chip
                          label={getCategoryCount(category.id)}
                          size="small"
                          sx={{
                            backgroundColor: category.color,
                            color: "white",
                            fontSize: "0.75rem",
                            height: 20,
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            {/* Search Results */}
            {(searchQuery || selectedCategory) && (
              <Box sx={{ p: 1 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ px: 2, py: 1, color: "text.secondary" }}
                >
                  Kết quả ({filteredLocations.length})
                </Typography>
                <List dense>
                  {filteredLocations.map((location) => (
                    <ListItem key={location.id} disablePadding>
                      <ListItemButton
                        onClick={() => onLocationSelect?.(location)}
                        sx={{
                          borderRadius: 1,
                          mx: 1,
                          mb: 0.5,
                          "&:hover": {
                            backgroundColor: `${location.color}20`,
                          },
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            color: location.color,
                            minWidth: 40,
                          }}
                        >
                          <LocationIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={location.name}
                          secondary={location.type}
                          sx={{
                            "& .MuiListItemText-primary": {
                              fontSize: "0.9rem",
                            },
                            "& .MuiListItemText-secondary": {
                              fontSize: "0.75rem",
                            },
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                  {filteredLocations.length === 0 && (
                    <Box sx={{ p: 2, textAlign: "center" }}>
                      <Typography variant="body2" color="text.secondary">
                        Không tìm thấy kết quả
                      </Typography>
                    </Box>
                  )}
                </List>
              </Box>
            )}
          </Box>
        </Paper>
      )}
    </>
  );
};

export default SearchSidebar;
