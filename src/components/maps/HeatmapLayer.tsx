import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';
import { MeteostatDataPoint } from '@/lib/meteostat';

// Extend Leaflet types for heat layer
declare module 'leaflet' {
  function heatLayer(
    latlngs: Array<[number, number, number]>,
    options?: {
      radius?: number;
      blur?: number;
      maxZoom?: number;
      max?: number;
      minOpacity?: number;
      gradient?: { [key: number]: string };
    }
  ): L.Layer;
}

interface HeatmapLayerProps {
  data: MeteostatDataPoint[];
  visible: boolean;
}

export function HeatmapLayer({ data, visible }: HeatmapLayerProps) {
  const map = useMap();

  useEffect(() => {
    if (!visible || data.length === 0) return;

    // Transform data to heatmap format [lat, lon, intensity]
    const heatData: [number, number, number][] = data.map(point => {
      // Normalize precipitation to 0-1 range for intensity
      const intensity = Math.min(1, point.precipitation / 100);
      return [point.lat, point.lon, intensity];
    });

    // Create heatmap layer with custom gradient
    const heatLayer = L.heatLayer(heatData, {
      radius: 35,
      blur: 25,
      maxZoom: 8,
      max: 1,
      minOpacity: 0.3,
      gradient: {
        0.0: '#22c55e',  // Low risk - green
        0.2: '#84cc16',  // Low-moderate
        0.4: '#eab308',  // Moderate - yellow
        0.6: '#f97316',  // High - orange
        0.8: '#ef4444',  // Very high - red
        1.0: '#dc2626',  // Extreme - dark red
      },
    });

    heatLayer.addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, data, visible]);

  return null;
}
