import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  className?: string;
}

const variantStyles = {
  default: 'bg-card',
  primary: 'bg-neer-sky/10 border-neer-sky/20',
  success: 'bg-risk-low/10 border-risk-low/20',
  warning: 'bg-risk-moderate/10 border-risk-moderate/20',
  danger: 'bg-risk-severe/10 border-risk-severe/20',
};

const iconVariantStyles = {
  default: 'bg-secondary text-foreground',
  primary: 'bg-neer-sky/20 text-neer-sky',
  success: 'bg-risk-low/20 text-risk-low',
  warning: 'bg-risk-moderate/20 text-risk-moderate',
  danger: 'bg-risk-severe/20 text-risk-severe',
};

export function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  variant = 'default',
  className 
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('stat-card', variantStyles[variant], className)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
          {trend && (
            <p className={cn(
              'text-xs font-medium mt-2',
              trend.isPositive ? 'text-risk-low' : 'text-risk-severe'
            )}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% from last week
            </p>
          )}
        </div>
        {Icon && (
          <div className={cn('p-3 rounded-xl', iconVariantStyles[variant])}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </motion.div>
  );
}
