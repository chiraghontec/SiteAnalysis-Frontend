'use client';

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface FilterType {
  name: string;
  category: 'environmental' | 'climate' | 'terrain';
  color: string;
  enabled: boolean;
}

interface InteractiveFilterMapProps {
  coordinates: { lat: number; lng: number };
  enabledFilters: FilterType[];
  analysisData?: any;
}

const InteractiveFilterMap: React.FC<InteractiveFilterMapProps> = ({ 
  coordinates, 
  enabledFilters, 
  analysisData 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const layersRef = useRef<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    try {
      // Fix marker icons immediately
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      // Create map immediately - no async needed
      const map = L.map(mapRef.current, {
        center: [coordinates.lat, coordinates.lng],
        zoom: 13,
        zoomControl: true,
        preferCanvas: true
      });

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
        maxZoom: 18
      }).addTo(map);

      // Add main marker
      const mainMarker = L.marker([coordinates.lat, coordinates.lng])
        .addTo(map)
        .bindPopup(`
          <div style="padding: 6px; font-family: system-ui;">
            <strong>📍 Analysis Location</strong><br>
            Lat: ${coordinates.lat.toFixed(4)}<br>
            Lng: ${coordinates.lng.toFixed(4)}
          </div>
        `);

      mapInstanceRef.current = map;
      
      // Add initial features
      updateMapFeatures(map, enabledFilters, coordinates, analysisData);
      
      setIsLoading(false);
      
    } catch (err) {
      console.error('Map initialization error:', err);
      setError('Failed to load map');
      setIsLoading(false);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [coordinates]);

  // Fast filter updates
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    updateMapFeatures(mapInstanceRef.current, enabledFilters, coordinates, analysisData);
  }, [enabledFilters]);

  const updateMapFeatures = (map: any, filters: FilterType[], center: { lat: number; lng: number }, data?: any) => {
    // Clear previous feature layers quickly
    layersRef.current.forEach(layer => {
      if (map.hasLayer(layer)) {
        map.removeLayer(layer);
      }
    });
    layersRef.current = [];

    const { lat, lng } = center;

    // Add features for enabled filters
    filters.forEach((filter) => {
      const features: any[] = [];

      switch (filter.name) {
        case 'Forest':
          for (let i = 0; i < 2; i++) {
            const offset = (i - 0.5) * 0.004;
            const circle = L.circle([lat + offset, lng + offset], {
              color: filter.color,
              fillColor: filter.color,
              fillOpacity: 0.3,
              radius: 250,
              weight: 2
            }).bindPopup(`🌲 Forest Area ${i + 1}<br>Type: Mixed Forest`);
            features.push(circle);
          }
          break;

        case 'Agricultural Land':
          const polygon = L.polygon([
            [lat - 0.003, lng - 0.005],
            [lat - 0.003, lng + 0.005],
            [lat + 0.003, lng + 0.005],
            [lat + 0.003, lng - 0.005]
          ], {
            color: filter.color,
            fillColor: filter.color,
            fillOpacity: 0.2,
            weight: 2
          }).bindPopup(`🌾 Agricultural Land<br>Type: ${data?.vegetation?.vegetation_type || 'Mixed crops'}`);
          features.push(polygon);
          break;

        case 'Water Bodies':
          const water = L.circle([lat - 0.002, lng + 0.003], {
            color: filter.color,
            fillColor: filter.color,
            fillOpacity: 0.6,
            radius: 120,
            weight: 2
          }).bindPopup('💧 Water Body<br>Type: Small lake');
          features.push(water);
          break;

        case 'Urban':
          const urban = L.rectangle([
            [lat + 0.001, lng - 0.002],
            [lat + 0.003, lng + 0.001]
          ], {
            color: filter.color,
            fillColor: filter.color,
            fillOpacity: 0.4,
            weight: 2
          }).bindPopup('🏘️ Urban Area<br>Type: Residential');
          features.push(urban);
          break;

        case 'Temperature':
          if (data?.climate?.current_weather?.temperature?.current) {
            const temp = data.climate.current_weather.temperature.current;
            const tempZone = L.circle([lat + 0.002, lng - 0.002], {
              color: filter.color,
              fillColor: filter.color,
              fillOpacity: 0.2,
              radius: 150,
              weight: 2
            }).bindPopup(`🌡️ Temperature: ${temp}°C<br>Zone: ${temp > 20 ? 'Warm' : 'Cool'}`);
            features.push(tempZone);
          }
          break;

        case 'Humidity':
          if (data?.climate?.current_weather?.humidity) {
            const humidity = data.climate.current_weather.humidity;
            const humidityZone = L.circle([lat, lng], {
              color: filter.color,
              fillColor: filter.color,
              fillOpacity: 0.1,
              radius: 300,
              weight: 1
            }).bindPopup(`💨 Humidity: ${humidity}%<br>Level: ${humidity > 70 ? 'High' : 'Moderate'}`);
            features.push(humidityZone);
          }
          break;

        case 'Elevation':
          for (let i = 0; i < 2; i++) {
            const radius = 200 + (i * 100);
            const elevation = L.circle([lat, lng], {
              color: filter.color,
              fillColor: 'transparent',
              radius: radius,
              weight: 2
            }).bindPopup(`⛰️ Elevation: ${100 + (i * 50)}m`);
            features.push(elevation);
          }
          break;

        default:
          const generic = L.circleMarker([
            lat + (Math.random() - 0.5) * 0.004,
            lng + (Math.random() - 0.5) * 0.004
          ], {
            color: filter.color,
            fillColor: filter.color,
            fillOpacity: 0.8,
            radius: 6,
            weight: 2
          }).bindPopup(`${filter.name}<br>Category: ${filter.category}`);
          features.push(generic);
          break;
      }

      // Add features to map and track them
      features.forEach(feature => {
        feature.addTo(map);
        layersRef.current.push(feature);
      });
    });
  };

  if (error) {
    return (
      <div className="h-[500px] bg-red-50 rounded-lg flex items-center justify-center border border-red-200">
        <div className="text-center">
          <div className="text-red-500 mb-2">⚠️</div>
          <p className="text-red-600">{error}</p>
          <p className="text-sm text-red-500 mt-1">Please refresh the page to try again</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-[500px] bg-gradient-to-br from-blue-50 to-green-50 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-3"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 bg-blue-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="text-blue-700 font-medium">Loading Map...</p>
          <p className="text-blue-500 text-sm mt-1">Please wait a moment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        ref={mapRef}
        className="h-[500px] w-full rounded-lg overflow-hidden border"
        style={{ zIndex: 1 }}
      />
      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-md text-xs z-10 max-w-[200px]">
        <p className="font-medium mb-2">Active Filters: {enabledFilters.length}</p>
        <div className="space-y-1">
          {enabledFilters.slice(0, 4).map(filter => (
            <div key={filter.name} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded"
                style={{ backgroundColor: filter.color }}
              />
              <span className="text-xs truncate">{filter.name}</span>
            </div>
          ))}
          {enabledFilters.length > 4 && (
            <p className="text-gray-500 text-center">+{enabledFilters.length - 4} more</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InteractiveFilterMap;
