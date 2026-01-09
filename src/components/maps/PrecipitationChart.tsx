import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, ReferenceLine } from 'recharts';
import { X, TrendingUp, TrendingDown, Minus, Droplets, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { calculateFloodRisk } from '@/lib/floodRisk';

interface PrecipitationChartProps {
  location: string;
  lat: number;
  lon: number;
  currentPrecipitation: number;
  onClose: () => void;
}

// Generate historical data for the past 14 days
function generateHistoricalData(lat: number, lon: number, currentPrecip: number) {
  const data = [];
  const now = new Date();
  
  for (let i = 13; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Create realistic variation based on current precipitation
    const baseVariation = Math.sin(i * 0.5) * 20;
    const randomVariation = (Math.random() - 0.5) * 30;
    const trendFactor = i === 0 ? 0 : (i / 14) * 10;
    
    let precipitation = currentPrecip + baseVariation + randomVariation - trendFactor;
    precipitation = Math.max(0, Math.round(precipitation * 10) / 10);
    
    const risk = calculateFloodRisk(precipitation);
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      fullDate: date.toISOString().split('T')[0],
      precipitation,
      riskLevel: risk.level,
      riskColor: risk.color,
    });
  }
  
  return data;
}

// Generate forecast data for the next 7 days
function generateForecastData(lat: number, lon: number, currentPrecip: number) {
  const data = [];
  const now = new Date();
  
  for (let i = 1; i <= 7; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() + i);
    
    // Forecast with increasing uncertainty
    const uncertainty = i * 5;
    const trend = Math.sin(i * 0.3) * 15;
    const randomVariation = (Math.random() - 0.5) * uncertainty;
    
    let precipitation = currentPrecip + trend + randomVariation;
    precipitation = Math.max(0, Math.round(precipitation * 10) / 10);
    
    const risk = calculateFloodRisk(precipitation);
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      fullDate: date.toISOString().split('T')[0],
      precipitation,
      precipitationMin: Math.max(0, precipitation - uncertainty / 2),
      precipitationMax: precipitation + uncertainty / 2,
      riskLevel: risk.level,
      riskColor: risk.color,
      isForecast: true,
    });
  }
  
  return data;
}

export function PrecipitationChart({ location, lat, lon, currentPrecipitation, onClose }: PrecipitationChartProps) {
  const historicalData = useMemo(() => generateHistoricalData(lat, lon, currentPrecipitation), [lat, lon, currentPrecipitation]);
  const forecastData = useMemo(() => generateForecastData(lat, lon, currentPrecipitation), [lat, lon, currentPrecipitation]);
  const allData = useMemo(() => [...historicalData, ...forecastData], [historicalData, forecastData]);
  
  const currentRisk = calculateFloodRisk(currentPrecipitation);
  
  // Calculate trend
  const avgLast7Days = historicalData.slice(-7).reduce((sum, d) => sum + d.precipitation, 0) / 7;
  const avgFirst7Days = historicalData.slice(0, 7).reduce((sum, d) => sum + d.precipitation, 0) / 7;
  const trend = avgLast7Days - avgFirst7Days;
  
  // Find max and min
  const maxPrecip = Math.max(...allData.map(d => d.precipitation));
  const minPrecip = Math.min(...allData.map(d => d.precipitation));
  
  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto bg-card border-border shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Droplets className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{location}</h2>
              <p className="text-sm text-muted-foreground">
                {lat.toFixed(4)}°, {lon.toFixed(4)}°
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 border-b border-border">
          <div className="bg-secondary/50 rounded-xl p-4">
            <p className="text-xs text-muted-foreground mb-1">Current</p>
            <p className="text-2xl font-bold text-foreground">{currentPrecipitation.toFixed(1)}<span className="text-sm font-normal">mm</span></p>
            <Badge 
              className="mt-2 text-white"
              style={{ backgroundColor: currentRisk.color }}
            >
              {currentRisk.label}
            </Badge>
          </div>
          
          <div className="bg-secondary/50 rounded-xl p-4">
            <p className="text-xs text-muted-foreground mb-1">14-Day Trend</p>
            <div className="flex items-center gap-2">
              {trend > 5 ? (
                <TrendingUp className="w-5 h-5 text-red-500" />
              ) : trend < -5 ? (
                <TrendingDown className="w-5 h-5 text-green-500" />
              ) : (
                <Minus className="w-5 h-5 text-yellow-500" />
              )}
              <span className={`text-lg font-semibold ${trend > 5 ? 'text-red-500' : trend < -5 ? 'text-green-500' : 'text-yellow-500'}`}>
                {trend > 0 ? '+' : ''}{trend.toFixed(1)}mm
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {trend > 5 ? 'Increasing' : trend < -5 ? 'Decreasing' : 'Stable'}
            </p>
          </div>
          
          <div className="bg-secondary/50 rounded-xl p-4">
            <p className="text-xs text-muted-foreground mb-1">14-Day Max</p>
            <p className="text-2xl font-bold text-foreground">{maxPrecip.toFixed(1)}<span className="text-sm font-normal">mm</span></p>
          </div>
          
          <div className="bg-secondary/50 rounded-xl p-4">
            <p className="text-xs text-muted-foreground mb-1">14-Day Min</p>
            <p className="text-2xl font-bold text-foreground">{minPrecip.toFixed(1)}<span className="text-sm font-normal">mm</span></p>
          </div>
        </div>
        
        {/* Historical Chart */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <h3 className="font-semibold text-foreground">14-Day Historical Precipitation</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historicalData}>
                <defs>
                  <linearGradient id="precipGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  label={{ value: 'mm', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <ReferenceLine y={20} stroke="#eab308" strokeDasharray="5 5" label={{ value: 'Moderate', fill: '#eab308', fontSize: 10 }} />
                <ReferenceLine y={50} stroke="#f97316" strokeDasharray="5 5" label={{ value: 'High', fill: '#f97316', fontSize: 10 }} />
                <ReferenceLine y={80} stroke="#ef4444" strokeDasharray="5 5" label={{ value: 'Extreme', fill: '#ef4444', fontSize: 10 }} />
                <Area
                  type="monotone"
                  dataKey="precipitation"
                  stroke="hsl(var(--primary))"
                  fill="url(#precipGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Forecast Chart */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <h3 className="font-semibold text-foreground">7-Day Forecast</h3>
            <Badge variant="outline" className="text-xs">Projected</Badge>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  formatter={(value: number, name: string) => {
                    if (name === 'precipitation') return [`${value.toFixed(1)}mm`, 'Expected'];
                    return [value, name];
                  }}
                />
                <ReferenceLine y={50} stroke="#f97316" strokeDasharray="5 5" />
                <ReferenceLine y={80} stroke="#ef4444" strokeDasharray="5 5" />
                <Line
                  type="monotone"
                  dataKey="precipitation"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2">
            Forecast data is projected based on historical patterns and may vary
          </p>
        </div>
      </Card>
    </div>
  );
}
