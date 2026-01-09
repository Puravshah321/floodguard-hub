import { cn } from '@/lib/utils';
import type { RiskLevel } from '@/types';
import { AlertTriangle, CheckCircle, AlertOctagon, Flame } from 'lucide-react';

interface RiskBadgeProps {
  level: RiskLevel;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const riskConfig = {
  low: {
    label: 'Low Risk',
    icon: CheckCircle,
    className: 'risk-low',
  },
  moderate: {
    label: 'Moderate Risk',
    icon: AlertTriangle,
    className: 'risk-moderate',
  },
  high: {
    label: 'High Risk',
    icon: AlertOctagon,
    className: 'risk-high',
  },
  severe: {
    label: 'Severe Risk',
    icon: Flame,
    className: 'risk-severe',
  },
};

const sizeClasses = {
  sm: 'text-xs px-2 py-1',
  md: 'text-sm px-3 py-1.5',
  lg: 'text-base px-4 py-2',
};

export function RiskBadge({ level, showIcon = true, size = 'md', className }: RiskBadgeProps) {
  const config = riskConfig[level];
  const Icon = config.icon;
  
  return (
    <span className={cn('risk-badge', config.className, sizeClasses[size], className)}>
      {showIcon && <Icon className={cn(size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4')} />}
      {config.label}
    </span>
  );
}
