import { motion } from 'framer-motion';
import { MapPin, AlertTriangle, Activity } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { AlertBanner } from '@/components/alerts/AlertBanner';
import { FloodMap } from '@/components/maps/FloodMap';
import { WeatherCard } from '@/components/weather/WeatherCard';
import { FloodProbability } from '@/components/forecast/FloodProbability';
import { EmergencySOS } from '@/components/emergency/EmergencySOS';
import { StatCard } from '@/components/ui/StatCard';
import { useAppStore } from '@/store/useAppStore';

export default function Dashboard() {
  const { userLocation, weatherData, floodPrediction } = useAppStore();
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <AlertBanner />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">
                {weatherData 
                  ? `${weatherData.city}, ${weatherData.country}` 
                  : 'Detecting location...'
                }
              </span>
            </div>
            <h1 className="text-3xl font-bold">Flood Risk Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Real-time monitoring and forecasting for your region
            </p>
          </motion.div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              title="Current Risk Level"
              value={floodPrediction?.riskLevel?.toUpperCase() || 'ANALYZING'}
              subtitle="Based on current conditions"
              icon={AlertTriangle}
              variant={
                floodPrediction?.riskLevel === 'severe' ? 'danger' :
                floodPrediction?.riskLevel === 'high' ? 'warning' :
                floodPrediction?.riskLevel === 'moderate' ? 'warning' :
                'success'
              }
            />
            <StatCard
              title="Flood Probability"
              value={`${floodPrediction?.probability || 0}%`}
              subtitle="Next 24 hours"
              icon={Activity}
              variant="primary"
            />
            <StatCard
              title="Active Alerts"
              value="2"
              subtitle="In your region"
              icon={AlertTriangle}
              variant="warning"
              trend={{ value: 15, isPositive: false }}
            />
            <StatCard
              title="Monitoring Status"
              value="ACTIVE"
              subtitle="Real-time updates"
              icon={Activity}
              variant="success"
            />
          </div>
          
          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Map - Takes 2 columns */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2"
            >
              <div className="stat-card p-0 overflow-hidden">
                <div className="p-4 border-b border-border">
                  <h2 className="font-semibold">Interactive Flood Risk Map</h2>
                  <p className="text-sm text-muted-foreground">
                    Click on regions to view detailed risk information
                  </p>
                </div>
                <FloodMap height="500px" />
              </div>
            </motion.div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              <WeatherCard />
              <FloodProbability />
            </div>
          </div>
          
          {/* Emergency Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <EmergencySOS />
          </motion.div>
        </div>
      </main>
    </div>
  );
}
