// Meteostat API service for precipitation data

export interface MeteostatDataPoint {
  lat: number;
  lon: number;
  precipitation: number;
  date: string;
  location: string;
}

// Global grid points covering major regions
export const GLOBAL_GRID_POINTS = [
  // North America
  { lat: 40.7128, lon: -74.006, name: 'New York, USA' },
  { lat: 34.0522, lon: -118.2437, name: 'Los Angeles, USA' },
  { lat: 41.8781, lon: -87.6298, name: 'Chicago, USA' },
  { lat: 29.7604, lon: -95.3698, name: 'Houston, USA' },
  { lat: 49.2827, lon: -123.1207, name: 'Vancouver, Canada' },
  { lat: 25.7617, lon: -80.1918, name: 'Miami, USA' },
  { lat: 19.4326, lon: -99.1332, name: 'Mexico City, Mexico' },
  
  // South America
  { lat: -23.5505, lon: -46.6333, name: 'São Paulo, Brazil' },
  { lat: -34.6037, lon: -58.3816, name: 'Buenos Aires, Argentina' },
  { lat: -22.9068, lon: -43.1729, name: 'Rio de Janeiro, Brazil' },
  { lat: 4.7110, lon: -74.0721, name: 'Bogotá, Colombia' },
  { lat: -12.0464, lon: -77.0428, name: 'Lima, Peru' },
  { lat: -33.4489, lon: -70.6693, name: 'Santiago, Chile' },
  
  // Europe
  { lat: 51.5074, lon: -0.1278, name: 'London, UK' },
  { lat: 48.8566, lon: 2.3522, name: 'Paris, France' },
  { lat: 52.52, lon: 13.405, name: 'Berlin, Germany' },
  { lat: 41.9028, lon: 12.4964, name: 'Rome, Italy' },
  { lat: 40.4168, lon: -3.7038, name: 'Madrid, Spain' },
  { lat: 52.3676, lon: 4.9041, name: 'Amsterdam, Netherlands' },
  { lat: 55.7558, lon: 37.6173, name: 'Moscow, Russia' },
  { lat: 59.9139, lon: 10.7522, name: 'Oslo, Norway' },
  { lat: 48.2082, lon: 16.3738, name: 'Vienna, Austria' },
  
  // Asia
  { lat: 35.6762, lon: 139.6503, name: 'Tokyo, Japan' },
  { lat: 39.9042, lon: 116.4074, name: 'Beijing, China' },
  { lat: 31.2304, lon: 121.4737, name: 'Shanghai, China' },
  { lat: 22.3193, lon: 114.1694, name: 'Hong Kong' },
  { lat: 1.3521, lon: 103.8198, name: 'Singapore' },
  { lat: 28.6139, lon: 77.209, name: 'New Delhi, India' },
  { lat: 19.076, lon: 72.8777, name: 'Mumbai, India' },
  { lat: 13.7563, lon: 100.5018, name: 'Bangkok, Thailand' },
  { lat: 37.5665, lon: 126.978, name: 'Seoul, South Korea' },
  { lat: 14.5995, lon: 120.9842, name: 'Manila, Philippines' },
  { lat: -6.2088, lon: 106.8456, name: 'Jakarta, Indonesia' },
  { lat: 25.2048, lon: 55.2708, name: 'Dubai, UAE' },
  { lat: 35.6892, lon: 51.389, name: 'Tehran, Iran' },
  
  // Africa
  { lat: 30.0444, lon: 31.2357, name: 'Cairo, Egypt' },
  { lat: -33.9249, lon: 18.4241, name: 'Cape Town, South Africa' },
  { lat: -1.2921, lon: 36.8219, name: 'Nairobi, Kenya' },
  { lat: 6.5244, lon: 3.3792, name: 'Lagos, Nigeria' },
  { lat: 33.5731, lon: -7.5898, name: 'Casablanca, Morocco' },
  { lat: -26.2041, lon: 28.0473, name: 'Johannesburg, South Africa' },
  
  // Oceania
  { lat: -33.8688, lon: 151.2093, name: 'Sydney, Australia' },
  { lat: -37.8136, lon: 144.9631, name: 'Melbourne, Australia' },
  { lat: -36.8509, lon: 174.7645, name: 'Auckland, New Zealand' },
  { lat: -27.4698, lon: 153.0251, name: 'Brisbane, Australia' },
  { lat: -31.9505, lon: 115.8605, name: 'Perth, Australia' },
  
  // Additional strategic points for coverage
  { lat: 64.1466, lon: -21.9426, name: 'Reykjavik, Iceland' },
  { lat: -54.8019, lon: -68.303, name: 'Ushuaia, Argentina' },
  { lat: 78.2232, lon: 15.6267, name: 'Svalbard, Norway' },
  { lat: 21.3069, lon: -157.8583, name: 'Honolulu, Hawaii' },
  { lat: -17.7134, lon: 178.065, name: 'Suva, Fiji' },
];

// Simulated precipitation data with realistic patterns
function generateSimulatedPrecipitation(lat: number, lon: number): number {
  // Create semi-realistic precipitation patterns based on location
  const now = new Date();
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
  
  // Tropical regions (near equator) have higher baseline precipitation
  const tropicalFactor = Math.max(0, 1 - Math.abs(lat) / 30) * 40;
  
  // Monsoon season simulation for South/Southeast Asia
  const monsoonFactor = (lat > 0 && lat < 35 && lon > 60 && lon < 140 && dayOfYear > 150 && dayOfYear < 270)
    ? Math.random() * 60
    : 0;
  
  // Coastal regions tend to have more precipitation
  const coastalNoise = Math.sin(lon * 0.5) * 15;
  
  // Random daily variation
  const dailyVariation = Math.random() * 30;
  
  // Seasonal variation (more rain in certain seasons depending on hemisphere)
  const seasonalFactor = lat > 0
    ? Math.sin((dayOfYear / 365) * Math.PI * 2) * 15
    : Math.sin(((dayOfYear + 182) / 365) * Math.PI * 2) * 15;
  
  const basePrecipitation = 10 + tropicalFactor + monsoonFactor + coastalNoise + dailyVariation + seasonalFactor;
  
  return Math.max(0, Math.round(basePrecipitation * 10) / 10);
}

export async function fetchGlobalPrecipitationData(): Promise<MeteostatDataPoint[]> {
  // Note: In production, you would use the actual Meteostat API
  // For now, we'll use simulated data that follows realistic patterns
  
  // The Meteostat API requires a RapidAPI key and has rate limits
  // API endpoint: https://meteostat.p.rapidapi.com/point/daily
  
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const data: MeteostatDataPoint[] = GLOBAL_GRID_POINTS.map(point => ({
      lat: point.lat,
      lon: point.lon,
      precipitation: generateSimulatedPrecipitation(point.lat, point.lon),
      date: new Date().toISOString().split('T')[0],
      location: point.name,
    }));
    
    return data;
  } catch (error) {
    console.error('Error fetching precipitation data:', error);
    throw error;
  }
}

// Real Meteostat API call (for future implementation with valid API key)
export async function fetchMeteostatData(
  lat: number,
  lon: number,
  apiKey: string
): Promise<{ precipitation: number; date: string } | null> {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const startDate = yesterday.toISOString().split('T')[0];
  const endDate = startDate;
  
  try {
    const response = await fetch(
      `https://meteostat.p.rapidapi.com/point/daily?lat=${lat}&lon=${lon}&start=${startDate}&end=${endDate}`,
      {
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': 'meteostat.p.rapidapi.com',
        },
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch Meteostat data');
    }
    
    const result = await response.json();
    const data = result.data?.[0];
    
    return {
      precipitation: data?.prcp || 0,
      date: data?.date || startDate,
    };
  } catch (error) {
    console.error('Meteostat API error:', error);
    return null;
  }
}
