import { Building, Users, Truck, MapPin } from 'lucide-react';
import type { SimulationResult } from '@/types';

interface SimulationResultsProps {
  result: SimulationResult | null;
}

export function SimulationResults({ result }: SimulationResultsProps) {
  if (!result) {
    return (
      <div className="bg-card rounded-xl border border-border p-6 h-full flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <p className="text-lg font-medium mb-2">No Simulation Data</p>
          <p className="text-sm">Run a simulation to see flood impact results</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border p-6 space-y-6 animate-fade-in">
      <h3 className="text-lg font-semibold">Simulation Results</h3>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-5 h-5 text-neer-sky" />
            <span className="text-sm text-muted-foreground">Affected Area</span>
          </div>
          <p className="text-2xl font-bold">{result.affectedArea.toFixed(1)} km²</p>
        </div>
        
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-risk-high" />
            <span className="text-sm text-muted-foreground">Population at Risk</span>
          </div>
          <p className="text-2xl font-bold">{result.populationAtRisk.toLocaleString()}</p>
        </div>
      </div>
      
      {/* Infrastructure Impact */}
      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-3">Infrastructure Impact</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">Roads Affected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-risk-moderate rounded-full transition-all duration-500"
                  style={{ width: `${result.infrastructureImpact.roads}%` }}
                />
              </div>
              <span className="text-sm font-medium w-12 text-right">{result.infrastructureImpact.roads}%</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">Buildings Affected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-risk-high rounded-full transition-all duration-500"
                  style={{ width: `${result.infrastructureImpact.buildings}%` }}
                />
              </div>
              <span className="text-sm font-medium w-12 text-right">{result.infrastructureImpact.buildings}%</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 text-center">🌾</span>
              <span className="text-sm">Agriculture Affected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-risk-severe rounded-full transition-all duration-500"
                  style={{ width: `${result.infrastructureImpact.agriculture}%` }}
                />
              </div>
              <span className="text-sm font-medium w-12 text-right">{result.infrastructureImpact.agriculture}%</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Evacuation Zones */}
      {result.evacuationZones.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-3">
            Evacuation Zones ({result.evacuationZones.length})
          </h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {result.evacuationZones.map((zone, i) => (
              <div 
                key={i}
                className="flex items-center gap-2 bg-risk-severe/10 rounded-lg px-3 py-2 text-sm"
              >
                <span className="w-2 h-2 bg-risk-severe rounded-full animate-pulse" />
                <span>Zone {i + 1}: {zone.city || `${zone.lat.toFixed(4)}, ${zone.lon.toFixed(4)}`}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
