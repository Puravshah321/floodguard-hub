import { Suspense, lazy, useEffect, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';

const MapContent = lazy(() => import('./MapContent'));

interface FloodMapProps {
  className?: string;
  height?: string;
}

export function FloodMap({ className, height = '500px' }: FloodMapProps) {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!isMounted) {
    return (
      <div className={`bg-muted animate-pulse flex items-center justify-center rounded-xl ${className}`} style={{ height }}>
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    );
  }
  
  return (
    <div className={`map-container relative ${className}`} style={{ height }}>
      <Suspense fallback={<div className="bg-muted animate-pulse flex items-center justify-center" style={{ height }}><p className="text-muted-foreground">Loading map...</p></div>}>
        <MapContent height={height} />
      </Suspense>
    </div>
  );
}
