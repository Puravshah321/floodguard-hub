import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  {
    icon: BarChart3,
    title: 'Real-Time Forecasting',
    description: 'AI-powered flood predictions using live weather data and historical patterns',
  },
  {
    icon: Satellite,
    title: 'Satellite Detection',
    description: 'Analyze satellite imagery to detect flood events and water levels',
  },
  {
    icon: Users,
    title: 'Crowdsourced Intel',
    description: 'Community-reported ground conditions for comprehensive coverage',
  },
  {
    icon: Zap,
    title: 'Instant Alerts',
    description: 'Real-time notifications keep you informed of changing conditions',
  },
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
      <section className="relative min-h-screen flex items-center justify-center gradient-hero overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-neer-sky/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ 
              y: [0, 20, 0],
              opacity: [0.1, 0.15, 0.1]
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-neer-teal/20 rounded-full blur-3xl"
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8"
            >
              <span className="w-2 h-2 bg-risk-low rounded-full animate-pulse" />
              <span className="text-sm text-white/90">
                Live monitoring active across India
              </span>
            </motion.div>
            
            {/* Logo & Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center gap-4 mb-6"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Droplets className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-6xl md:text-7xl font-bold text-white">
                नीरOrbit
              </h1>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-2xl md:text-3xl text-white/90 font-light mb-4"
            >
              Predict • Prepare • Protect
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-lg text-white/70 max-w-2xl mx-auto mb-10"
            >
              AI-powered flood intelligence system for India. Real-time predictions, 
              satellite analysis, and community-driven alerts to safeguard lives and livelihoods.
            </motion.p>
            
            {/* Live Risk Indicator */}
            {floodPrediction && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-5 py-3 mb-10"
              >
                <span className="text-white/70 text-sm">Current India Risk:</span>
                <RiskBadge level={floodPrediction.riskLevel} size="lg" />
              </motion.div>
            )}
            
            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
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
            </motion.div>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown className="w-8 h-8 text-white/50" />
          </motion.div>
        </motion.div>
      </section>
      
      {/* Stats Section */}
      <section className="py-16 bg-card border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <p className="text-4xl font-bold text-neer-sky mb-2">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Comprehensive Flood Intelligence
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Combining cutting-edge technology with community participation 
              to create India's most advanced flood warning system.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="stat-card group hover:border-neer-sky/30"
              >
                <div className="p-3 rounded-xl bg-neer-sky/10 w-fit mb-4 group-hover:bg-neer-sky/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-neer-sky" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <CloudRain className="w-16 h-16 mx-auto mb-6 text-white/80" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Stay Ahead of Floods
            </h2>
            <p className="text-lg text-white/70 max-w-xl mx-auto mb-8">
              Join thousands of citizens and authorities using नीरOrbit 
              to protect communities across India.
            </p>
            <Link to="/dashboard">
              <Button variant="hero" size="xl">
                Get Started Now
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
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
            <p className="text-sm">
              © 2024 नीरOrbit. Smart Flood Forecasting for India.
            </p>
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
