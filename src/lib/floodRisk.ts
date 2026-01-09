// Flood risk calculation utilities

export type FloodRiskLevel = 'low' | 'moderate' | 'high' | 'extreme';

export interface FloodRiskData {
  level: FloodRiskLevel;
  color: string;
  fillColor: string;
  label: string;
  description: string;
}

export function calculateFloodRisk(precipitation: number): FloodRiskData {
  if (precipitation < 20) {
    return {
      level: 'low',
      color: '#22c55e',
      fillColor: 'rgba(34, 197, 94, 0.6)',
      label: 'Low Risk',
      description: 'Normal conditions, no flood threat expected',
    };
  } else if (precipitation < 50) {
    return {
      level: 'moderate',
      color: '#eab308',
      fillColor: 'rgba(234, 179, 8, 0.6)',
      label: 'Moderate Risk',
      description: 'Increased precipitation, monitor local conditions',
    };
  } else if (precipitation < 80) {
    return {
      level: 'high',
      color: '#f97316',
      fillColor: 'rgba(249, 115, 22, 0.6)',
      label: 'High Risk',
      description: 'Significant rainfall, flash flooding possible',
    };
  } else {
    return {
      level: 'extreme',
      color: '#ef4444',
      fillColor: 'rgba(239, 68, 68, 0.7)',
      label: 'Extreme Risk',
      description: 'Severe flooding likely, seek higher ground',
    };
  }
}

export function getCircleRadius(precipitation: number, zoom: number): number {
  // Base radius that scales with precipitation amount
  const baseRadius = Math.min(50000, Math.max(20000, precipitation * 500));
  // Adjust for zoom level
  return baseRadius / Math.pow(2, zoom - 2);
}

export function getCircleOpacity(precipitation: number): number {
  // Higher precipitation = higher opacity
  return Math.min(0.8, Math.max(0.3, precipitation / 100));
}

export const RISK_LEVELS: FloodRiskData[] = [
  {
    level: 'low',
    color: '#22c55e',
    fillColor: 'rgba(34, 197, 94, 0.6)',
    label: 'Low Risk',
    description: '< 20mm precipitation',
  },
  {
    level: 'moderate',
    color: '#eab308',
    fillColor: 'rgba(234, 179, 8, 0.6)',
    label: 'Moderate Risk',
    description: '20-50mm precipitation',
  },
  {
    level: 'high',
    color: '#f97316',
    fillColor: 'rgba(249, 115, 22, 0.6)',
    label: 'High Risk',
    description: '50-80mm precipitation',
  },
  {
    level: 'extreme',
    color: '#ef4444',
    fillColor: 'rgba(239, 68, 68, 0.7)',
    label: 'Extreme Risk',
    description: '> 80mm precipitation',
  },
];
