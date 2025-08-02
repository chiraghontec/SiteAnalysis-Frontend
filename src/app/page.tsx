
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { InteractiveMap } from '@/components/InteractiveMap';
import { VegetationMap } from '@/components/VegetationMap';
import { ClimateMap } from '@/components/ClimateMap';
import { environmentalService, AnalysisResponse, ClimateResponse } from '@/services/environmentalService';

function LandingPage() {
  const [latitude, setLatitude] = useState<string>('');
  const [longitude, setLongitude] = useState<string>('');
  const [vegetationData, setVegetationData] = useState<any[]>([]);
  const [climateData, setClimateData] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAnalyzingClimate, setIsAnalyzingClimate] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [climateResult, setClimateResult] = useState<ClimateResponse | null>(null);
  const [error, setError] = useState<string>('');
  
  // Parse coordinates for the map
  const lat = latitude ? parseFloat(latitude) : null;
  const lng = longitude ? parseFloat(longitude) : null;
  
  // Validate coordinates
  const isValidLat = lat !== null && !isNaN(lat) && lat >= -90 && lat <= 90;
  const isValidLng = lng !== null && !isNaN(lng) && lng >= -180 && lng <= 180;
  const validCoordinates = isValidLat && isValidLng;

  // Handle vegetation analysis
  const handleVegetationAnalysis = async () => {
    if (!validCoordinates || !lat || !lng) {
      setError('Please enter valid coordinates first');
      return;
    }

    // Save coordinates to localStorage for analysis page
    if (typeof window !== 'undefined') {
      localStorage.setItem('siteLatitude', lat.toString());
      localStorage.setItem('siteLongitude', lng.toString());
      localStorage.setItem('siteName', `Site at ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
      // Also save in the format expected by filters page
      localStorage.setItem('currentCoordinates', JSON.stringify({ lat, lng }));
    }

    setIsAnalyzing(true);
    setError('');

    try {
      const result = await environmentalService.analyzeVegetation({
        latitude: lat,
        longitude: lng,
        radius: 500,
        name: `Vegetation Analysis - ${lat.toFixed(4)}, ${lng.toFixed(4)}`
      });

      setAnalysisResult(result);
      setVegetationData(result.features || []);
    } catch (err) {
      setError('Failed to retrieve vegetation data. Please check your connection and try again.');
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle climate analysis
  const handleClimateAnalysis = async () => {
    if (!validCoordinates || !lat || !lng) {
      setError('Please enter valid coordinates first');
      return;
    }

    // Save coordinates to localStorage for analysis page
    if (typeof window !== 'undefined') {
      localStorage.setItem('siteLatitude', lat.toString());
      localStorage.setItem('siteLongitude', lng.toString());
      localStorage.setItem('siteName', `Site at ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
      // Also save in the format expected by filters page
      localStorage.setItem('currentCoordinates', JSON.stringify({ lat, lng }));
    }

    setIsAnalyzingClimate(true);
    setError('');

    try {
      const result = await environmentalService.analyzeClimate({
        latitude: lat,
        longitude: lng,
        radius: 500,
        name: `Climate Analysis - ${lat.toFixed(4)}, ${lng.toFixed(4)}`
      });

      setClimateResult(result);
      setClimateData(result.stations || []);
    } catch (err) {
      setError('Failed to retrieve climate data. Please check your connection and try again.');
      console.error('Climate analysis error:', err);
    } finally {
      setIsAnalyzingClimate(false);
    }
  };
  return (
    <div className="bg-white">
      <section
        className="relative w-full h-[50vh] bg-cover bg-center text-white flex flex-col items-center justify-center"
        style={{ backgroundImage: "url('/siteimage.jpg')" }}
        data-ai-hint="aerial forest"
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-bold">Interactive Map</h1>
          <Button className="mt-6 bg-stone-700 hover:bg-stone-800 text-white px-10 py-6 text-lg rounded-lg">
            Open
          </Button>
        </div>
        <nav className="absolute bottom-0 left-0 right-0 z-10">
          <div className="container mx-auto">
            <div className="flex items-center gap-8 border-t border-stone-500 py-3 text-sm">
              <Link
                href="/analysis"
                className="flex items-center gap-1 text-white/80 hover:text-white"
              >
                ANALYSIS
              </Link>
              <Link href="/filters" className="text-white/80 hover:text-white">
                FILTERS
              </Link>
              <a href="#" className="text-white/80 hover:text-white">
                SOURCES
              </a>
              <a href="#" className="text-white/80 hover:text-white">
                FEEDBACK
              </a>
            </div>
          </div>
        </nav>
      </section>

      <main className="container mx-auto py-16 px-4 space-y-20">
        <section id="site-location">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-stone-800">
                Site Location
              </h2>
              <p className="text-stone-600 max-w-md">
                Enter the latitude and longitude co-ordinates or upload a kml
                file to obtain precise details on the site.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="latitude"
                    className="font-semibold text-stone-700"
                  >
                    Latitude
                  </Label>
                  <Input 
                    id="latitude" 
                    placeholder="e.g., 40.7128" 
                    className="mt-1"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    type="number"
                    step="any"
                    min="-90"
                    max="90"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="longitude"
                    className="font-semibold text-stone-700"
                  >
                    Longitude
                  </Label>
                  <Input
                    id="longitude"
                    placeholder="e.g., -74.0060"
                    className="mt-1"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    type="number"
                    step="any"
                    min="-180"
                    max="180"
                  />
                </div>
              </div>
              <div>
                <Label
                  htmlFor="kml-file"
                  className="font-semibold text-stone-700"
                >
                  Upload KML File
                </Label>
                <Button
                  variant="outline"
                  className="w-full mt-1 bg-stone-700 text-white hover:bg-stone-800 border-stone-700"
                >
                  Upload
                </Button>
              </div>
            </div>
            <div>
              <InteractiveMap
                latitude={validCoordinates ? lat : null}
                longitude={validCoordinates ? lng : null}
                radius={500}
                className="w-full h-[400px]"
              />
              {!validCoordinates && (latitude || longitude) && (
                <p className="text-sm text-red-600 mt-2">
                  Please enter valid coordinates (Latitude: -90 to 90, Longitude: -180 to 180)
                </p>
              )}
            </div>
          </div>
        </section>

        <section id="vegetation-analysis">
          <h2 className="text-4xl font-bold text-stone-800">
            Vegetation &amp; Terrain Analysis
          </h2>
          <p className="text-stone-600 mt-2 mb-6 max-w-2xl">
            Automatically retrieves vegetation, terrain slope, water bodies in
            and around your site
          </p>
          
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <VegetationMap
                latitude={validCoordinates ? lat : null}
                longitude={validCoordinates ? lng : null}
                radius={500}
                vegetationData={vegetationData}
                className="w-full h-[600px]"
              />
            </Card>
            
            <Button 
              onClick={handleVegetationAnalysis}
              disabled={!validCoordinates || isAnalyzing}
              className="w-full bg-stone-700 hover:bg-stone-800 text-white py-4 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-center"
            >
              {isAnalyzing ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Analyzing...
                </div>
              ) : (
                'Retrieve'
              )}
            </Button>
          </div>
          
          {analysisResult && (
            <div className="mt-4 space-y-2">
              <p className="text-center text-stone-600">
                Analysis completed! Found {analysisResult.features_count} environmental features.
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                <Link href="/filters">
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    View Interactive Filters Map
                  </Button>
                </Link>
                <Link href="/analysis">
                  <Button variant="outline" className="text-stone-700 border-stone-700 hover:bg-stone-50">
                    View Detailed Analysis Report
                  </Button>
                </Link>
                <a 
                  href="#" 
                  className="underline hover:text-stone-800 flex items-center text-stone-600"
                  onClick={(e) => {
                    e.preventDefault();
                    // TODO: Implement report download
                    alert('Report download functionality will be implemented soon!');
                  }}
                >
                  Download Vegetation Report
                </a>
              </div>
            </div>
          )}
          
          {!validCoordinates && (
            <p className="text-center mt-4 text-orange-600">
              Please enter valid coordinates in the Site Location section above to enable vegetation analysis.
            </p>
          )}
        </section>

        <section id="climate-conditions">
          <h2 className="text-4xl font-bold text-stone-800">
            Climate Conditions At Your Site
          </h2>
          <p className="text-stone-600 mt-2 mb-6 max-w-2xl">
            Automatically retrieves the temperature, humidity, sun exposure, and
            wind conditions at your site.
          </p>
          
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <ClimateMap
                latitude={validCoordinates ? lat : null}
                longitude={validCoordinates ? lng : null}
                radius={500}
                climateData={climateData}
                isLoading={isAnalyzingClimate}
                className="w-full h-[600px]"
              />
            </Card>
            
            <Button 
              onClick={handleClimateAnalysis}
              disabled={!validCoordinates || isAnalyzingClimate}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-center"
            >
              {isAnalyzingClimate ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Analyzing Climate...
                </div>
              ) : (
                'Retrieve Climate Data'
              )}
            </Button>
          </div>
          
          {climateResult && (
            <div className="mt-4 space-y-2">
              <p className="text-center text-stone-600">
                Climate analysis completed! Found {climateResult.stations_count} weather station(s).
              </p>
              {climateResult.current_weather && (
                <div className="text-center text-stone-600">
                  <p>Current conditions: {climateResult.current_weather.precipitation?.description || 'Data available'}</p>
                  {climateResult.current_weather.temperature?.current && (
                    <p>Temperature: {climateResult.current_weather.temperature.current}°C</p>
                  )}
                </div>
              )}
              <div className="flex justify-center gap-4 flex-wrap">
                <Link href="/filters">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    View Interactive Filters Map
                  </Button>
                </Link>
                <Link href="/analysis">
                  <Button variant="outline" className="text-blue-700 border-blue-700 hover:bg-blue-50">
                    View Detailed Climate Report
                  </Button>
                </Link>
                <a 
                  href="#" 
                  className="underline hover:text-stone-800 flex items-center text-stone-600"
                  onClick={(e) => {
                    e.preventDefault();
                    // TODO: Implement climate report download
                    alert('Climate report download functionality will be implemented soon!');
                  }}
                >
                  Download Climate Report
                </a>
              </div>
            </div>
          )}
          
          {!validCoordinates && (
            <p className="text-center mt-4 text-orange-600">
              Please enter valid coordinates in the Site Location section above to enable climate analysis.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}

export default LandingPage;
