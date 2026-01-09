import { useState } from 'react';
import { Phone, AlertTriangle, Ambulance, Shield, Flame, Users, MapPin } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

const emergencyNumbers = [
  { icon: AlertTriangle, name: 'National Emergency', number: '112', color: 'bg-red-500' },
  { icon: Ambulance, name: 'Ambulance', number: '108', color: 'bg-green-500' },
  { icon: Shield, name: 'Police', number: '100', color: 'bg-blue-500' },
  { icon: Flame, name: 'Fire', number: '101', color: 'bg-orange-500' },
  { icon: Users, name: 'NDRF Helpline', number: '011-24363260', color: 'bg-purple-500' },
  { icon: MapPin, name: 'Disaster Mgmt', number: '1078', color: 'bg-teal-500' },
];

export function EmergencySOS() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPulsing, setIsPulsing] = useState(true);

  const handleCall = (number: string) => {
    window.location.href = `tel:${number}`;
  };

  return (
    <>
      {/* Floating SOS Button */}
      <button
        onClick={() => {
          setIsOpen(true);
          setIsPulsing(false);
        }}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full",
          "bg-gradient-to-br from-red-500 to-red-600 text-white shadow-2xl",
          "flex items-center justify-center transition-all duration-300",
          "hover:scale-110 hover:shadow-red-500/50 hover:shadow-2xl",
          "focus:outline-none focus:ring-4 focus:ring-red-500/50",
          isPulsing && "animate-pulse"
        )}
        aria-label="Emergency SOS"
      >
        <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-25" />
        <Phone className="w-7 h-7 relative z-10" />
      </button>

      {/* Emergency Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl text-destructive">
              <AlertTriangle className="w-6 h-6" />
              Emergency Helplines
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-3 mt-4">
            {emergencyNumbers.map((item) => (
              <button
                key={item.number}
                onClick={() => handleCall(item.number)}
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-xl",
                  "bg-muted/50 hover:bg-muted transition-colors",
                  "border border-border hover:border-primary/30"
                )}
              >
                <div className={cn("p-3 rounded-full", item.color)}>
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-foreground">{item.name}</p>
                  <p className="text-lg font-bold text-primary">{item.number}</p>
                </div>
                <Phone className="w-5 h-5 text-muted-foreground" />
              </button>
            ))}
          </div>

          <div className="mt-4 p-4 bg-destructive/10 rounded-xl border border-destructive/20">
            <p className="text-sm text-destructive font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Stay calm and provide your exact location when calling
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
