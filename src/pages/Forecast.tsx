import { motion } from 'framer-motion';
import { CloudRain, TrendingUp, Calendar, MapPin } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { WeatherCard } from '@/components/weather/WeatherCard';
import { FloodProbability } from '@/components/forecast/FloodProbability';
import { FloodMap } from '@/components/maps/FloodMap';
import { StatCard } from '@/components/ui/StatCard';
import { useAppStore } from '@/store/useAppStore';

export default function Forecast() {
  const { weatherData, floodPrediction } = useAppStore();
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <CloudRain className="w-4 h-4" />
              <span className="text-sm">Weather-Based Analysis</span>
            </div>
            <h1 className="text-3xl font-bold">Flood Forecast</h1>
            <p className="text-muted-foreground mt-1">
              AI-powered predictions based on meteorological data
            </p>
          </motion.div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              title="Temperature"
              value={`${weatherData?.temp || '--'}°C`}
              subtitle={weatherData?.description || 'Loading...'}
              icon={TrendingUp}
            />
            <StatCard
              title="Humidity"
              value={`${weatherData?.humidity || '--'}%`}
              subtitle="Atmospheric moisture"
              icon={CloudRain}
              variant="primary"
            />
            <StatCard
              title="Rainfall"
              value={`${weatherData?.rainfall || 0} mm`}
              subtitle="Last hour"
              icon={CloudRain}
              variant={weatherData?.rainfall && weatherData.rainfall > 10 ? 'warning' : 'default'}
            />
            <StatCard
              title="Forecast Range"
              value="24-72h"
              subtitle="Prediction window"
              icon={Calendar}
            />
          </div>
          
          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Weather & Probability */}
            <div className="space-y-6">
              <WeatherCard />
              <FloodProbability />
            </div>
            
            {/* Map */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="stat-card p-0 overflow-hidden h-full">
                <div className="p-4 border-b border-border">
                  <h2 className="font-semibold flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-neer-sky" />
                    Regional Risk Overview
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Current flood risk distribution across India
                  </p>
                </div>
                <FloodMap height="580px" />
              </div>
            </motion.div>
          </div>
          
          {/* Methodology Note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 stat-card bg-secondary/30"
          >
            <h3 className="font-semibold mb-2">Forecast Methodology</h3>
            <p className="text-sm text-muted-foreground">
              Our flood probability model analyzes real-time weather data from OpenWeather API, 
              combining rainfall intensity, atmospheric humidity, barometric pressure, and historical 
              flood patterns to generate accurate risk assessments. The model is continuously refined 
              with crowdsourced ground reports and satellite imagery analysis.
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
