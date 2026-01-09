import { Link } from 'react-router-dom';
import { 
  Droplets, 
  MapPin, 
  BarChart3, 
  Satellite, 
  Shield, 
  ArrowRight,
  ChevronDown,
  CloudRain,
  Users,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { useAppStore } from '@/store/useAppStore';
import { RiskBadge } from '@/components/ui/RiskBadge';

const features = [
  { icon: BarChart3, title: 'Real-Time Forecasting', description: 'AI-powered flood predictions using live weather data and historical patterns' },
  { icon: Satellite, title: 'Satellite Detection', description: 'Analyze satellite imagery to detect flood events and water levels' },
  { icon: Users, title: 'Crowdsourced Intel', description: 'Community-reported ground conditions for comprehensive coverage' },
  { icon: Zap, title: 'Instant Alerts', description: 'Real-time notifications keep you informed of changing conditions' },
];

const stats = [
  { value: '28', label: 'States Covered' },
  { value: '500+', label: 'Districts Monitored' },
  { value: '24/7', label: 'Active Monitoring' },
  { value: '< 5min', label: 'Alert Latency' },
];

export default function Landing() {
  const { floodPrediction } = useAppStore();
  
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-hero-pattern overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neer-sky/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-neer-teal/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
              <span className="w-2 h-2 bg-risk-low rounded-full animate-pulse" />
              <span className="text-sm text-white/90">Live monitoring active across India</span>
            </div>
            
            {/* Logo & Title */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Droplets className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-6xl md:text-7xl font-bold text-white">नीरOrbit</h1>
            </div>
            
            <p className="text-2xl md:text-3xl text-white/90 font-light mb-4">Predict • Prepare • Protect</p>
            
            <p className="text-lg text-white/70 max-w-2xl mx-auto mb-10">
              AI-powered flood intelligence system for India. Real-time predictions, satellite analysis, and community-driven alerts to safeguard lives and livelihoods.
            </p>
            
            {/* Live Risk Indicator */}
            {floodPrediction && (
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-5 py-3 mb-10">
                <span className="text-white/70 text-sm">Current India Risk:</span>
                <RiskBadge level={floodPrediction.riskLevel} size="lg" />
              </div>
            )}
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/dashboard">
                <Button variant="hero" size="xl">
                  <MapPin className="w-5 h-5" />
                  View Flood Risk
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/detection">
                <Button variant="heroOutline" size="xl">
                  <Satellite className="w-5 h-5" />
                  Report Conditions
                </Button>
              </Link>
              <Link to="/admin">
                <Button variant="heroOutline" size="xl">
                  <Shield className="w-5 h-5" />
                  Admin Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-white/50" />
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-16 bg-card border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <p className="text-4xl font-bold text-neer-sky mb-2">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Comprehensive Flood Intelligence</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Combining cutting-edge technology with community participation to create India's most advanced flood warning system.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={feature.title} className="stat-card group hover:border-neer-sky/30 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="p-3 rounded-xl bg-neer-sky/10 w-fit mb-4 group-hover:bg-neer-sky/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-neer-sky" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 bg-hero-pattern">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-fade-in">
            <CloudRain className="w-16 h-16 mx-auto mb-6 text-white/80" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Stay Ahead of Floods</h2>
            <p className="text-lg text-white/70 max-w-xl mx-auto mb-8">
              Join thousands of citizens and authorities using नीरOrbit to protect communities across India.
            </p>
            <Link to="/dashboard">
              <Button variant="hero" size="xl">
                Get Started Now
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 bg-neer-navy text-white/60">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Droplets className="w-5 h-5" />
              <span className="font-semibold text-white">नीरOrbit</span>
            </div>
            <p className="text-sm">© 2024 नीरOrbit. Smart Flood Forecasting for India.</p>
            <div className="flex items-center gap-4 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
