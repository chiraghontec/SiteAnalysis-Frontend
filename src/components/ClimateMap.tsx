'use client';

import React, { useEffect, useRef } from 'react';

interface ClimateMapProps {
  latitude: number | null;
  longitude: number | null;
  radius: number;
  climateData?: any[];
  className?: string;
  isLoading?: boolean;
}

export function ClimateMap({ 
  latitude, 
  longitude, 
  radius = 500, 
  climateData = [], 
  className = '',
  isLoading = false 
}: ClimateMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    // Dynamically import Leaflet to avoid SSR issues
    import('leaflet').then((L) => {
      // Clean up existing map
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      if (!latitude || !longitude || !containerRef.current) return;

      // Initialize map
      const map = L.map(containerRef.current, {
        center: [latitude, longitude],
        zoom: 14,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        boxZoom: true,
        keyboard: true,
        dragging: true,
        zoomControl: true,
      });

      mapRef.current = map;

      // Add OpenStreetMap base layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      // Add weather/climate overlay (OpenWeatherMap or similar)
      const weatherLayer = L.tileLayer(
        'https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=YOUR_API_KEY',
        {
          attribution: '© OpenWeatherMap',
          opacity: 0.6,
          maxZoom: 18,
        }
      );

      // Add center marker
      L.marker([latitude, longitude])
        .addTo(map)
        .bindPopup(`Site Location<br>Lat: ${latitude.toFixed(4)}<br>Lng: ${longitude.toFixed(4)}`);

      // Add analysis radius circle
      L.circle([latitude, longitude], {
        radius: radius,
        color: '#3b82f6',
        fillColor: '#3b82f6',
        fillOpacity: 0.2,
        weight: 2,
      }).addTo(map);

      // Add climate overlay toggle
      const overlayMaps = {
        'Temperature': weatherLayer,
      };

      L.control.layers({}, overlayMaps).addTo(map);

      // Add climate data points if available
      if (climateData && climateData.length > 0) {
        climateData.forEach((station: any) => {
          if (station.latitude && station.longitude) {
            const marker = L.marker([station.latitude, station.longitude], {
              icon: L.divIcon({
                className: 'climate-station-marker',
                html: `<div style="background: #3b82f6; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold;">🌡️</div>`,
                iconSize: [24, 24],
                iconAnchor: [12, 12],
              }),
            }).addTo(map);

            // Create popup content for climate station
            const popupContent = `
              <div style="min-width: 200px;">
                <h4 style="margin: 0 0 8px 0; color: #1f2937; font-weight: bold;">Climate Station</h4>
                ${station.name ? `<p style="margin: 2px 0;"><strong>Name:</strong> ${station.name}</p>` : ''}
                ${station.temperature ? `<p style="margin: 2px 0;"><strong>Temperature:</strong> ${station.temperature}°C</p>` : ''}
                ${station.humidity ? `<p style="margin: 2px 0;"><strong>Humidity:</strong> ${station.humidity}%</p>` : ''}
                ${station.windSpeed ? `<p style="margin: 2px 0;"><strong>Wind Speed:</strong> ${station.windSpeed} m/s</p>` : ''}
                ${station.pressure ? `<p style="margin: 2px 0;"><strong>Pressure:</strong> ${station.pressure} hPa</p>` : ''}
                ${station.description ? `<p style="margin: 2px 0;"><strong>Conditions:</strong> ${station.description}</p>` : ''}
              </div>
            `;

            marker.bindPopup(popupContent);
          }
        });
      }

      // Cleanup function
      return () => {
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }
      };
    });
  }, [latitude, longitude, radius, climateData]);

  // Helper function to get weather icon based on condition
  const getWeatherIcon = (condition: string): string => {
    const iconMap: { [key: string]: string } = {
      'clear': '☀️',
      'clouds': '☁️',
      'rain': '🌧️',
      'snow': '🌨️',
      'thunderstorm': '⛈️',
      'drizzle': '🌦️',
      'mist': '🌫️',
      'fog': '🌫️'
    };
    return iconMap[condition.toLowerCase()] || '🌤️';
  };

  if (isLoading) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <div className="text-stone-600">Loading climate data...</div>
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
