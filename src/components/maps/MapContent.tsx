import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Circle, Marker, Popup, useMap } from 'react-leaflet';
import { Locate, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/useAppStore';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in Leaflet with Vite
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Sample flood risk zones in India
const floodZones = [
  { lat: 26.8467, lon: 80.9462, risk: 'high', name: 'Lucknow, UP', radius: 25000 },
  { lat: 25.5941, lon: 85.1376, risk: 'severe', name: 'Patna, Bihar', radius: 30000 },
  { lat: 22.5726, lon: 88.3639, risk: 'high', name: 'Kolkata, WB', radius: 20000 },
  { lat: 26.1445, lon: 91.7362, risk: 'moderate', name: 'Guwahati, Assam', radius: 15000 },
  { lat: 19.0760, lon: 72.8777, risk: 'moderate', name: 'Mumbai, MH', radius: 18000 },
  { lat: 13.0827, lon: 80.2707, risk: 'low', name: 'Chennai, TN', radius: 12000 },
  { lat: 17.3850, lon: 78.4867, risk: 'low', name: 'Hyderabad, TS', radius: 10000 },
];

const riskColors: Record<string, string> = {
  low: '#22c55e',
  moderate: '#eab308',
  high: '#f97316',
  severe: '#ef4444',
};

function MapControls() {
  const map = useMap();
  const { setUserLocation } = useAppStore();
  
  const handleLocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setUserLocation({ lat: latitude, lon: longitude });
          map.flyTo([latitude, longitude], 10);
        },
        (error) => {
          console.error('Geolocation error:', error);
        }
      );
    }
  };
  
  return (
    <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
      <Button
        variant="outline"
        size="icon"
        className="bg-white shadow-lg"
        onClick={() => map.zoomIn()}
      >
        <ZoomIn className="w-4 h-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="bg-white shadow-lg"
        onClick={() => map.zoomOut()}
      >
        <ZoomOut className="w-4 h-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="bg-white shadow-lg"
        onClick={handleLocate}
      >
        <Locate className="w-4 h-4" />
      </Button>
    </div>
  );
}

interface MapContentProps {
  height?: string;
}

export default function MapContent({ height = '500px' }: MapContentProps) {
  const { userLocation } = useAppStore();
  
  const center: [number, number] = userLocation 
    ? [userLocation.lat, userLocation.lon] 
    : [22.5937, 78.9629]; // Center of India
  
  return (
    <>
      <MapContainer
        center={center}
        zoom={5}
        style={{ height, width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Flood risk zones */}
        {floodZones.map((zone, index) => (
          <Circle
            key={index}
            center={[zone.lat, zone.lon]}
            radius={zone.radius}
            pathOptions={{
              color: riskColors[zone.risk],
              fillColor: riskColors[zone.risk],
              fillOpacity: 0.3,
              weight: 2,
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold">{zone.name}</h3>
                <p className="text-sm capitalize">Risk Level: {zone.risk}</p>
              </div>
            </Popup>
          </Circle>
        ))}
        
        {/* User location marker */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lon]}>
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold">Your Location</h3>
                <p className="text-sm">
                  {userLocation.lat.toFixed(4)}, {userLocation.lon.toFixed(4)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}
        
        <MapControls />
      </MapContainer>
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-gray-200">
        <p className="text-xs font-medium mb-2 text-gray-900">Flood Risk Levels</p>
        <div className="flex flex-col gap-1.5">
          {Object.entries(riskColors).map(([level, color]) => (
            <div key={level} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: color }}
              />
              <span className="text-xs capitalize text-gray-700">{level}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
