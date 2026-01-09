import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cloud, Droplets, Wind, Gauge, Thermometer, MapPin, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/useAppStore';
import { fetchWeatherData, calculateFloodRisk } from '@/lib/weather';
import { RiskBadge } from '@/components/ui/RiskBadge';

export function WeatherCard() {
  const { 
    userLocation, 
    weatherData, 
    setWeatherData, 
    isLoadingWeather, 
    setIsLoadingWeather,
    floodPrediction,
    setFloodPrediction,
    setUserLocation
  } = useAppStore();
  
  const fetchData = async () => {
    if (!userLocation) return;
    
    setIsLoadingWeather(true);
    try {
      const data = await fetchWeatherData(userLocation.lat, userLocation.lon);
      setWeatherData(data);
      
      const prediction = calculateFloodRisk(data);
      setFloodPrediction(prediction);
    } catch (error) {
      console.error('Failed to fetch weather:', error);
    } finally {
      setIsLoadingWeather(false);
    }
  };
  
  useEffect(() => {
    // Try to get user location on mount
    if (!userLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        },
        () => {
          // Default to Delhi if geolocation fails
          setUserLocation({ lat: 28.6139, lon: 77.2090 });
        }
      );
    }
  }, []);
  
  useEffect(() => {
    if (userLocation) {
      fetchData();
    }
  }, [userLocation]);
  
  if (isLoadingWeather || !weatherData) {
    return (
      <div className="stat-card animate-pulse">
        <div className="h-6 w-32 bg-muted rounded mb-4" />
        <div className="h-10 w-24 bg-muted rounded mb-4" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-16 bg-muted rounded" />
          <div className="h-16 bg-muted rounded" />
        </div>
      </div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="stat-card"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-neer-sky" />
          <span className="font-medium">{weatherData.city}, {weatherData.country}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={fetchData}
          disabled={isLoadingWeather}
          className="h-8 w-8"
        >
          <RefreshCw className={`w-4 h-4 ${isLoadingWeather ? 'animate-spin' : ''}`} />
        </Button>
      </div>
      
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Thermometer className="w-8 h-8 text-risk-moderate" />
          <span className="text-4xl font-bold">{weatherData.temp}°C</span>
        </div>
        <div>
          <p className="text-sm text-muted-foreground capitalize">{weatherData.description}</p>
          {floodPrediction && (
            <RiskBadge level={floodPrediction.riskLevel} size="sm" className="mt-1" />
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
          <Droplets className="w-5 h-5 text-neer-sky" />
          <div>
            <p className="text-xs text-muted-foreground">Humidity</p>
            <p className="font-semibold">{weatherData.humidity}%</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
          <Wind className="w-5 h-5 text-neer-teal" />
          <div>
            <p className="text-xs text-muted-foreground">Wind Speed</p>
            <p className="font-semibold">{weatherData.windSpeed} m/s</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
          <Gauge className="w-5 h-5 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Pressure</p>
            <p className="font-semibold">{weatherData.pressure} hPa</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
          <Cloud className="w-5 h-5 text-neer-water" />
          <div>
            <p className="text-xs text-muted-foreground">Rainfall</p>
            <p className="font-semibold">{weatherData.rainfall || 0} mm</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
