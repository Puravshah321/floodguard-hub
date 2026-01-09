import { Suspense, lazy, useEffect, useState, Component, ReactNode } from 'react';
import { Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MeteostatDataPoint, fetchGlobalPrecipitationData } from '@/lib/meteostat';
import { useFloodAlerts } from '@/hooks/useFloodAlerts';
import { PrecipitationChart } from './PrecipitationChart';
import { SavedLocationsPanel } from './SavedLocationsPanel';

// Error boundary to handle dynamic import failures
class MapErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode; onRetry: () => void },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback: ReactNode; onRetry: () => void }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('Map component error:', error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

const WorldMapContent = lazy(() =>
  import('./WorldMapContent').catch(() => {
    return { default: () => null };
  })
);

interface GlobalFloodMapProps {
  className?: string;
}

export function GlobalFloodMap({ className }: GlobalFloodMapProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [data, setData] = useState<MeteostatDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<MeteostatDataPoint | null>(null);
  const [showSavedLocations, setShowSavedLocations] = useState(false);

  const {
    savedLocations,
    notificationPermission,
    requestNotificationPermission,
    addSavedLocation,
    removeSavedLocation,
    toggleLocationNotifications,
    checkExtremeRisks,
    isLocationSaved,
  } = useFloodAlerts();

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const precipitationData = await fetchGlobalPrecipitationData();
      setData(precipitationData);
      setLastUpdated(new Date());
      
      // Check for extreme risks after fetching new data
      checkExtremeRisks(precipitationData);
    } catch (err) {
      setError('Failed to fetch precipitation data. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    fetchData();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Check for extreme risks whenever data changes
  useEffect(() => {
    if (data.length > 0) {
      checkExtremeRisks(data);
    }
  }, [data, checkExtremeRisks]);

  const handleLocationClick = (point: MeteostatDataPoint) => {
    setSelectedLocation(point);
  };

  const handleWatchLocation = (point: MeteostatDataPoint) => {
    if (isLocationSaved(point.lat, point.lon)) {
      // Already saved, could show a toast
      return;
    }
    
    addSavedLocation({
      name: point.location,
      lat: point.lat,
      lon: point.lon,
      notificationsEnabled: notificationPermission === 'granted',
    });
  };

  const loadingFallback = (
    <div className="w-full h-full bg-muted/50 flex flex-col items-center justify-center rounded-xl">
      <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
      <p className="text-muted-foreground">Loading global flood risk map...</p>
    </div>
  );

  const errorFallback = (
    <div className="w-full h-full bg-muted/50 flex flex-col items-center justify-center rounded-xl gap-4">
      <AlertTriangle className="w-12 h-12 text-destructive" />
      <p className="text-muted-foreground text-center max-w-md">
        {error || 'Failed to load the map. Please try again.'}
      </p>
      <Button onClick={fetchData} variant="outline" className="gap-2">
        <RefreshCw className="w-4 h-4" />
        Retry
      </Button>
    </div>
  );

  if (!isMounted) {
    return loadingFallback;
  }

  if (error && data.length === 0) {
    return errorFallback;
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Loading overlay */}
      {isLoading && data.length === 0 && (
        <div className="absolute inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-xl">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Fetching precipitation data...</p>
          </div>
        </div>
      )}
      
      {/* Last updated indicator */}
      {lastUpdated && (
        <div className="absolute top-4 left-4 z-[1000] bg-card/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`} />
            <span>
              {isLoading ? 'Updating...' : `Updated: ${lastUpdated.toLocaleTimeString()}`}
            </span>
          </div>
        </div>
      )}

      {/* Saved Locations Button */}
      <button
        onClick={() => setShowSavedLocations(!showSavedLocations)}
        className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-card/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg border border-border flex items-center gap-2 hover:bg-card transition-colors"
      >
        <span className="text-sm font-medium text-foreground">
          Saved Locations
        </span>
        {savedLocations.length > 0 && (
          <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
            {savedLocations.length}
          </span>
        )}
      </button>
      
      <MapErrorBoundary fallback={errorFallback} onRetry={fetchData}>
        <Suspense fallback={loadingFallback}>
          <WorldMapContent 
            data={data} 
            isLoading={isLoading} 
            onRefresh={fetchData}
            onLocationClick={handleLocationClick}
            onWatchLocation={handleWatchLocation}
            isLocationSaved={isLocationSaved}
          />
        </Suspense>
      </MapErrorBoundary>

      {/* Precipitation Chart Modal */}
      {selectedLocation && (
        <PrecipitationChart
          location={selectedLocation.location}
          lat={selectedLocation.lat}
          lon={selectedLocation.lon}
          currentPrecipitation={selectedLocation.precipitation}
          onClose={() => setSelectedLocation(null)}
        />
      )}

      {/* Saved Locations Panel */}
      {showSavedLocations && (
        <SavedLocationsPanel
          savedLocations={savedLocations}
          data={data}
          onRemove={removeSavedLocation}
          onToggleNotifications={toggleLocationNotifications}
          onClose={() => setShowSavedLocations(false)}
          notificationPermission={notificationPermission}
          onRequestPermission={requestNotificationPermission}
        />
      )}
    </div>
  );
}
