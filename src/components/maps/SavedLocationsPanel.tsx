import { Bell, BellOff, MapPin, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { SavedLocation } from '@/hooks/useFloodAlerts';
import { calculateFloodRisk } from '@/lib/floodRisk';
import { MeteostatDataPoint } from '@/lib/meteostat';

interface SavedLocationsPanelProps {
  savedLocations: SavedLocation[];
  data: MeteostatDataPoint[];
  onRemove: (id: string) => void;
  onToggleNotifications: (id: string) => void;
  onClose: () => void;
  notificationPermission: NotificationPermission;
  onRequestPermission: () => void;
}

export function SavedLocationsPanel({
  savedLocations,
  data,
  onRemove,
  onToggleNotifications,
  onClose,
  notificationPermission,
  onRequestPermission,
}: SavedLocationsPanelProps) {
  // Get current risk for a saved location
  const getRiskForLocation = (loc: SavedLocation) => {
    const matchingPoint = data.find(point => {
      const latDiff = Math.abs(point.lat - loc.lat);
      const lonDiff = Math.abs(point.lon - loc.lon);
      return latDiff < 0.5 && lonDiff < 0.5;
    });
    
    if (matchingPoint) {
      return {
        risk: calculateFloodRisk(matchingPoint.precipitation),
        precipitation: matchingPoint.precipitation,
      };
    }
    return null;
  };

  return (
    <div className="fixed top-20 right-4 z-[1500] w-80 max-h-[calc(100vh-8rem)] animate-fade-in">
      <Card className="bg-card/95 backdrop-blur-md border-border shadow-xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-secondary/30">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-foreground">Saved Locations</h3>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Notification Permission Banner */}
        {notificationPermission !== 'granted' && (
          <div className="p-3 bg-primary/10 border-b border-border">
            <div className="flex items-start gap-3">
              <Bell className="w-4 h-4 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-foreground font-medium">Enable Notifications</p>
                <p className="text-xs text-muted-foreground">Get alerts for extreme flood risks</p>
              </div>
              <Button size="sm" variant="default" className="text-xs h-7" onClick={onRequestPermission}>
                Enable
              </Button>
            </div>
          </div>
        )}

        {/* Locations List */}
        <div className="max-h-96 overflow-y-auto">
          {savedLocations.length === 0 ? (
            <div className="p-6 text-center">
              <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No saved locations</p>
              <p className="text-xs text-muted-foreground mt-1">
                Click "Watch Location" on any risk zone to add it
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {savedLocations.map(loc => {
                const riskData = getRiskForLocation(loc);
                return (
                  <div key={loc.id} className="p-3 hover:bg-secondary/30 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground truncate">{loc.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {loc.lat.toFixed(2)}°, {loc.lon.toFixed(2)}°
                        </p>
                        {riskData && (
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium text-white"
                              style={{ backgroundColor: riskData.risk.color }}
                            >
                              {riskData.risk.label}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {riskData.precipitation.toFixed(1)}mm
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="flex items-center gap-2 mr-2">
                          {loc.notificationsEnabled ? (
                            <Bell className="w-3 h-3 text-primary" />
                          ) : (
                            <BellOff className="w-3 h-3 text-muted-foreground" />
                          )}
                          <Switch
                            checked={loc.notificationsEnabled}
                            onCheckedChange={() => onToggleNotifications(loc.id)}
                            className="scale-75"
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          onClick={() => onRemove(loc.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {savedLocations.length > 0 && (
          <div className="p-3 border-t border-border bg-secondary/20">
            <p className="text-xs text-muted-foreground text-center">
              {savedLocations.filter(l => l.notificationsEnabled).length} of {savedLocations.length} locations with alerts enabled
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
