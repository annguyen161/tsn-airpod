# Tân Sơn Nhất Airport - Indoor Map Demo

A modern React-based indoor navigation map for Tân Sơn Nhất Airport using vector-based GeoJSON data.

## 🚀 Features

- **Vector-based Map**: Uses GeoJSON polygons instead of background images
- **Interactive Search**: Search and navigate to specific locations (gates, facilities, etc.)
- **Color-coded Areas**: Different colors for zones, facilities, gates, and toilets
- **Click Interactions**: Click on areas for detailed information
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean interface with Material-UI components and Tailwind CSS

## 🛠️ Tech Stack

- **React 18** - Modern frontend framework
- **Vite** - Fast build tool and development server
- **react-leaflet** - React components for Leaflet maps
- **Material-UI (MUI)** - UI components (search, popups, etc.)
- **Tailwind CSS** - Utility-first CSS framework
- **Leaflet** - Interactive map library

## 📦 Installation & Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start development server:**

   ```bash
   npm run dev
   ```

3. **Open your browser:**
   - Navigate to `http://localhost:3000`
   - The application should load with the indoor map

## 🗺️ Map Data Structure

The map uses GeoJSON format located in `/data/map-data.geojson` with the following structure:

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "id": "unique-id",
        "name": "Display Name",
        "type": "zone|facility|gate|toilet"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[x1, y1], [x2, y2], ...]]
      }
    }
  ]
}
```

## 🎯 How to Use

1. **Search**: Use the search box in the top-left to find specific locations
2. **Browse**: Click on colored areas to view detailed information
3. **Navigate**: The map will automatically zoom to searched locations
4. **Legend**: Check the color legend to understand area types

## 🎨 Area Color Coding

- **Blue** - Zones (Arrival Hall, Departure Hall)
- **Green** - Facilities (Check-in Zone)
- **Amber** - Gates (Gate A1, etc.)
- **Purple** - Toilets and amenities

## 📱 Responsive Design

The application is fully responsive and works on:

- Desktop computers
- Tablets
- Mobile phones

## 🔧 Development

### Adding New Areas

To add new areas to the map:

1. Edit `/data/map-data.geojson`
2. Add a new feature with appropriate properties and coordinates
3. The application will automatically load the new data

### Customizing Colors

Edit the `areaColors` object in `/src/components/IndoorMap.jsx`:

```javascript
const areaColors = {
  zone: "#3b82f6", // Blue
  facility: "#10b981", // Green
  gate: "#f59e0b", // Amber
  toilet: "#8b5cf6", // Purple
  default: "#6b7280", // Gray
};
```

## 📄 Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment.

---

Built with ❤️ for Tân Sơn Nhất Airport indoor navigation.
