import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Bell, 
  FileImage, 
  BarChart3, 
  Users, 
  MapPin,
  Check,
  X,
  Send,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { StatCard } from '@/components/ui/StatCard';
import { FloodMap } from '@/components/maps/FloodMap';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';

// Mock data for reports
const mockReports = [
  {
    id: '1',
    userId: 'user_123',
    location: 'Patna, Bihar',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: 'pending',
    preview: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=300&h=200&fit=crop',
    analysisResult: { floodDetected: true, confidence: 0.87 },
  },
  {
    id: '2',
    userId: 'user_456',
    location: 'Guwahati, Assam',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    status: 'approved',
    preview: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=300&h=200&fit=crop',
    analysisResult: { floodDetected: true, confidence: 0.92 },
  },
  {
    id: '3',
    userId: 'user_789',
    location: 'Lucknow, UP',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    status: 'flagged',
    preview: 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=300&h=200&fit=crop',
    analysisResult: { floodDetected: false, confidence: 0.78 },
  },
];

export default function Admin() {
  const { addAlert } = useAppStore();
  const [reports, setReports] = useState(mockReports);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'reports' | 'alerts' | 'analytics'>('reports');
  
  const handleApprove = (id: string) => {
    setReports(reports.map((r) => r.id === id ? { ...r, status: 'approved' } : r));
  };
  
  const handleFlag = (id: string) => {
    setReports(reports.map((r) => r.id === id ? { ...r, status: 'flagged' } : r));
  };
  
  const handleBroadcastAlert = () => {
    if (!alertTitle || !alertMessage) return;
    
    addAlert({
      id: Date.now().toString(),
      type: 'danger',
      title: alertTitle,
      message: alertMessage,
      timestamp: new Date(),
      isRead: false,
    });
    
    setAlertTitle('');
    setAlertMessage('');
  };
  
  const tabs = [
    { id: 'reports', label: 'Flood Reports', icon: FileImage },
    { id: 'alerts', label: 'Alert Broadcast', icon: Bell },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ] as const;
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Shield className="w-4 h-4" />
              <span className="text-sm">Admin Access</span>
            </div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Manage flood reports, broadcast alerts, and view analytics
            </p>
          </motion.div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              title="Pending Reports"
              value={reports.filter((r) => r.status === 'pending').length.toString()}
              subtitle="Awaiting review"
              icon={FileImage}
              variant="warning"
            />
            <StatCard
              title="Active Alerts"
              value="5"
              subtitle="Currently broadcasting"
              icon={Bell}
              variant="danger"
            />
            <StatCard
              title="Monitored Regions"
              value="156"
              subtitle="Across India"
              icon={MapPin}
              variant="primary"
            />
            <StatCard
              title="Active Users"
              value="2,847"
              subtitle="Last 24 hours"
              icon={Users}
              trend={{ value: 12, isPositive: true }}
            />
          </div>
          
          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'outline'}
                onClick={() => setActiveTab(tab.id)}
                className="flex-shrink-0"
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </Button>
            ))}
          </div>
          
          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid lg:grid-cols-3 gap-6"
            >
              <div className="lg:col-span-2 space-y-4">
                <div className="stat-card">
                  <h3 className="font-semibold mb-4">Submitted Reports</h3>
                  
                  <div className="space-y-4">
                    {reports.map((report) => (
                      <motion.div
                        key={report.id}
                        layout
                        className="flex gap-4 p-4 bg-secondary/30 rounded-xl border border-border"
                      >
                        <img
                          src={report.preview}
                          alt="Report preview"
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-medium">{report.location}</p>
                              <p className="text-sm text-muted-foreground">
                                {report.timestamp.toLocaleString()}
                              </p>
                            </div>
                            <span className={cn(
                              'text-xs px-2 py-1 rounded-full font-medium',
                              report.status === 'pending' && 'bg-risk-moderate/20 text-risk-moderate',
                              report.status === 'approved' && 'bg-risk-low/20 text-risk-low',
                              report.status === 'flagged' && 'bg-risk-severe/20 text-risk-severe',
                            )}>
                              {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2 mb-3">
                            <span className={cn(
                              'text-sm font-medium',
                              report.analysisResult.floodDetected ? 'text-risk-severe' : 'text-risk-low'
                            )}>
                              {report.analysisResult.floodDetected ? 'Flood Detected' : 'No Flood'}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              ({(report.analysisResult.confidence * 100).toFixed(0)}% confidence)
                            </span>
                          </div>
                          
                          {report.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button
                                variant="success"
                                size="sm"
                                onClick={() => handleApprove(report.id)}
                              >
                                <Check className="w-4 h-4" />
                                Approve
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleFlag(report.id)}
                              >
                                <X className="w-4 h-4" />
                                Flag
                              </Button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Map */}
              <div className="stat-card p-0 overflow-hidden">
                <div className="p-4 border-b border-border">
                  <h3 className="font-semibold">Report Locations</h3>
                </div>
                <FloodMap height="500px" />
              </div>
            </motion.div>
          )}
          
          {/* Alerts Tab */}
          {activeTab === 'alerts' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid lg:grid-cols-2 gap-6"
            >
              <div className="stat-card">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-risk-severe" />
                  Broadcast Alert
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Send real-time alerts to all users in affected regions
                </p>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Alert Title</label>
                    <Input
                      placeholder="e.g., Flood Warning - Mumbai Region"
                      value={alertTitle}
                      onChange={(e) => setAlertTitle(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Message</label>
                    <Textarea
                      placeholder="Enter alert details..."
                      value={alertMessage}
                      onChange={(e) => setAlertMessage(e.target.value)}
                      rows={4}
                    />
                  </div>
                  
                  <Button
                    variant="risk"
                    className="w-full"
                    onClick={handleBroadcastAlert}
                    disabled={!alertTitle || !alertMessage}
                  >
                    <Send className="w-4 h-4" />
                    Broadcast Alert
                  </Button>
                </div>
              </div>
              
              <div className="stat-card">
                <h3 className="font-semibold mb-4">Quick Alert Templates</h3>
                
                <div className="space-y-3">
                  {[
                    { title: 'Heavy Rainfall Warning', severity: 'high' },
                    { title: 'River Level Rising', severity: 'moderate' },
                    { title: 'Evacuation Advisory', severity: 'severe' },
                    { title: 'All Clear - Safe to Return', severity: 'low' },
                  ].map((template, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setAlertTitle(template.title);
                        setAlertMessage(`This is an automated ${template.title.toLowerCase()} alert. Please follow official guidelines.`);
                      }}
                      className={cn(
                        'w-full p-3 rounded-lg text-left transition-colors flex items-center gap-3',
                        'bg-secondary/50 hover:bg-secondary border border-border'
                      )}
                    >
                      <AlertTriangle className={cn(
                        'w-5 h-5',
                        template.severity === 'severe' && 'text-risk-severe',
                        template.severity === 'high' && 'text-risk-high',
                        template.severity === 'moderate' && 'text-risk-moderate',
                        template.severity === 'low' && 'text-risk-low',
                      )} />
                      <span className="font-medium">{template.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid lg:grid-cols-2 gap-6"
            >
              <div className="stat-card">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-neer-sky" />
                  Flood Frequency by Region
                </h3>
                
                <div className="space-y-4">
                  {[
                    { region: 'Bihar', incidents: 45, change: 12 },
                    { region: 'Assam', incidents: 38, change: -5 },
                    { region: 'West Bengal', incidents: 32, change: 8 },
                    { region: 'Uttar Pradesh', incidents: 28, change: 15 },
                    { region: 'Maharashtra', incidents: 21, change: -3 },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium">{item.region}</span>
                          <span>{item.incidents} incidents</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-neer-sky rounded-full"
                            style={{ width: `${(item.incidents / 45) * 100}%` }}
                          />
                        </div>
                      </div>
                      <span className={cn(
                        'text-xs font-medium',
                        item.change > 0 ? 'text-risk-severe' : 'text-risk-low'
                      )}>
                        {item.change > 0 ? '+' : ''}{item.change}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="stat-card p-0 overflow-hidden">
                <div className="p-4 border-b border-border">
                  <h3 className="font-semibold">Vulnerability Heatmap</h3>
                  <p className="text-sm text-muted-foreground">
                    Regional flood risk distribution
                  </p>
                </div>
                <FloodMap height="400px" />
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
