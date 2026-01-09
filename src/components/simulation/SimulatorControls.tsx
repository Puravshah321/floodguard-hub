import { useState } from 'react';
import { CloudRain, Waves, Building2, TreePine, Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import type { SimulationParams, SimulationResult } from '@/types';

interface SimulatorControlsProps {
  onSimulate: (params: SimulationParams) => void;
  isSimulating: boolean;
}

export function SimulatorControls({ onSimulate, isSimulating }: SimulatorControlsProps) {
  const [params, setParams] = useState<SimulationParams>({
    rainfallIntensity: 50,
    riverOverflow: 30,
    terrainType: 'mixed',
    duration: 24,
  });
  
  const terrainOptions = [
    { value: 'urban', label: 'Urban', icon: Building2 },
    { value: 'rural', label: 'Rural', icon: TreePine },
    { value: 'mixed', label: 'Mixed', icon: Building2 },
  ] as const;
  
  return (
    <div className="stat-card">
      <h3 className="text-lg font-semibold mb-6">Simulation Parameters</h3>
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CloudRain className="w-4 h-4 text-neer-sky" />
            <span className="text-sm font-medium">Rainfall Intensity</span>
          </div>
          <span className="text-sm font-bold text-neer-sky">{params.rainfallIntensity}%</span>
        </div>
        <Slider value={[params.rainfallIntensity]} onValueChange={([v]) => setParams({ ...params, rainfallIntensity: v })} max={100} step={5} />
      </div>
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Waves className="w-4 h-4 text-neer-water" />
            <span className="text-sm font-medium">River Overflow</span>
          </div>
          <span className="text-sm font-bold text-neer-water">{params.riverOverflow}%</span>
        </div>
        <Slider value={[params.riverOverflow]} onValueChange={([v]) => setParams({ ...params, riverOverflow: v })} max={100} step={5} />
      </div>
      
      <div className="mb-6">
        <span className="text-sm font-medium mb-3 block">Terrain Type</span>
        <div className="grid grid-cols-3 gap-2">
          {terrainOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setParams({ ...params, terrainType: option.value })}
              className={cn('flex flex-col items-center gap-1 p-3 rounded-lg border transition-all', params.terrainType === option.value ? 'border-neer-sky bg-neer-sky/10 text-neer-sky' : 'border-border hover:border-neer-sky/50')}
            >
              <option.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{option.label}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium">Duration</span>
          <span className="text-sm font-bold">{params.duration}h</span>
        </div>
        <Slider value={[params.duration]} onValueChange={([v]) => setParams({ ...params, duration: v })} min={6} max={72} step={6} />
      </div>
      
      <div className="flex gap-3">
        <Button variant="outline" className="flex-1" onClick={() => setParams({ rainfallIntensity: 50, riverOverflow: 30, terrainType: 'mixed', duration: 24 })}>
          <RotateCcw className="w-4 h-4" /> Reset
        </Button>
        <Button variant="hero" className="flex-1" onClick={() => onSimulate(params)} disabled={isSimulating}>
          <Play className="w-4 h-4" /> {isSimulating ? 'Running...' : 'Simulate'}
        </Button>
      </div>
    </div>
  );
}

export function SimulationResults({ result }: { result: SimulationResult | null }) {
  if (!result) {
    return (
      <div className="stat-card">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Waves className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="font-medium mb-1">No Simulation Results</h3>
          <p className="text-sm text-muted-foreground">Configure parameters and run a simulation</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="stat-card animate-scale-in">
      <h3 className="text-lg font-semibold mb-6">Simulation Results</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-risk-severe/10 rounded-xl border border-risk-severe/20">
          <p className="text-sm text-muted-foreground mb-1">Affected Area</p>
          <p className="text-2xl font-bold text-risk-severe">{result.affectedArea} km²</p>
        </div>
        <div className="p-4 bg-risk-high/10 rounded-xl border border-risk-high/20">
          <p className="text-sm text-muted-foreground mb-1">Population at Risk</p>
          <p className="text-2xl font-bold text-risk-high">{result.populationAtRisk.toLocaleString()}</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <h4 className="text-sm font-medium">Infrastructure Impact</h4>
        {[
          { label: 'Roads', value: result.infrastructureImpact.roads, color: 'bg-risk-severe' },
          { label: 'Buildings', value: result.infrastructureImpact.buildings, color: 'bg-risk-high' },
          { label: 'Agriculture', value: result.infrastructureImpact.agriculture, color: 'bg-risk-moderate' },
        ].map((item) => (
          <div key={item.label}>
            <div className="flex justify-between text-sm mb-1">
              <span>{item.label}</span>
              <span className="font-medium">{item.value}%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div className={cn('h-full rounded-full transition-all duration-700', item.color)} style={{ width: `${item.value}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
