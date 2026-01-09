import { AlertTriangle, TrendingUp, Droplets, Gauge, History } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useAppStore } from '@/store/useAppStore';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { cn } from '@/lib/utils';

export function FloodProbability() {
  const { floodPrediction } = useAppStore();
  
  if (!floodPrediction) {
    return (
      <div className="stat-card animate-pulse">
        <div className="h-6 w-48 bg-muted rounded mb-4" />
        <div className="h-32 bg-muted rounded" />
      </div>
    );
  }
  
  const { riskLevel, probability, factors, recommendations } = floodPrediction;
  
  const progressColors = {
    low: 'bg-risk-low',
    moderate: 'bg-risk-moderate',
    high: 'bg-risk-high',
    severe: 'bg-risk-severe',
  };
  
  const factorItems = [
    { label: 'Rainfall Impact', value: factors.rainfall, icon: Droplets, color: 'text-neer-sky' },
    { label: 'Humidity Level', value: factors.humidity, icon: TrendingUp, color: 'text-neer-teal' },
    { label: 'Pressure Factor', value: factors.pressure, icon: Gauge, color: 'text-muted-foreground' },
    { label: 'Historical Risk', value: factors.historicalRisk, icon: History, color: 'text-risk-moderate' },
  ];
  
  return (
    <div className="stat-card animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Flood Probability Analysis</h3>
        <RiskBadge level={riskLevel} />
      </div>
      
      <div className="mb-8">
        <div className="flex items-end justify-between mb-2">
          <span className="text-sm text-muted-foreground">Current Risk Level</span>
          <span className="text-3xl font-bold">{probability}%</span>
        </div>
        <div className="h-4 rounded-full bg-secondary overflow-hidden">
          <div
            className={cn('h-full rounded-full transition-all duration-1000', progressColors[riskLevel])}
            style={{ width: `${probability}%` }}
          />
        </div>
      </div>
      
      <div className="space-y-4 mb-6">
        <h4 className="text-sm font-medium text-muted-foreground">Contributing Factors</h4>
        {factorItems.map((factor) => (
          <div key={factor.label} className="flex items-center gap-3">
            <factor.icon className={cn('w-4 h-4', factor.color)} />
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span>{factor.label}</span>
                <span className="font-medium">{Math.round(factor.value)}%</span>
              </div>
              <Progress value={factor.value} className="h-1.5" />
            </div>
          </div>
        ))}
      </div>
      
      <div className="border-t border-border pt-4">
        <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-risk-moderate" />
          Recommendations
        </h4>
        <ul className="space-y-2">
          {recommendations.slice(0, 3).map((rec, index) => (
            <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neer-sky mt-2 flex-shrink-0" />
              {rec}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
