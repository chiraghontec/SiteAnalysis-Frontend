'use client';

import React, { useEffect, useRef, useState } from 'react';

// Import Leaflet types
interface LatLng {
  lat: number;
  lng: number;
}

export interface FilterType {
  name: string;
  category: 'environmental' | 'climate' | 'terrain';
  color: string;
  enabled: boolean;
}

interface FilteredMapProps {
  coordinates: LatLng;
  enabledFilters: FilterType[];
  analysisData?: any;
}

const FilteredMap: React.FC<FilteredMapProps> = ({ coordinates, enabledFilters, analysisData }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const layersRef = useRef<{ [key: string]: any }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  // Dynamic import of Leaflet
  useEffect(() => {
    const loadLeaflet = async () => {
      try {
        const L = await import('leaflet');
        
        // Load CSS dynamically
        if (typeof window !== 'undefined' && !document.querySelector('link[href*="leaflet.css"]')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(link);
        }
        
        // Fix for default markers in Leaflet
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });
        
        setLeafletLoaded(true);
        return L;
      } catch (error) {
        console.error('Failed to load Leaflet:', error);
        setIsLoading(false);
        return null;
      }
    };

    loadLeaflet();
  }, []);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current || !leafletLoaded) return;

    const initializeMap = async () => {
      try {
        const L = await import('leaflet');
        
        // Initialize map
        const map = L.map(mapRef.current!).setView([coordinates.lat, coordinates.lng], 13);

        // Add base tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Add main location marker
        const mainMarker = L.marker([coordinates.lat, coordinates.lng])
          .addTo(map)
          .bindPopup(`
            <div style="padding: 8px;">
              <h3 style="font-weight: bold; margin: 0 0 4px 0;">Analysis Location</h3>
              <p style="margin: 2px 0; font-size: 12px;">Lat: ${coordinates.lat.toFixed(4)}</p>
              <p style="margin: 2px 0; font-size: 12px;">Lng: ${coordinates.lng.toFixed(4)}</p>
            </div>
          `);

        mapInstanceRef.current = map;
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to initialize map:', error);
        setIsLoading(false);
      }
    };

    initializeMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [coordinates, leafletLoaded]);

  useEffect(() => {
    if (!mapInstanceRef.current || !leafletLoaded) return;

    const updateLayers = async () => {
      try {
        const L = await import('leaflet');
        const map = mapInstanceRef.current;

        // Clear existing layers
        Object.values(layersRef.current).forEach((layer: any) => {
          map.removeLayer(layer);
        });
        layersRef.current = {};

        // Add layers based on enabled filters
        enabledFilters.forEach(filter => {
          const layerGroup = L.layerGroup();
          layersRef.current[filter.name] = layerGroup;

          // Add mock data based on filter type
          addFilteredFeatures(L, layerGroup, filter, coordinates, analysisData);
          
          layerGroup.addTo(map);
        });
      } catch (error) {
        console.error('Failed to update layers:', error);
      }
    };

    updateLayers();
  }, [enabledFilters, coordinates, analysisData, leafletLoaded]);

  const addFilteredFeatures = (
    L: any,
    layerGroup: any,
    filter: FilterType,
    center: LatLng,
    data?: any
  ) => {
    const { lat, lng } = center;
    
    switch (filter.name) {
      case 'Forest':
        // Add forest areas
        for (let i = 0; i < 3; i++) {
          const offset = (i - 1) * 0.003;
          const circle = L.circle([lat + offset, lng + offset], {
            color: filter.color,
            fillColor: filter.color,
            fillOpacity: 0.3,
            radius: 200 + Math.random() * 300
          }).bindPopup(`
            <div style="padding: 8px;">
              <h4 style="font-weight: bold; color: #059669; margin: 0 0 4px 0;">Forest Area</h4>
              <p style="margin: 2px 0; font-size: 12px;">Type: Mixed</p>
              <p style="margin: 2px 0; font-size: 12px;">Area: ~${Math.round(Math.random() * 500 + 100)} hectares</p>
            </div>
          `);
          layerGroup.addLayer(circle);
        }
        break;

      case 'Agricultural Land':
        // Add agricultural areas
        const polygon = L.polygon([
          [lat - 0.005, lng - 0.008],
          [lat - 0.005, lng + 0.008],
          [lat + 0.005, lng + 0.008],
          [lat + 0.005, lng - 0.008]
        ], {
          color: filter.color,
          fillColor: filter.color,
          fillOpacity: 0.2
        }).bindPopup(`
          <div style="padding: 8px;">
            <h4 style="font-weight: bold; color: #D97706; margin: 0 0 4px 0;">Agricultural Land</h4>
            <p style="margin: 2px 0; font-size: 12px;">Type: ${data?.vegetation?.vegetation_type || 'Mixed crops'}</p>
            <p style="margin: 2px 0; font-size: 12px;">Suitability: High</p>
          </div>
        `);
        layerGroup.addLayer(polygon);
        break;

      case 'Water Bodies':
        // Add water features
        const waterCircle = L.circle([lat - 0.002, lng + 0.003], {
          color: filter.color,
          fillColor: filter.color,
          fillOpacity: 0.4,
          radius: 150
        }).bindPopup(`
          <div style="padding: 8px;">
            <h4 style="font-weight: bold; color: #1D4ED8; margin: 0 0 4px 0;">Water Body</h4>
            <p style="margin: 2px 0; font-size: 12px;">Type: Small lake</p>
            <p style="margin: 2px 0; font-size: 12px;">Quality: Good</p>
          </div>
        `);
        layerGroup.addLayer(waterCircle);
        break;

      case 'Urban':
        // Add urban areas
        const urbanRect = L.rectangle([
          [lat + 0.001, lng - 0.002],
          [lat + 0.004, lng + 0.001]
        ], {
          color: filter.color,
          fillColor: filter.color,
          fillOpacity: 0.3
        }).bindPopup(`
          <div style="padding: 8px;">
            <h4 style="font-weight: bold; color: #374151; margin: 0 0 4px 0;">Urban Area</h4>
            <p style="margin: 2px 0; font-size: 12px;">Type: Residential</p>
            <p style="margin: 2px 0; font-size: 12px;">Density: Medium</p>
          </div>
        `);
        layerGroup.addLayer(urbanRect);
        break;

      case 'Temperature':
        // Add temperature zones
        if (data?.climate?.current_weather?.temperature?.current) {
          const temp = data.climate.current_weather.temperature.current;
          for (let i = 0; i < 4; i++) {
            const angle = (i * Math.PI) / 2;
            const offsetLat = Math.cos(angle) * 0.004;
            const offsetLng = Math.sin(angle) * 0.004;
            
            const circle = L.circle([lat + offsetLat, lng + offsetLng], {
              color: filter.color,
              fillColor: filter.color,
              fillOpacity: 0.2,
              radius: 100
            }).bindPopup(`
              <div style="padding: 8px;">
                <h4 style="font-weight: bold; color: #DC2626; margin: 0 0 4px 0;">Temperature Zone</h4>
                <p style="margin: 2px 0; font-size: 12px;">Current: ${temp}°C</p>
                <p style="margin: 2px 0; font-size: 12px;">Zone: ${temp > 20 ? 'Warm' : temp > 10 ? 'Moderate' : 'Cool'}</p>
              </div>
            `);
            layerGroup.addLayer(circle);
          }
        }
        break;

      case 'Humidity':
        // Add humidity indicators
        if (data?.climate?.current_weather?.humidity) {
          const humidity = data.climate.current_weather.humidity;
          const circle = L.circle([lat, lng], {
            color: filter.color,
            fillColor: filter.color,
            fillOpacity: 0.15,
            radius: 400
          }).bindPopup(`
            <div style="padding: 8px;">
              <h4 style="font-weight: bold; color: #2563EB; margin: 0 0 4px 0;">Humidity Zone</h4>
              <p style="margin: 2px 0; font-size: 12px;">Level: ${humidity}%</p>
              <p style="margin: 2px 0; font-size: 12px;">Condition: ${humidity > 70 ? 'High' : humidity > 40 ? 'Moderate' : 'Low'}</p>
            </div>
          `);
          layerGroup.addLayer(circle);
        }
        break;

      case 'Elevation':
        // Add elevation contours
        for (let i = 0; i < 3; i++) {
          const radius = 200 + (i * 150);
          const circle = L.circle([lat, lng], {
            color: filter.color,
            fillColor: 'transparent',
            radius: radius,
            weight: 2
          }).bindPopup(`
            <div style="padding: 8px;">
              <h4 style="font-weight: bold; color: #CA8A04; margin: 0 0 4px 0;">Elevation Contour</h4>
              <p style="margin: 2px 0; font-size: 12px;">Height: ${100 + (i * 50)}m</p>
              <p style="margin: 2px 0; font-size: 12px;">Contour line ${i + 1}</p>
            </div>
          `);
          layerGroup.addLayer(circle);
        }
        break;

      default:
        // Generic feature
        const marker = L.circleMarker([lat + Math.random() * 0.006 - 0.003, lng + Math.random() * 0.006 - 0.003], {
          color: filter.color,
          fillColor: filter.color,
          fillOpacity: 0.7,
          radius: 8
        }).bindPopup(`
          <div style="padding: 8px;">
            <h4 style="font-weight: bold; margin: 0 0 4px 0;">${filter.name}</h4>
            <p style="margin: 2px 0; font-size: 12px;">Feature detected in analysis</p>
          </div>
        `);
        layerGroup.addLayer(marker);
        break;
    }
  };

  if (isLoading) {
    return (
      <div className="h-[500px] bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-600 mx-auto mb-2"></div>
          <p className="text-stone-600">Loading map...</p>
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
      <div className="absolute top-2 right-2 bg-white p-2 rounded shadow-md text-xs z-10">
        <p className="font-medium">Active Filters: {enabledFilters.length}</p>
        <div className="flex flex-wrap gap-1 mt-1">
          {enabledFilters.slice(0, 3).map(filter => (
            <div
              key={filter.name}
              className="w-3 h-3 rounded"
              style={{ backgroundColor: filter.color }}
              title={filter.name}
            />
          ))}
          {enabledFilters.length > 3 && (
            <span className="text-gray-500">+{enabledFilters.length - 3}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilteredMap;
