import { Link, useLocation } from 'react-router-dom';
import { Bell, Menu, User, Shield, Droplets } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store/useAppStore';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/forecast', label: 'Forecast' },
  { href: '/detection', label: 'Detection' },
  { href: '/simulation', label: 'Simulation' },
];

export function Header() {
  const location = useLocation();
  const { alerts, toggleSidebar } = useAppStore();
  const unreadAlerts = alerts.filter((a) => !a.isRead).length;
  
  const isLanding = location.pathname === '/';
  
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 animate-fade-in ${
        isLanding 
          ? 'bg-transparent' 
          : 'bg-card/80 backdrop-blur-xl border-b border-border'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
              isLanding ? 'bg-white/20' : 'bg-neer-sky'
            }`}>
              <Droplets className={`w-5 h-5 ${isLanding ? 'text-white' : 'text-white'}`} />
            </div>
            <span className={`text-xl font-bold ${isLanding ? 'text-white' : 'text-foreground'}`}>
              नीरOrbit
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.href
                    ? isLanding 
                      ? 'bg-white/20 text-white' 
                      : 'bg-secondary text-foreground'
                    : isLanding 
                      ? 'text-white/80 hover:text-white hover:bg-white/10' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          
          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Alerts */}
            <Button
              variant={isLanding ? 'heroOutline' : 'ghost'}
              size="icon"
              className="relative"
            >
              <Bell className="w-5 h-5" />
              {unreadAlerts > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-risk-severe text-white text-xs">
                  {unreadAlerts}
                </Badge>
              )}
            </Button>
            
            {/* Admin Link */}
            <Link to="/admin">
              <Button
                variant={isLanding ? 'heroOutline' : 'ghost'}
                size="icon"
              >
                <Shield className="w-5 h-5" />
              </Button>
            </Link>
            
            {/* User */}
            <Button
              variant={isLanding ? 'heroOutline' : 'ghost'}
              size="icon"
            >
              <User className="w-5 h-5" />
            </Button>
            
            {/* Mobile Menu */}
            <Button
              variant={isLanding ? 'heroOutline' : 'ghost'}
              size="icon"
              className="md:hidden"
              onClick={toggleSidebar}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
