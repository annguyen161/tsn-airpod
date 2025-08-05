import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Box,
  Typography,
  Chip,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  IconButton,
  InputAdornment,
  Badge,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Tooltip,
} from "@mui/material";
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  FlightTakeoff as GateIcon,
  Restaurant as RestaurantIcon,
  Coffee as CafeIcon,
  Wc as ToiletIcon,
  LocalMall as ShoppingIcon,
  Security as SecurityIcon,
  Luggage as BaggageIcon,
  Info as InfoIcon,
  LocalHospital as MedicalIcon,
  AccountBalance as BankingIcon,
  StarBorder as VIPIcon,
  Business as ServiceIcon,
  Home as ZoneIcon,
  ExpandMore as ExpandMoreIcon,
  History as HistoryIcon,
  Favorite as FavoriteIcon,
  TrendingUp as TrendingIcon,
  FilterList as FilterIcon,
} from "@mui/icons-material";
import { FeatureCollection, Feature, Polygon } from "geojson";

interface FeatureProperties {
  name: string;
  nameEn?: string;
  id: string;
  type: string;
  description?: string;
  floor?: string;
  category?: string;
  [key: string]: any;
}

type PolygonFeature = Feature<Polygon, FeatureProperties>;

interface SearchOption {
  label: string;
  id: string;
  type: string;
  category: string;
  description: string;
  floor: string;
  feature: PolygonFeature;
}

interface CategoryInfo {
  key: string;
  name: string;
  icon: React.ReactElement;
  color: string;
  types: string[];
}

interface AdvancedSearchProps {
  open: boolean;
  onClose: () => void;
  geoJsonData: FeatureCollection | null;
  onLocationSelect: (option: SearchOption) => void;
}

// Categories definition with icons and colors
const categories: CategoryInfo[] = [
  {
    key: "all",
    name: "Tất cả",
    icon: <SearchIcon />,
    color: "#6b7280",
    types: [],
  },
  {
    key: "gate",
    name: "Cổng bay",
    icon: <GateIcon />,
    color: "#3b82f6",
    types: ["gate"],
  },
  {
    key: "service",
    name: "Dịch vụ",
    icon: <ServiceIcon />,
    color: "#10b981",
    types: ["check-in", "information", "security"],
  },
  {
    key: "dining",
    name: "Ăn uống",
    icon: <RestaurantIcon />,
    color: "#f59e0b",
    types: ["restaurant", "cafe"],
  },
  {
    key: "shopping",
    name: "Mua sắm",
    icon: <ShoppingIcon />,
    color: "#8b5cf6",
    types: ["duty-free", "shop"],
  },
  {
    key: "facility",
    name: "Tiện ích",
    icon: <ToiletIcon />,
    color: "#ef4444",
    types: ["toilet", "atm", "pharmacy"],
  },
  {
    key: "baggage",
    name: "Hành lý",
    icon: <BaggageIcon />,
    color: "#06b6d4",
    types: ["baggage"],
  },
  {
    key: "vip",
    name: "VIP",
    icon: <VIPIcon />,
    color: "#d97706",
    types: ["lounge"],
  },
];

// Quick search suggestions
const quickSearches = [
  { text: "Cổng A1", category: "gate" },
  { text: "Check-in", category: "service" },
  { text: "Nhà vệ sinh", category: "facility" },
  { text: "Cà phê", category: "dining" },
  { text: "Miễn thuế", category: "shopping" },
  { text: "Hành lý", category: "baggage" },
  { text: "VIP Lounge", category: "vip" },
  { text: "ATM", category: "facility" },
];

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  open,
  onClose,
  geoJsonData,
  onLocationSelect,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchResults, setSearchResults] = useState<SearchOption[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Create search options from GeoJSON features
  const allOptions: SearchOption[] =
    geoJsonData?.features?.map((feature: any) => ({
      label: feature.properties.name,
      id: feature.properties.id,
      type: feature.properties.type,
      category: feature.properties.category || "other",
      description: feature.properties.description || "",
      floor: feature.properties.floor || "",
      feature: feature as PolygonFeature,
    })) || [];

  // Filter and search logic
  useEffect(() => {
    let filtered = allOptions;

    // Filter by category
    if (selectedCategory !== "all") {
      const categoryInfo = categories.find(
        (cat) => cat.key === selectedCategory
      );
      if (categoryInfo) {
        filtered = filtered.filter((option) =>
          categoryInfo.types.includes(option.type)
        );
      }
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (option) =>
          option.label.toLowerCase().includes(query) ||
          option.description.toLowerCase().includes(query) ||
          option.type.toLowerCase().includes(query) ||
          option.feature.properties.nameEn?.toLowerCase().includes(query)
      );
    }

    setSearchResults(filtered);
  }, [searchQuery, selectedCategory, geoJsonData]);

  // Load saved data from localStorage
  useEffect(() => {
    const savedRecent = localStorage.getItem("recent-searches");
    const savedFavorites = localStorage.getItem("favorite-locations");

    if (savedRecent) {
      setRecentSearches(JSON.parse(savedRecent));
    }
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const handleLocationSelect = (option: SearchOption) => {
    // Add to recent searches
    const newRecent = [
      option.label,
      ...recentSearches.filter((item) => item !== option.label),
    ].slice(0, 5);
    setRecentSearches(newRecent);
    localStorage.setItem("recent-searches", JSON.stringify(newRecent));

    onLocationSelect(option);
    onClose();
  };

  const handleQuickSearch = (query: string) => {
    setSearchQuery(query);
  };

  const toggleFavorite = (locationId: string) => {
    const newFavorites = favorites.includes(locationId)
      ? favorites.filter((id) => id !== locationId)
      : [...favorites, locationId];

    setFavorites(newFavorites);
    localStorage.setItem("favorite-locations", JSON.stringify(newFavorites));
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSelectedCategory("all");
  };

  const getCategoryIcon = (type: string) => {
    switch (type) {
      case "gate":
        return <GateIcon fontSize="small" />;
      case "check-in":
        return <ServiceIcon fontSize="small" />;
      case "restaurant":
        return <RestaurantIcon fontSize="small" />;
      case "cafe":
        return <CafeIcon fontSize="small" />;
      case "toilet":
        return <ToiletIcon fontSize="small" />;
      case "duty-free":
      case "shop":
        return <ShoppingIcon fontSize="small" />;
      case "security":
        return <SecurityIcon fontSize="small" />;
      case "baggage":
        return <BaggageIcon fontSize="small" />;
      case "information":
        return <InfoIcon fontSize="small" />;
      case "pharmacy":
        return <MedicalIcon fontSize="small" />;
      case "atm":
        return <BankingIcon fontSize="small" />;
      case "lounge":
        return <VIPIcon fontSize="small" />;
      default:
        return <ZoneIcon fontSize="small" />;
    }
  };

  const getResultCount = (categoryKey: string) => {
    if (categoryKey === "all") return allOptions.length;
    const categoryInfo = categories.find((cat) => cat.key === categoryKey);
    return categoryInfo
      ? allOptions.filter((opt) => categoryInfo.types.includes(opt.type)).length
      : 0;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box className="flex items-center justify-between">
          <Box className="flex items-center">
            <SearchIcon className="mr-2" />
            <Typography variant="h6">Tìm kiếm địa điểm</Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <ClearIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {/* Search Input */}
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Tìm kiếm cổng bay, nhà hàng, cửa hàng..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton onClick={clearSearch} size="small">
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          className="mb-4"
        />

        {/* Quick Search Suggestions */}
        {/* <Box className="my-4">
          <Typography variant="subtitle2" className="mb-2 flex items-center">
            <TrendingIcon fontSize="small" className="mr-1" />
            Tìm kiếm nhanh:
          </Typography>
          <Box className="flex flex-wrap gap-1">
            {quickSearches.map((item, index) => (
              <Chip
                key={index}
                label={item.text}
                size="small"
                variant="outlined"
                onClick={() => handleQuickSearch(item.text)}
                className="cursor-pointer hover:bg-blue-50"
              />
            ))}
          </Box>
        </Box> */}

        {/* Category Tabs */}
        <Box className="my-4">
          <Tabs
            value={selectedCategory}
            onChange={(e, newValue) => setSelectedCategory(newValue)}
            variant="fullWidth"
            centered
          >
            {categories.map((category) => (
              <Tab
                key={category.key}
                value={category.key}
                icon={category.icon}
                label={category.name}
                iconPosition="start"
                sx={{ minHeight: 60 }}
              />
            ))}
          </Tabs>
        </Box>

        {/* Recent Searches & Favorites */}
        {!searchQuery && (
          <Box className="mb-4">
            {recentSearches.length > 0 && (
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle2" className="flex items-center">
                    <HistoryIcon fontSize="small" className="mr-1" />
                    Tìm kiếm gần đây ({recentSearches.length})
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box className="flex flex-wrap gap-1">
                    {recentSearches.map((search, index) => (
                      <Chip
                        key={index}
                        label={search}
                        size="small"
                        onClick={() => setSearchQuery(search)}
                        className="cursor-pointer"
                      />
                    ))}
                  </Box>
                </AccordionDetails>
              </Accordion>
            )}
          </Box>
        )}

        {/* Search Results */}
        <Box>
          <Typography
            variant="subtitle2"
            className="mb-2 flex items-center justify-between"
          >
            <span>
              <FilterIcon fontSize="small" className="mr-1" />
              Kết quả ({searchResults.length})
            </span>
            {searchQuery && (
              <Button size="small" onClick={clearSearch}>
                Xóa bộ lọc
              </Button>
            )}
          </Typography>

          <List className="max-h-96 overflow-y-auto">
            {searchResults.map((option) => (
              <React.Fragment key={option.id}>
                <ListItemButton
                  onClick={() => handleLocationSelect(option)}
                  className="hover:bg-blue-50"
                >
                  <ListItemIcon>{getCategoryIcon(option.type)}</ListItemIcon>
                  <ListItemText
                    primary={
                      <Box className="flex items-center justify-between">
                        <Typography variant="body1" className="font-medium">
                          {option.label}
                        </Typography>
                        <Box className="flex items-center gap-1">
                          <Chip
                            label={option.floor}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: "0.7rem", height: "20px" }}
                          />
                          <Tooltip
                            title={
                              favorites.includes(option.id)
                                ? "Bỏ yêu thích"
                                : "Thêm vào yêu thích"
                            }
                          >
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(option.id);
                              }}
                            >
                              <FavoriteIcon
                                fontSize="small"
                                sx={{
                                  color: favorites.includes(option.id)
                                    ? "#ef4444"
                                    : "#d1d5db",
                                }}
                              />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        {option.description}
                      </Typography>
                    }
                  />
                </ListItemButton>
                <Divider />
              </React.Fragment>
            ))}

            {searchResults.length === 0 && searchQuery && (
              <Box className="text-center py-8">
                <Typography color="text.secondary">
                  Không tìm thấy kết quả nào cho "{searchQuery}"
                </Typography>
                <Button
                  onClick={clearSearch}
                  variant="outlined"
                  size="small"
                  className="mt-2"
                >
                  Xóa tìm kiếm
                </Button>
              </Box>
            )}
          </List>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AdvancedSearch;
