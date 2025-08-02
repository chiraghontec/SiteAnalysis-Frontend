// API service for environmental analysis
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface AnalysisRequest {
  latitude: number;
  longitude: number;
  radius?: number;
  name?: string;
}

export interface EnvironmentalFeature {
  id: number;
  feature_type: string;
  osm_id: number;
  geometry: any;
  properties: any;
}

export interface AnalysisResponse {
  id: number;
  name: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  radius: number;
  features_count: number;
  summary: any;
  created_at: string;
  features?: EnvironmentalFeature[];
}

export interface ClimateStation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  temperature?: number;
  humidity?: number;
  windSpeed?: number;
  pressure?: number;
  description?: string;
}

export interface ClimateResponse {
  id: number;
  name: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  radius: number;
  current_weather: any;
  stations_count: number;
  summary: any;
  created_at: string;
  stations?: ClimateStation[];
}

class EnvironmentalAnalysisService {
  async analyzeVegetation(request: AnalysisRequest): Promise<AnalysisResponse> {
    try {
      console.log('Making API request to:', `${API_BASE_URL}/environmental/analyze`);
      console.log('Request data:', request);
      
      const response = await fetch(`${API_BASE_URL}/environmental/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log('Response data:', data);
      return data;
    } catch (error) {
      console.error('Error analyzing vegetation:', error);
      throw error;
    }
  }

  async getAnalysisDetails(analysisId: number): Promise<AnalysisResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/environmental/analysis/${analysisId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching analysis details:', error);
      throw error;
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/environmental/test`);
      return response.ok;
    } catch (error) {
      console.error('Error testing API connection:', error);
      return false;
    }
  }

  async analyzeClimate(request: AnalysisRequest): Promise<ClimateResponse> {
    try {
      console.log('Making climate API request to:', `${API_BASE_URL}/environmental/climate`);
      console.log('Request data:', request);
      
      const response = await fetch(`${API_BASE_URL}/environmental/climate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      console.log('Climate response status:', response.status);
      console.log('Climate response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Climate error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log('Climate response data:', data);
      return data;
    } catch (error) {
      console.error('Error analyzing climate:', error);
      throw error;
    }
  }
}

export const environmentalService = new EnvironmentalAnalysisService();
