'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

interface InteractiveMapProps {
  latitude: number | null;
  longitude: number | null;
  radius?: number;
  className?: string;
}

// Dynamically import the entire Leaflet map component with no SSR
const DynamicMap = dynamic(() => import('./LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="bg-gray-200 rounded-lg shadow-lg flex items-center justify-center h-[400px]">
      <div className="text-gray-500">Loading map...</div>
    </div>
  ),
});

export function InteractiveMap({ 
  latitude, 
  longitude, 
  radius = 500, 
  className = "" 
}: InteractiveMapProps) {
  const [mapKey, setMapKey] = useState(0);

  // Force remount when coordinates change significantly
  useEffect(() => {
    setMapKey(prev => prev + 1);
  }, [latitude, longitude]);

  return (
    <div className={`rounded-lg shadow-lg overflow-hidden relative ${className}`} style={{ zIndex: 1 }}>
      <DynamicMap
        key={mapKey}
        latitude={latitude}
        longitude={longitude}
        radius={radius}
      />
    </div>
  );
}
