import { Phone, Hospital, Shield, Flame, AlertTriangle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const emergencyContacts = [
  { name: 'National Disaster Response Force', number: '011-24363260', icon: Shield, description: 'NDRF Emergency Helpline' },
  { name: 'Police Emergency', number: '100', icon: Shield, description: 'Police Control Room' },
  { name: 'Fire Emergency', number: '101', icon: Flame, description: 'Fire Department' },
  { name: 'Medical Emergency', number: '102', icon: Hospital, description: 'Ambulance Service' },
  { name: 'National Emergency', number: '112', icon: AlertTriangle, description: 'Unified Emergency Number' },
];

const safetyTips = [
  'Move to higher ground immediately if flooding begins',
  'Avoid walking or driving through flood waters',
  'Turn off electricity at the main switch if flooding is imminent',
  'Keep emergency supplies ready (water, food, medicines)',
  'Stay informed through official channels and alerts',
];

export function EmergencySOS() {
  return (
    <div className="stat-card border-risk-severe/20 bg-gradient-to-br from-card to-risk-severe/5 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-risk-severe/20">
          <Phone className="w-5 h-5 text-risk-severe" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Emergency SOS</h3>
          <p className="text-sm text-muted-foreground">India Emergency Contacts</p>
        </div>
      </div>
      
      <div className="space-y-2 mb-6">
        {emergencyContacts.map((contact) => (
          <a
            key={contact.number}
            href={`tel:${contact.number}`}
            className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors group"
          >
            <contact.icon className="w-5 h-5 text-muted-foreground group-hover:text-neer-sky transition-colors" />
            <div className="flex-1">
              <p className="font-medium text-sm">{contact.name}</p>
              <p className="text-xs text-muted-foreground">{contact.description}</p>
            </div>
            <span className="font-bold text-neer-sky">{contact.number}</span>
          </a>
        ))}
      </div>
      
      <div className="border-t border-border pt-4">
        <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-risk-moderate" />
          Safety Guidelines
        </h4>
        <ul className="space-y-2">
          {safetyTips.map((tip, index) => (
            <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-risk-moderate mt-2 flex-shrink-0" />
              {tip}
            </li>
          ))}
        </ul>
      </div>
      
      <Button variant="outline" className="w-full mt-4" asChild>
        <a href="https://ndma.gov.in" target="_blank" rel="noopener noreferrer">
          <ExternalLink className="w-4 h-4" />
          NDMA Official Website
        </a>
      </Button>
    </div>
  );
}
