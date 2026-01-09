export type RiskLevel = 'low' | 'moderate' | 'high' | 'severe';

export interface WeatherData {
  temp: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  description: string;
  icon: string;
  rainfall?: number;
  city: string;
  country: string;
}

export interface FloodPrediction {
  riskLevel: RiskLevel;
  probability: number;
  factors: {
    rainfall: number;
    humidity: number;
    pressure: number;
    historicalRisk: number;
  };
  recommendations: string[];
}

export interface Location {
  lat: number;
  lon: number;
  city?: string;
  state?: string;
}

export interface Alert {
  id: string;
  type: 'warning' | 'danger' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  location?: string;
  isRead: boolean;
}

export interface FloodReport {
  id: string;
  userId: string;
  imageUrl: string;
  location: Location;
  timestamp: Date;
  status: 'pending' | 'approved' | 'flagged';
  analysisResult?: {
    floodDetected: boolean;
    confidence: number;
    pixelRatio: number;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  location?: Location;
}

export interface SimulationParams {
  rainfallIntensity: number; // 0-100
  riverOverflow: number; // 0-100
  terrainType: 'urban' | 'rural' | 'mixed';
  duration: number; // hours
}

export interface SimulationResult {
  affectedArea: number; // sq km
  populationAtRisk: number;
  infrastructureImpact: {
    roads: number;
    buildings: number;
    agriculture: number;
  };
  evacuationZones: Location[];
}
