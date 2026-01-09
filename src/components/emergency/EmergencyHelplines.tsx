import { Phone, MapPin, Navigation, AlertTriangle, Shield, Flame, Ambulance, Building2, Waves } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HelpCenter {
  id: string;
  name: string;
  type: 'authority' | 'operations' | 'control' | 'relief' | 'rescue';
  location: string;
  phone: string;
  distance?: string;
}

interface EmergencyNumber {
  name: string;
  number: string;
  icon: React.ReactNode;
}

const helpCenters: HelpCenter[] = [
  {
    id: '1',
    name: 'State Disaster Management Authority',
    type: 'authority',
    location: 'Mumbai, Maharashtra',
    phone: '022-22027990',
    distance: '459 km away',
  },
  {
    id: '2',
    name: 'State Emergency Operations Center',
    type: 'operations',
    location: 'Patna, Bihar',
    phone: '0612-2217305',
    distance: '1294 km away',
  },
  {
    id: '3',
    name: 'District Emergency Control Room',
    type: 'control',
    location: 'Kochi, Kerala',
    phone: '0484-2361101',
    distance: '1525 km away',
  },
  {
    id: '4',
    name: 'Flood Relief Camp - Kolkata',
    type: 'relief',
    location: 'Salt Lake, Kolkata',
    phone: '033-23594117',
    distance: '1613 km away',
  },
  {
    id: '5',
    name: 'NDRF Battalion 1',
    type: 'rescue',
    location: 'Guwahati, Assam',
    phone: '0361-2340281',
    distance: '1957 km away',
  },
];

const emergencyNumbers: EmergencyNumber[] = [
  { name: 'National Disaster Response Force (NDRF)', number: '011-24363260', icon: <Shield className="w-4 h-4" /> },
  { name: 'National Emergency Number', number: '112', icon: <AlertTriangle className="w-4 h-4" /> },
  { name: 'Flood Control Room', number: '1070', icon: <Waves className="w-4 h-4" /> },
  { name: 'Police Emergency', number: '100', icon: <Shield className="w-4 h-4" /> },
  { name: 'Ambulance', number: '108', icon: <Ambulance className="w-4 h-4" /> },
  { name: 'Fire Brigade', number: '101', icon: <Flame className="w-4 h-4" /> },
  { name: 'Disaster Management', number: '1078', icon: <Building2 className="w-4 h-4" /> },
];

const quickTips = [
  'Call 112 for any emergency',
  '1070 is dedicated flood helpline',
  'Keep phone charged and dry',
  'Share your location when calling',
  'Stay on line until help arrives',
];

const typeIcons: Record<HelpCenter['type'], React.ReactNode> = {
  authority: <Building2 className="w-5 h-5 text-primary" />,
  operations: <Waves className="w-5 h-5 text-neer-sky" />,
  control: <Shield className="w-5 h-5 text-risk-moderate" />,
  relief: <Ambulance className="w-5 h-5 text-risk-low" />,
  rescue: <AlertTriangle className="w-5 h-5 text-risk-severe" />,
};

export function EmergencyHelplines() {
  return (
    <div className="space-y-6">
      {/* Help Centers Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {helpCenters.map((center) => (
          <div
            key={center.id}
            className="stat-card p-4 hover:border-primary/30 transition-all"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="p-2 rounded-lg bg-secondary">
                {typeIcons[center.type]}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm">{center.name}</h3>
                <p className="text-xs text-muted-foreground capitalize">{center.type.replace('-', ' ')}</p>
              </div>
            </div>
            
            <div className="space-y-1 mb-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-3.5 h-3.5" />
                <span>{center.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-3.5 h-3.5" />
                <span>{center.phone}</span>
              </div>
              {center.distance && (
                <div className="flex items-center gap-2 text-sm text-neer-sky">
                  <Navigation className="w-3.5 h-3.5" />
                  <span>{center.distance}</span>
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                asChild
              >
                <a href={`tel:${center.phone}`}>
                  <Phone className="w-3.5 h-3.5 mr-1" />
                  Call
                </a>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                asChild
              >
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(center.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Navigation className="w-3.5 h-3.5 mr-1" />
                  Directions
                </a>
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar Content */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Emergency Numbers */}
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-4">
            <Phone className="w-5 h-5 text-risk-severe" />
            <h3 className="font-semibold">Emergency Numbers</h3>
          </div>
          <div className="space-y-3">
            {emergencyNumbers.map((item) => (
              <a
                key={item.number}
                href={`tel:${item.number}`}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-full bg-secondary text-muted-foreground group-hover:text-primary transition-colors">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.number}</p>
                  </div>
                </div>
                <Phone className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Tips */}
        <div className="stat-card">
          <h3 className="font-semibold mb-4">Quick Tips</h3>
          <ul className="space-y-2">
            {quickTips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="text-primary">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
