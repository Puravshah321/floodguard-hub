import { Suspense, lazy, useEffect, useState, Component, ReactNode } from 'react';

// Error boundary to handle dynamic import failures
class MapErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    // If it's a dynamic import error, try to reload once
    if (error.message.includes('dynamically imported module') || 
        error.message.includes('Failed to fetch')) {
      console.warn('Map module failed to load, attempting reload...');
      // Force a hard reload to clear cache
      window.location.reload();
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

const MapContent = lazy(() => 
  import('./MapContent').catch(() => {
    // If import fails, reload the page to get fresh assets
    window.location.reload();
    return { default: () => null };
  })
);

interface FloodMapProps {
  className?: string;
  height?: string;
}

export function FloodMap({ className, height = '500px' }: FloodMapProps) {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const loadingFallback = (
    <div 
      className={`bg-muted animate-pulse flex items-center justify-center rounded-xl ${className}`} 
      style={{ height }}
    >
      <p className="text-muted-foreground">Loading map...</p>
    </div>
  );
  
  if (!isMounted) {
    return loadingFallback;
  }
  
  return (
    <div className={`map-container relative ${className}`} style={{ height }}>
      <MapErrorBoundary fallback={loadingFallback}>
        <Suspense fallback={loadingFallback}>
          <MapContent height={height} />
        </Suspense>
      </MapErrorBoundary>
    </div>
  );
}
