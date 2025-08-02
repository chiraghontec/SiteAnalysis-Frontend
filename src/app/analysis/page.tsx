'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Home, BarChart3 } from 'lucide-react';
import { environmentalService, AnalysisResponse, ClimateResponse } from '@/services/environmentalService';

interface SiteInfo {
  latitude: number;
  longitude: number;
  name?: string;
  radius?: number;
}

export default function AnalysisPage() {
  const [siteInfo, setSiteInfo] = useState<SiteInfo | null>(null);
  const [vegetationAnalysis, setVegetationAnalysis] = useState<AnalysisResponse | null>(null);
  const [climateAnalysis, setClimateAnalysis] = useState<ClimateResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Load site coordinates from localStorage or URL params on component mount
  useEffect(() => {
    // Check if we're in the browser environment
    if (typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }
    
    try {
      // Try to get coordinates from localStorage (from landing page)
      const savedLatitude = localStorage.getItem('siteLatitude');
      const savedLongitude = localStorage.getItem('siteLongitude');
      
      if (savedLatitude && savedLongitude) {
        const lat = parseFloat(savedLatitude);
        const lng = parseFloat(savedLongitude);
        
        if (!isNaN(lat) && !isNaN(lng)) {
          setSiteInfo({
            latitude: lat,
            longitude: lng,
            name: localStorage.getItem('siteName') || undefined,
            radius: 500
          });
        }
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Perform comprehensive site analysis
  const performSiteAnalysis = async () => {
    if (!siteInfo) {
      setError('No site coordinates available');
      return;
    }

    setIsAnalyzing(true);
    setError('');

    try {
      // Perform both vegetation and climate analysis
      const [vegResult, climateResult] = await Promise.all([
        environmentalService.analyzeVegetation({
          latitude: siteInfo.latitude,
          longitude: siteInfo.longitude,
          radius: siteInfo.radius || 500,
          name: siteInfo.name || `Site Analysis - ${siteInfo.latitude.toFixed(4)}, ${siteInfo.longitude.toFixed(4)}`
        }),
        environmentalService.analyzeClimate({
          latitude: siteInfo.latitude,
          longitude: siteInfo.longitude,
          radius: siteInfo.radius || 500,
          name: siteInfo.name || `Climate Analysis - ${siteInfo.latitude.toFixed(4)}, ${siteInfo.longitude.toFixed(4)}`
        })
      ]);

      setVegetationAnalysis(vegResult);
      setClimateAnalysis(climateResult);
    } catch (err) {
      setError('Failed to perform site analysis. Please try again.');
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Format coordinate for display
  const formatCoordinate = (coord: number, type: 'lat' | 'lng'): string => {
    const direction = type === 'lat' ? (coord >= 0 ? 'N' : 'S') : (coord >= 0 ? 'E' : 'W');
    return `${Math.abs(coord).toFixed(6)}° ${direction}`;
  };

  // Get site classification based on analysis
  const getSiteClassification = (): string => {
    if (!vegetationAnalysis && !climateAnalysis) return 'Unknown';
    
    const vegFeatures = vegetationAnalysis?.features_count || 0;
    const climateZone = climateAnalysis?.summary?.climate_zone || 'temperate';
    
    if (vegFeatures > 800) return 'High Environmental Density';
    if (vegFeatures > 400) return 'Moderate Environmental Density';
    return 'Low Environmental Density';
  };
  return (
    <div className="bg-white text-stone-800">
      <div className="container mx-auto max-w-4xl py-12 px-4 md:px-6">
        <div className="space-y-12">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center space-x-2 text-sm text-stone-600">
            <Link href="/" className="flex items-center gap-1 hover:text-stone-800 transition-colors">
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <ChevronLeft className="h-4 w-4 rotate-180" />
            <span className="text-stone-800 font-medium flex items-center gap-1">
              <BarChart3 className="h-4 w-4" />
              Analysis Report
            </span>
          </nav>

          {/* Site Info Section */}
          <div className="border-b border-stone-200 pb-8">
            <h1 className="text-4xl font-bold tracking-tight">Site Analysis Report</h1>
            
            {isLoading ? (
              <div className="mt-6">
                <Card className="p-6 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-stone-700"></div>
                    <span className="text-stone-600">Loading site information...</span>
                  </div>
                </Card>
              </div>
            ) : siteInfo ? (
              <div className="mt-6 space-y-4">
                <Card className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-stone-800">Location Details</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-stone-600">Latitude:</span>
                          <span className="font-mono">{formatCoordinate(siteInfo.latitude, 'lat')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-600">Longitude:</span>
                          <span className="font-mono">{formatCoordinate(siteInfo.longitude, 'lng')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-600">Analysis Radius:</span>
                          <span>{siteInfo.radius || 500}m</span>
                        </div>
                        {siteInfo.name && (
                          <div className="flex justify-between">
                            <span className="text-stone-600">Site Name:</span>
                            <span>{siteInfo.name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-stone-800">Site Classification</h3>
                      <div className="space-y-2">
                        <Badge variant="outline" className="text-sm">
                          {getSiteClassification()}
                        </Badge>
                        {vegetationAnalysis && (
                          <p className="text-sm text-stone-600">
                            {vegetationAnalysis.features_count} environmental features detected
                          </p>
                        )}
                        {climateAnalysis && (
                          <p className="text-sm text-stone-600">
                            Climate Zone: {climateAnalysis.summary?.climate_zone || 'Unknown'}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-stone-200">
                    <div className="flex gap-3 flex-wrap">
                      <Button 
                        onClick={performSiteAnalysis}
                        disabled={isAnalyzing}
                        className="bg-stone-700 hover:bg-stone-800"
                      >
                        {isAnalyzing ? (
                          <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Analyzing...
                          </div>
                        ) : (
                          'Perform Comprehensive Analysis'
                        )}
                      </Button>
                      <Link href="/filters">
                        <Button variant="outline" className="border-green-600 text-green-700 hover:bg-green-50">
                          View Interactive Map
                        </Button>
                      </Link>
                      <Link href="/#site-location">
                        <Button variant="outline">Update Coordinates</Button>
                      </Link>
                    </div>
                  </div>
                  
                  {error && (
                    <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded text-sm">
                      {error}
                    </div>
                  )}
                </Card>
              </div>
            ) : (
              <div className="mt-6">
                <Card className="p-6 text-center">
                  <p className="text-stone-600 mb-4">
                    No site coordinates available. Please input site coordinates first.
                  </p>
                  <Link href="/#site-location" className="text-blue-600 underline hover:text-blue-800">
                    Click here to input site coordinates
                  </Link>
                </Card>
              </div>
            )}
          </div>

          {/* Vegetation & Terrain Analysis Section */}
          <div className="border-b border-stone-200 pb-8">
            <h2 className="text-4xl font-bold tracking-tight">Vegetation &amp; Terrain Analysis</h2>
            <p className="mt-2 text-stone-600">
              Report on the vegetation and terrain of the site
            </p>
            
            {vegetationAnalysis ? (
              <div className="mt-6">
                <Card className="p-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">
                        {vegetationAnalysis.features_count}
                      </div>
                      <div className="text-sm text-stone-600">Environmental Features</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">
                        {vegetationAnalysis.summary?.total_features || 0}
                      </div>
                      <div className="text-sm text-stone-600">Total Features</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600">
                        {vegetationAnalysis.radius}m
                      </div>
                      <div className="text-sm text-stone-600">Analysis Radius</div>
                    </div>
                  </div>
                  
                  {vegetationAnalysis.summary?.feature_counts && (
                    <div className="mt-6 pt-4 border-t border-stone-200">
                      <h4 className="font-semibold mb-3">Feature Breakdown:</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(vegetationAnalysis.summary.feature_counts).map(([type, count]) => (
                          <div key={type} className="text-center p-3 bg-stone-50 rounded">
                            <div className="font-semibold text-lg">{count as number}</div>
                            <div className="text-sm text-stone-600 capitalize">{type}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            ) : (
              <div className="mt-6">
                <Card className="p-6 text-center text-stone-500">
                  <p>No vegetation analysis available. Perform site analysis to get vegetation data.</p>
                </Card>
              </div>
            )}
          </div>

          {/* Climate Conditions Section */}
          <div className="border-b border-stone-200 pb-8">
            <h2 className="text-4xl font-bold tracking-tight">Climate Conditions</h2>
            <p className="mt-2 text-stone-600">
              Report on the climate/weather
            </p>
            
            {climateAnalysis ? (
              <div className="mt-6">
                <Card className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Current Weather</h4>
                      {climateAnalysis.current_weather && (
                        <div className="space-y-2 text-sm">
                          {climateAnalysis.current_weather.temperature?.current && (
                            <div className="flex justify-between">
                              <span className="text-stone-600">Temperature:</span>
                              <span>{climateAnalysis.current_weather.temperature.current}°C</span>
                            </div>
                          )}
                          {climateAnalysis.current_weather.precipitation?.description && (
                            <div className="flex justify-between">
                              <span className="text-stone-600">Conditions:</span>
                              <span className="capitalize">{climateAnalysis.current_weather.precipitation.description}</span>
                            </div>
                          )}
                          {climateAnalysis.current_weather.wind?.speed && (
                            <div className="flex justify-between">
                              <span className="text-stone-600">Wind Speed:</span>
                              <span>{climateAnalysis.current_weather.wind.speed} m/s</span>
                            </div>
                          )}
                          {climateAnalysis.current_weather.temperature?.humidity && (
                            <div className="flex justify-between">
                              <span className="text-stone-600">Humidity:</span>
                              <span>{climateAnalysis.current_weather.temperature.humidity}%</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-3">Climate Summary</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-stone-600">Climate Zone:</span>
                          <span className="capitalize">{climateAnalysis.summary?.climate_zone || 'Unknown'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-600">Weather Stations:</span>
                          <span>{climateAnalysis.stations_count}</span>
                        </div>
                        {climateAnalysis.summary?.precipitation_annual && (
                          <div className="flex justify-between">
                            <span className="text-stone-600">Annual Precipitation:</span>
                            <span>{climateAnalysis.summary.precipitation_annual}mm</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ) : (
              <div className="mt-6">
                <Card className="p-6 text-center text-stone-500">
                  <p>No climate analysis available. Perform site analysis to get climate data.</p>
                </Card>
              </div>
            )}
          </div>

          {/* Optimal Usage Section */}
          <div>
            <h2 className="text-4xl font-bold tracking-tight">Optimal Usage</h2>
            <p className="mt-2 text-stone-600">
              Gives a report on optimal things to build/preserve on the site
            </p>
            
            {(vegetationAnalysis || climateAnalysis) ? (
              <div className="mt-6">
                <Card className="p-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Site Recommendations:</h4>
                    
                    {vegetationAnalysis && (
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h5 className="font-medium text-green-800 mb-2">Environmental Considerations:</h5>
                        <ul className="text-sm text-green-700 space-y-1">
                          {vegetationAnalysis.features_count > 800 && (
                            <li>• High biodiversity area - consider conservation measures</li>
                          )}
                          {vegetationAnalysis.summary?.feature_counts?.natural > 100 && (
                            <li>• Significant natural features present - preserve existing vegetation</li>
                          )}
                          {vegetationAnalysis.summary?.feature_counts?.water && (
                            <li>• Water bodies detected - ensure proper drainage and flood management</li>
                          )}
                          <li>• Consider sustainable building practices to minimize environmental impact</li>
                        </ul>
                      </div>
                    )}
                    
                    {climateAnalysis && (
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h5 className="font-medium text-blue-800 mb-2">Climate Recommendations:</h5>
                        <ul className="text-sm text-blue-700 space-y-1">
                          {climateAnalysis.summary?.climate_zone === 'subtropical' && (
                            <li>• Subtropical climate - ensure adequate cooling and ventilation</li>
                          )}
                          {climateAnalysis.current_weather?.wind?.speed > 5 && (
                            <li>• Moderate to high wind speeds - consider wind-resistant construction</li>
                          )}
                          {climateAnalysis.current_weather?.temperature?.humidity > 70 && (
                            <li>• High humidity levels - implement moisture control measures</li>
                          )}
                          <li>• Design buildings to optimize for local climate conditions</li>
                        </ul>
                      </div>
                    )}
                    
                    <div className="p-4 bg-stone-50 rounded-lg">
                      <h5 className="font-medium text-stone-800 mb-2">General Recommendations:</h5>
                      <ul className="text-sm text-stone-700 space-y-1">
                        <li>• Conduct detailed soil analysis before construction</li>
                        <li>• Consider renewable energy options based on climate conditions</li>
                        <li>• Plan for adequate stormwater management</li>
                        <li>• Preserve existing mature vegetation where possible</li>
                        <li>• Implement erosion control measures during construction</li>
                      </ul>
                    </div>
                  </div>
                </Card>
              </div>
            ) : (
              <div className="mt-6">
                <Card className="p-6 text-center text-stone-500">
                  <p>No recommendations available. Perform site analysis to get usage recommendations.</p>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
