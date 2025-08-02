
'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { FiltersSheet } from '@/components/FiltersSheet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Layers, Eye, EyeOff, ChevronLeft, Home } from 'lucide-react';

// Dynamically import the InteractiveFilterMap component to avoid SSR issues
const InteractiveFilterMap = dynamic(() => import('@/components/InteractiveFilterMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-600 mx-auto mb-2"></div>
        <p className="text-stone-600">Loading interactive map...</p>
      </div>
    </div>
  ),
});

export type FilterType = {
  name: string;
  category: 'environmental' | 'climate' | 'terrain';
  color: string;
  enabled: boolean;
};

const availableFilters: FilterType[] = [
  { name: 'Agricultural Land', category: 'environmental', color: '#8FBC8F', enabled: true },
  { name: 'Forest', category: 'environmental', color: '#228B22', enabled: true },
  { name: 'Urban', category: 'environmental', color: '#696969', enabled: true },
  { name: 'Water Bodies', category: 'environmental', color: '#4169E1', enabled: true },
  { name: 'Temperature', category: 'climate', color: '#FF6347', enabled: false },
  { name: 'Humidity', category: 'climate', color: '#87CEEB', enabled: false },
  { name: 'Rainfall', category: 'climate', color: '#4682B4', enabled: false },
  { name: 'Wind', category: 'climate', color: '#B0C4DE', enabled: false },
  { name: 'Elevation', category: 'terrain', color: '#CD853F', enabled: false },
  { name: 'Slope', category: 'terrain', color: '#D2691E', enabled: false },
];

export default function FiltersPage() {
  const [filters, setFilters] = useState<FilterType[]>(availableFilters);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [analysisData, setAnalysisData] = useState<any>(null);

  // Load coordinates and analysis data from localStorage
  useEffect(() => {
    console.log('Filters page: Loading data from localStorage...');
    if (typeof window !== 'undefined') {
      let coords = null;
      
      // Try to get coordinates from the new format first
      const savedCoords = localStorage.getItem('currentCoordinates');
      console.log('Saved coordinates (new format):', savedCoords);
      
      if (savedCoords) {
        coords = JSON.parse(savedCoords);
        console.log('Parsed coordinates:', coords);
      } else {
        // Fallback to old format
        const lat = localStorage.getItem('siteLatitude');
        const lng = localStorage.getItem('siteLongitude');
        console.log('Fallback coordinates - lat:', lat, 'lng:', lng);
        
        if (lat && lng) {
          coords = { lat: parseFloat(lat), lng: parseFloat(lng) };
          // Update to new format for future use
          localStorage.setItem('currentCoordinates', JSON.stringify(coords));
          console.log('Updated coordinates to new format:', coords);
        }
      }
      
      if (coords) {
        setCoordinates(coords);
        console.log('Set coordinates state:', coords);
      } else {
        console.log('No coordinates found in localStorage');
      }
      
      const savedVegetation = localStorage.getItem('vegetationResult');
      const savedClimate = localStorage.getItem('climateResult');
      console.log('Analysis data - vegetation:', !!savedVegetation, 'climate:', !!savedClimate);
      
      if (savedVegetation || savedClimate) {
        setAnalysisData({
          vegetation: savedVegetation ? JSON.parse(savedVegetation) : null,
          climate: savedClimate ? JSON.parse(savedClimate) : null,
        });
      }
    }
  }, []);

  const toggleFilter = (filterName: string) => {
    setFilters(prev => 
      prev.map(filter => 
        filter.name === filterName 
          ? { ...filter, enabled: !filter.enabled }
          : filter
      )
    );
  };

  const enabledFilters = filters.filter(f => f.enabled);
  const categoryGroups = {
    environmental: filters.filter(f => f.category === 'environmental'),
    climate: filters.filter(f => f.category === 'climate'),
    terrain: filters.filter(f => f.category === 'terrain'),
  };

  return (
    <div className="bg-white text-stone-800 min-h-screen">
      <div className="container mx-auto max-w-7xl py-8 px-4 md:px-6">
        <div className="space-y-6">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center space-x-2 text-sm text-stone-600">
            <Link href="/" className="flex items-center gap-1 hover:text-stone-800 transition-colors">
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <ChevronLeft className="h-4 w-4 rotate-180" />
            <span className="text-stone-800 font-medium">Interactive Filters</span>
          </nav>

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Interactive Filters</h1>
              <p className="mt-2 text-stone-600">
                Explore environmental data with customizable map layers and filters.
              </p>
            </div>
            {coordinates && (
              <div className="flex items-center gap-2 text-sm text-stone-600">
                <MapPin className="h-4 w-4" />
                <span>Lat: {coordinates.lat.toFixed(4)}, Lng: {coordinates.lng.toFixed(4)}</span>
              </div>
            )}
          </div>

          {/* Filter Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filter Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  Filter Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(categoryGroups).map(([category, categoryFilters]) => (
                  <div key={category}>
                    <h4 className="font-medium text-sm uppercase tracking-wide text-stone-500 mb-2">
                      {category}
                    </h4>
                    <div className="space-y-2">
                      {categoryFilters.map((filter) => (
                        <div
                          key={filter.name}
                          className="flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded"
                              style={{ backgroundColor: filter.color }}
                            />
                            <span className="text-sm">{filter.name}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleFilter(filter.name)}
                            className="h-6 w-6 p-0"
                          >
                            {filter.enabled ? (
                              <Eye className="h-3 w-3" />
                            ) : (
                              <EyeOff className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Map */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>Interactive Map</CardTitle>
                  <div className="flex flex-wrap gap-2">
                    {enabledFilters.map((filter) => (
                      <Badge
                        key={filter.name}
                        variant="outline"
                        style={{ borderColor: filter.color, color: filter.color }}
                      >
                        {filter.name}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  {coordinates ? (
                    <InteractiveFilterMap
                      coordinates={coordinates}
                      enabledFilters={enabledFilters}
                      analysisData={analysisData}
                    />
                  ) : (
                    <div className="h-[500px] bg-gray-50 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="h-12 w-12 text-stone-400 mx-auto mb-4" />
                        <p className="text-stone-600 mb-2">No coordinates selected</p>
                        <p className="text-sm text-stone-500">
                          Please select coordinates from the main page to view filtered data
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Analysis Summary */}
          {analysisData && (
            <Card>
              <CardHeader>
                <CardTitle>Analysis Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {analysisData.vegetation && (
                    <div>
                      <h4 className="font-medium mb-2">Vegetation Analysis</h4>
                      <div className="space-y-1 text-sm text-stone-600">
                        <p>Land Use: {analysisData.vegetation.land_use_type || 'Unknown'}</p>
                        <p>Vegetation: {analysisData.vegetation.vegetation_type || 'Not specified'}</p>
                        {analysisData.vegetation.features && (
                          <p>Features Found: {analysisData.vegetation.features.length}</p>
                        )}
                      </div>
                    </div>
                  )}
                  {analysisData.climate && (
                    <div>
                      <h4 className="font-medium mb-2">Climate Analysis</h4>
                      <div className="space-y-1 text-sm text-stone-600">
                        {analysisData.climate.current_weather?.temperature?.current && (
                          <p>Temperature: {analysisData.climate.current_weather.temperature.current}°C</p>
                        )}
                        {analysisData.climate.current_weather?.humidity && (
                          <p>Humidity: {analysisData.climate.current_weather.humidity}%</p>
                        )}
                        {analysisData.climate.current_weather?.precipitation?.description && (
                          <p>Conditions: {analysisData.climate.current_weather.precipitation.description}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
