import { useState, useCallback } from 'react';
import { Waves, Settings2, MapPin } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { FloodMap } from '@/components/maps/FloodMap';
import { SimulatorControls, SimulationResults } from '@/components/simulation/SimulatorControls';
import type { SimulationParams, SimulationResult } from '@/types';

export default function Simulation() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);
  
  const runSimulation = useCallback(async (params: SimulationParams) => {
    setIsSimulating(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    const severity = (params.rainfallIntensity + params.riverOverflow) / 2;
    const terrainMultiplier = params.terrainType === 'urban' ? 1.3 : params.terrainType === 'rural' ? 0.8 : 1;
    
    setResult({
      affectedArea: Math.round((severity / 100) * 450 * terrainMultiplier),
      populationAtRisk: Math.round((severity / 100) * 125000 * terrainMultiplier),
      infrastructureImpact: {
        roads: Math.min(95, Math.round(severity * 1.1)),
        buildings: Math.min(90, Math.round(severity * 0.9)),
        agriculture: Math.min(85, Math.round(severity * (params.terrainType === 'rural' ? 1.2 : 0.7))),
      },
      evacuationZones: severity > 60 ? [{ lat: 26.8467, lon: 80.9462 }, { lat: 25.5941, lon: 85.1376 }] : [],
    });
    setIsSimulating(false);
  }, []);
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Waves className="w-4 h-4" />
              <span className="text-sm">Inundation Modeling</span>
            </div>
            <h1 className="text-3xl font-bold">Flood Simulation</h1>
            <p className="text-muted-foreground mt-1">Simulate flood scenarios and predict potential impact</p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="animate-fade-in">
              <SimulatorControls onSimulate={runSimulation} isSimulating={isSimulating} />
            </div>
            
            <div className="lg:col-span-2 space-y-6 animate-fade-in">
              <div className="stat-card p-0 overflow-hidden">
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-neer-sky" />
                      Simulation Map
                    </h2>
                    <p className="text-sm text-muted-foreground">Projected flood extent</p>
                  </div>
                  {isSimulating && (
                    <div className="flex items-center gap-2 text-sm text-neer-sky">
                      <div className="w-4 h-4 border-2 border-neer-sky border-t-transparent rounded-full animate-spin" />
                      Simulating...
                    </div>
                  )}
                </div>
                <FloodMap height="400px" />
              </div>
              
              <SimulationResults result={result} />
              
              {result && result.affectedArea > 100 && (
                <div className="stat-card border-neer-sky/20 animate-fade-in">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Settings2 className="w-5 h-5 text-neer-sky" />
                    Mitigation Recommendations
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { title: 'Drainage Improvement', description: 'Enhance stormwater drainage capacity', priority: 'High' },
                      { title: 'Temporary Barriers', description: 'Deploy portable flood barriers', priority: 'High' },
                      { title: 'Evacuation Routes', description: 'Establish clear evacuation paths', priority: 'Critical' },
                      { title: 'Land-Use Optimization', description: 'Restrict development in flood zones', priority: 'Medium' },
                    ].map((rec, index) => (
                      <div key={index} className="p-4 bg-secondary/50 rounded-lg border border-border">
                        <div className="flex items-start justify-between mb-2">
                          <p className="font-medium">{rec.title}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${rec.priority === 'Critical' ? 'bg-risk-severe/20 text-risk-severe' : rec.priority === 'High' ? 'bg-risk-high/20 text-risk-high' : 'bg-risk-moderate/20 text-risk-moderate'}`}>
                            {rec.priority}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{rec.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
