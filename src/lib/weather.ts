import type { WeatherData, FloodPrediction, RiskLevel } from '@/types';

const API_KEY = '17ed2abe6094c7c5c2b074b92351b835';

export async function fetchWeatherData(lat: number, lon: number): Promise<WeatherData> {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch weather data');
  }
  
  const data = await response.json();
  
  return {
    temp: Math.round(data.main.temp),
    humidity: data.main.humidity,
    pressure: data.main.pressure,
    windSpeed: data.wind.speed,
    description: data.weather[0].description,
    icon: data.weather[0].icon,
    rainfall: data.rain?.['1h'] || data.rain?.['3h'] || 0,
    city: data.name,
    country: data.sys.country,
  };
}

export function calculateFloodRisk(weather: WeatherData): FloodPrediction {
  // Normalize factors to 0-100 scale
  const rainfallFactor = Math.min((weather.rainfall || 0) * 10, 100);
  const humidityFactor = weather.humidity;
  const pressureFactor = Math.max(0, 100 - ((weather.pressure - 980) / 40) * 100);
  
  // Historical risk is simulated based on location
  const historicalRisk = 30 + Math.random() * 20;
  
  // Weighted average
  const probability = Math.round(
    rainfallFactor * 0.4 +
    humidityFactor * 0.25 +
    pressureFactor * 0.2 +
    historicalRisk * 0.15
  );
  
  let riskLevel: RiskLevel;
  let recommendations: string[];
  
  if (probability < 25) {
    riskLevel = 'low';
    recommendations = [
      'Normal conditions - no immediate action required',
      'Stay informed about weather updates',
      'Ensure emergency kit is prepared',
    ];
  } else if (probability < 50) {
    riskLevel = 'moderate';
    recommendations = [
      'Monitor weather conditions closely',
      'Review evacuation routes',
      'Secure loose outdoor items',
      'Check drainage systems',
    ];
  } else if (probability < 75) {
    riskLevel = 'high';
    recommendations = [
      'Prepare for potential evacuation',
      'Move valuables to higher ground',
      'Stock emergency supplies',
      'Stay away from low-lying areas',
      'Keep emergency contacts ready',
    ];
  } else {
    riskLevel = 'severe';
    recommendations = [
      'Evacuate if advised by authorities',
      'Avoid all flood-prone areas',
      'Do not attempt to cross flooded roads',
      'Contact emergency services if stranded',
      'Move to higher ground immediately',
    ];
  }
  
  return {
    riskLevel,
    probability,
    factors: {
      rainfall: rainfallFactor,
      humidity: humidityFactor,
      pressure: pressureFactor,
      historicalRisk,
    },
    recommendations,
  };
}

export function getRiskColor(level: RiskLevel): string {
  switch (level) {
    case 'low': return 'hsl(var(--risk-low))';
    case 'moderate': return 'hsl(var(--risk-moderate))';
    case 'high': return 'hsl(var(--risk-high))';
    case 'severe': return 'hsl(var(--risk-severe))';
  }
}

export function getRiskBgClass(level: RiskLevel): string {
  switch (level) {
    case 'low': return 'bg-risk-low';
    case 'moderate': return 'bg-risk-moderate';
    case 'high': return 'bg-risk-high';
    case 'severe': return 'bg-risk-severe';
  }
}
