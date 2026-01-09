import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Circle, Popup, useMap } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Plus, Minus, RotateCcw, Loader2, Layers, Eye, EyeOff, BarChart3, Bell, BellPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { calculateFloodRisk, RISK_LEVELS } from '@/lib/floodRisk';
import { MeteostatDataPoint } from '@/lib/meteostat';
import { HeatmapLayer } from './HeatmapLayer';

// Fix leaflet default marker icon issue with Vite
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface WorldMapControlsProps {
  onRefresh: () => void;
  isLoading: boolean;
  showHeatmap: boolean;
  onToggleHeatmap: () => void;
  showCircles: boolean;
  onToggleCircles: () => void;
}

function WorldMapControls({ 
  onRefresh, 
  isLoading, 
  showHeatmap, 
  onToggleHeatmap,
  showCircles,
  onToggleCircles,
}: WorldMapControlsProps) {
  const map = useMap();

  const handleZoomIn = () => map.zoomIn();
  const handleZoomOut = () => map.zoomOut();
  const handleReset = () => map.setView([20, 0], 2);

  return (
    <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
      <Button
        size="icon"
        variant="secondary"
        onClick={handleZoomIn}
        className="bg-card/90 backdrop-blur-sm shadow-lg hover:bg-card"
        title="Zoom In"
      >
        <Plus className="w-4 h-4" />
      </Button>
      <Button
        size="icon"
        variant="secondary"
        onClick={handleZoomOut}
        className="bg-card/90 backdrop-blur-sm shadow-lg hover:bg-card"
        title="Zoom Out"
      >
        <Minus className="w-4 h-4" />
      </Button>
      <Button
        size="icon"
        variant="secondary"
        onClick={handleReset}
        className="bg-card/90 backdrop-blur-sm shadow-lg hover:bg-card"
        title="Reset View"
      >
        <RotateCcw className="w-4 h-4" />
      </Button>
      
      <div className="w-full h-px bg-border my-1" />
      
      <Button
        size="icon"
        variant={showHeatmap ? "default" : "secondary"}
        onClick={onToggleHeatmap}
        className={`shadow-lg ${showHeatmap ? '' : 'bg-card/90 backdrop-blur-sm hover:bg-card'}`}
        title="Toggle Heatmap"
      >
        <Layers className="w-4 h-4" />
      </Button>
      <Button
        size="icon"
        variant={showCircles ? "default" : "secondary"}
        onClick={onToggleCircles}
        className={`shadow-lg ${showCircles ? '' : 'bg-card/90 backdrop-blur-sm hover:bg-card'}`}
        title="Toggle Risk Circles"
      >
        {showCircles ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
      </Button>
      
      <div className="w-full h-px bg-border my-1" />
      
      <Button
        size="icon"
        variant="secondary"
        onClick={onRefresh}
        disabled={isLoading}
        className="bg-card/90 backdrop-blur-sm shadow-lg hover:bg-card"
        title="Refresh Data"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <RotateCcw className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
}

function MapLegend({ showHeatmap }: { showHeatmap: boolean }) {
  return (
    <div className="absolute bottom-6 left-4 z-[1000] bg-card/95 backdrop-blur-md rounded-xl p-4 shadow-xl border border-border">
      <h4 className="text-sm font-semibold text-foreground mb-3">
        {showHeatmap ? 'Flood Risk Heatmap' : 'Flood Risk Legend'}
      </h4>
      <div className="space-y-2">
        {RISK_LEVELS.map((risk) => (
          <div key={risk.level} className="flex items-center gap-3">
            <div
              className="w-4 h-4 rounded-full border-2"
              style={{ backgroundColor: risk.fillColor, borderColor: risk.color }}
            />
            <div className="flex flex-col">
              <span className="text-xs font-medium text-foreground">{risk.label}</span>
              <span className="text-[10px] text-muted-foreground">{risk.description}</span>
            </div>
          </div>
        ))}
      </div>
      {showHeatmap && (
        <div className="mt-3 pt-3 border-t border-border">
          <div className="h-2 rounded-full bg-gradient-to-r from-green-500 via-yellow-500 via-orange-500 to-red-600" />
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-muted-foreground">Low</span>
            <span className="text-[10px] text-muted-foreground">Extreme</span>
          </div>
        </div>
      )}
    </div>
  );
}

interface WorldMapContentProps {
  data: MeteostatDataPoint[];
  isLoading: boolean;
  onRefresh: () => void;
  onLocationClick: (point: MeteostatDataPoint) => void;
  onWatchLocation: (point: MeteostatDataPoint) => void;
  isLocationSaved: (lat: number, lon: number) => boolean;
}

export default function WorldMapContent({ 
  data, 
  isLoading, 
  onRefresh,
  onLocationClick,
  onWatchLocation,
  isLocationSaved,
}: WorldMapContentProps) {
  const [mapZoom, setMapZoom] = useState(2);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showCircles, setShowCircles] = useState(true);
  const defaultCenter: LatLngExpression = [20, 0];

  // Calculate circle radius based on precipitation and zoom
  const getRadius = (precipitation: number): number => {
    const baseRadius = 200000; // 200km base
    const precipFactor = Math.min(2, 1 + precipitation / 100);
    const zoomFactor = Math.pow(2, 3 - mapZoom);
    return baseRadius * precipFactor * Math.max(0.5, zoomFactor);
  };

  return (
    <MapContainer
      center={defaultCenter}
      zoom={2}
      minZoom={2}
      maxZoom={12}
      className="w-full h-full rounded-xl"
      worldCopyJump={true}
      maxBoundsViscosity={1.0}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Heatmap Layer */}
      <HeatmapLayer data={data} visible={showHeatmap} />
      
      {/* Render flood risk circles */}
      {showCircles && data.map((point, index) => {
        const risk = calculateFloodRisk(point.precipitation);
        const isSaved = isLocationSaved(point.lat, point.lon);
        
        return (
          <Circle
            key={`${point.lat}-${point.lon}-${index}`}
            center={[point.lat, point.lon]}
            radius={getRadius(point.precipitation)}
            pathOptions={{
              color: risk.color,
              fillColor: risk.fillColor,
              fillOpacity: Math.min(0.7, 0.3 + point.precipitation / 150),
              weight: isSaved ? 4 : 2,
            }}
          >
            <Popup className="flood-risk-popup">
              <div className="p-2 min-w-[220px]">
                <h3 className="font-bold text-base mb-2">{point.location}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Coordinates:</span>
                    <span className="font-mono text-xs">
                      {point.lat.toFixed(4)}°, {point.lon.toFixed(4)}°
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Rainfall:</span>
                    <span className="font-semibold">{point.precipitation.toFixed(1)} mm</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Risk Level:</span>
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-semibold text-white"
                      style={{ backgroundColor: risk.color }}
                    >
                      {risk.label}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-border">
                    <p className="text-xs text-muted-foreground">{risk.description}</p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Updated: {point.date}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2 border-t border-border">
                    <button
                      onClick={() => onLocationClick(point)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-xs font-medium transition-colors"
                    >
                      <BarChart3 className="w-3 h-3" />
                      View Trends
                    </button>
                    <button
                      onClick={() => onWatchLocation(point)}
                      className={`flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        isSaved 
                          ? 'bg-green-500/10 text-green-600 hover:bg-green-500/20' 
                          : 'bg-secondary hover:bg-secondary/80 text-foreground'
                      }`}
                    >
                      {isSaved ? (
                        <>
                          <Bell className="w-3 h-3" />
                          Watching
                        </>
                      ) : (
                        <>
                          <BellPlus className="w-3 h-3" />
                          Watch
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </Popup>
          </Circle>
        );
      })}
      
      <WorldMapControls 
        onRefresh={onRefresh} 
        isLoading={isLoading}
        showHeatmap={showHeatmap}
        onToggleHeatmap={() => setShowHeatmap(!showHeatmap)}
        showCircles={showCircles}
        onToggleCircles={() => setShowCircles(!showCircles)}
      />
      <MapLegend showHeatmap={showHeatmap} />
      
      {/* Zoom change handler */}
      <ZoomHandler onZoomChange={setMapZoom} />
    </MapContainer>
  );
}

function ZoomHandler({ onZoomChange }: { onZoomChange: (zoom: number) => void }) {
  const map = useMap();
  
  useEffect(() => {
    const handleZoom = () => {
      onZoomChange(map.getZoom());
    };
    
    map.on('zoomend', handleZoom);
    return () => {
      map.off('zoomend', handleZoom);
    };
  }, [map, onZoomChange]);
  
  return null;
}
