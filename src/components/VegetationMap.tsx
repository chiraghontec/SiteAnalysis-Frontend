'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';

// Fix for default markers in Leaflet
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface VegetationMapProps {
  latitude: number | null;
  longitude: number | null;
  radius?: number;
  className?: string;
  vegetationData?: any[];
}

export function VegetationMap({ 
  latitude, 
  longitude, 
  radius = 500,
  className = "",
  vegetationData = []
}: VegetationMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (!containerRef.current) return;

    // Clean up existing map if it exists
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    // Default to a central location if no coordinates provided
    const defaultLat = 40.7128;
    const defaultLng = -74.0060;
    
    const centerLat = latitude ?? defaultLat;
    const centerLng = longitude ?? defaultLng;
    const center: [number, number] = [centerLat, centerLng];
    const zoom = latitude && longitude ? 15 : 10;

    // Create map instance
    const map = L.map(containerRef.current, {
      zoomControl: true,
      attributionControl: true
    }).setView(center, zoom);
    
    // Add OpenStreetMap base layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add vegetation overlay from OpenStreetMap
    const vegetationLayer = L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
      attribution: 'OSM France',
      opacity: 0.7
    });

    // Add site marker and analysis radius if coordinates are provided
    if (latitude && longitude) {
      const marker = L.marker(center, { icon: DefaultIcon }).addTo(map);
      marker.bindPopup(`Analysis Site<br/>Lat: ${latitude.toFixed(6)}<br/>Lng: ${longitude.toFixed(6)}`);
      
      // Analysis radius circle
      L.circle(center, {
        radius: radius,
        color: '#22c55e',
        fillColor: '#16a34a',
        fillOpacity: 0.2,
        weight: 2,
      }).addTo(map);

      // Add vegetation overlay
      vegetationLayer.addTo(map);
    }

    // Add vegetation data from API if available
    if (vegetationData && vegetationData.length > 0) {
      vegetationData.forEach((feature: any) => {
        if (feature.geometry && feature.properties) {
          const color = getFeatureColor(feature.properties.feature_type);
          
          // Add feature to map based on geometry type
          if (feature.geometry.type === 'Point') {
            const coords = feature.geometry.coordinates;
            L.circleMarker([coords[1], coords[0]], {
              color: color,
              fillColor: color,
              fillOpacity: 0.6,
              radius: 8
            }).addTo(map).bindPopup(
              `<strong>${feature.properties.feature_type}</strong><br/>` +
              `${JSON.stringify(feature.properties, null, 2)}`
            );
          }
        }
      });
    }

    mapRef.current = map;

    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [latitude, longitude, radius, vegetationData]);

  // Helper function to get color based on feature type
  const getFeatureColor = (featureType: string): string => {
    const colorMap: { [key: string]: string } = {
      'landuse': '#8fbc8f',
      'natural': '#228b22',
      'leisure': '#90ee90',
      'forest': '#006400',
      'grass': '#7cfc00',
      'water': '#4169e1',
      'tree': '#228b22'
    };
    return colorMap[featureType] || '#808080';
  };

  if (isLoading) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-700 mx-auto mb-2"></div>
          <div className="text-stone-600">Loading vegetation data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-lg overflow-hidden relative ${className}`}>
      <div 
        ref={containerRef}
        style={{ height: '600px', width: '100%', zIndex: 1, pointerEvents: 'auto' }}
        className="leaflet-container"
      />
    </div>
  );
}
