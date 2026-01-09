import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { GlobalFloodMap } from '@/components/maps/GlobalFloodMap';
import { Globe2, Droplets, AlertTriangle, Info, Bell, Layers, BarChart3 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RISK_LEVELS } from '@/lib/floodRisk';

export default function GlobalFloodRiskMap() {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        {/* Header Section */}
        <div className="bg-gradient-to-b from-primary/5 to-background border-b border-border">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Globe2 className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Global Flood Risk Map</h1>
                  <p className="text-muted-foreground">
                    Real-time precipitation monitoring and flood risk assessment worldwide
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="gap-2 py-2 px-3">
                  <Droplets className="w-4 h-4 text-primary" />
                  <span>Live Data</span>
                </Badge>
                <Badge variant="outline" className="gap-2 py-2 px-3">
                  <Bell className="w-4 h-4 text-primary" />
                  <span>Alerts</span>
                </Badge>
                <button
                  onClick={() => setShowInfo(!showInfo)}
                  className="p-2 rounded-lg hover:bg-secondary transition-colors"
                >
                  <Info className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
            </div>
            
            {/* Info Panel */}
            {showInfo && (
              <Card className="mt-4 p-4 bg-card/50 backdrop-blur-sm animate-fade-in">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                      <div className="w-4 h-4 rounded-full bg-green-500" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Low Risk</h4>
                      <p className="text-xs text-muted-foreground">Precipitation &lt; 20mm</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                      <div className="w-4 h-4 rounded-full bg-yellow-500" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Moderate Risk</h4>
                      <p className="text-xs text-muted-foreground">Precipitation 20-50mm</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                      <div className="w-4 h-4 rounded-full bg-orange-500" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">High Risk</h4>
                      <p className="text-xs text-muted-foreground">Precipitation 50-80mm</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
                      <div className="w-4 h-4 rounded-full bg-red-500" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Extreme Risk</h4>
                      <p className="text-xs text-muted-foreground">Precipitation &gt; 80mm</p>
                    </div>
                  </div>
                </div>
                
                {/* Features Info */}
                <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-3">
                    <Layers className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Heatmap View</p>
                      <p className="text-xs text-muted-foreground">Toggle between circle and heatmap layers</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Trend Analysis</p>
                      <p className="text-xs text-muted-foreground">View 14-day history and 7-day forecast</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Push Alerts</p>
                      <p className="text-xs text-muted-foreground">Get notified for extreme risks</p>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
        
        {/* Map Section */}
        <div className="h-[calc(100vh-12rem)]">
          <GlobalFloodMap />
        </div>
        
        {/* Quick Stats Footer */}
        <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border py-3 z-40">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between gap-4 overflow-x-auto">
              <div className="flex items-center gap-6 text-sm">
                {RISK_LEVELS.map((risk) => (
                  <div key={risk.level} className="flex items-center gap-2 whitespace-nowrap">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: risk.color }}
                    />
                    <span className="text-muted-foreground">{risk.label}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center gap-4 text-xs text-muted-foreground whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Auto-refresh: 5 min</span>
                </div>
                <div className="hidden md:flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  <span>Click zones for alerts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
