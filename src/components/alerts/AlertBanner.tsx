import { AlertTriangle, X } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function AlertBanner() {
  const { alerts, markAlertRead, floodPrediction } = useAppStore();
  
  // Show alert if there's high/severe risk or unread alerts
  const activeAlert = alerts.find((a) => !a.isRead && a.type === 'danger');
  const showRiskAlert = floodPrediction && ['high', 'severe'].includes(floodPrediction.riskLevel);
  
  if (!activeAlert && !showRiskAlert) return null;
  
  const isServerAlert = !!activeAlert;
  const alertType = activeAlert?.type || (floodPrediction?.riskLevel === 'severe' ? 'danger' : 'warning');
  
  return (
    <div
      className={cn(
        'fixed top-16 left-0 right-0 z-40 px-4 py-3 alert-pulse animate-fade-in',
        alertType === 'danger' ? 'bg-risk-severe' : 'bg-risk-moderate'
      )}
    >
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-white" />
          <div>
            <p className="font-semibold text-white">
              {isServerAlert 
                ? activeAlert.title 
                : `${floodPrediction?.riskLevel === 'severe' ? 'Severe' : 'High'} Flood Risk Alert`
              }
            </p>
            <p className="text-sm text-white/90">
              {isServerAlert 
                ? activeAlert.message 
                : 'Current conditions indicate elevated flood risk in your area. Stay alert and prepared.'
              }
            </p>
          </div>
        </div>
        {isServerAlert && (
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={() => markAlertRead(activeAlert.id)}
          >
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>
    </div>
  );
}
