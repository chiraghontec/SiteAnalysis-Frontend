'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';

// Fix for default markers in react-leaflet
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface LeafletMapProps {
  latitude: number | null;
  longitude: number | null;
  radius?: number;
}

export default function LeafletMap({ 
  latitude, 
  longitude, 
  radius = 500 
}: LeafletMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
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
    const map = L.map(containerRef.current).setView(center, zoom);
    
    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add marker and circle if coordinates are provided
    if (latitude && longitude) {
      const marker = L.marker(center, { icon: DefaultIcon }).addTo(map);
      marker.bindPopup(`Site Location<br/>Lat: ${latitude.toFixed(6)}<br/>Lng: ${longitude.toFixed(6)}`);
      
      L.circle(center, {
        radius: radius,
        color: '#059669',
        fillColor: '#10b981',
        fillOpacity: 0.2,
        weight: 2,
      }).addTo(map);
    }

    mapRef.current = map;

    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [latitude, longitude, radius]);

  return (
    <div 
      ref={containerRef}
      style={{ height: '400px', width: '100%', zIndex: 1 }}
      className="leaflet-container relative"
    />
  );
}
