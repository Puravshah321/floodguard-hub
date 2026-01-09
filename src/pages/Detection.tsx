import { Satellite, Camera, Upload, History } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { ImageUploader } from '@/components/detection/ImageUploader';
import { StatCard } from '@/components/ui/StatCard';

const recentAnalyses = [
  { id: 1, location: 'Patna, Bihar', date: '2 hours ago', result: 'Flood Detected', confidence: 87 },
  { id: 2, location: 'Kolkata, WB', date: '5 hours ago', result: 'No Flood', confidence: 92 },
  { id: 3, location: 'Guwahati, Assam', date: '1 day ago', result: 'Flood Detected', confidence: 78 },
];

export default function Detection() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Satellite className="w-4 h-4" />
              <span className="text-sm">AI-Powered Analysis</span>
            </div>
            <h1 className="text-3xl font-bold">Flood Detection</h1>
            <p className="text-muted-foreground mt-1">Upload satellite or ground images for instant flood analysis</p>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard title="Images Analyzed" value="1,247" subtitle="This month" icon={Camera} variant="primary" />
            <StatCard title="Floods Detected" value="89" subtitle="Confirmed events" icon={Satellite} variant="danger" />
            <StatCard title="Avg. Accuracy" value="94.2%" subtitle="Model confidence" icon={Upload} variant="success" />
            <StatCard title="Processing Time" value="< 5s" subtitle="Per image" icon={History} />
          </div>
          
          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 animate-fade-in">
              <ImageUploader />
            </div>
            
            <div className="stat-card animate-fade-in">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <History className="w-5 h-5 text-muted-foreground" />
                Recent Analyses
              </h3>
              
              <div className="space-y-3">
                {recentAnalyses.map((analysis) => (
                  <div key={analysis.id} className="p-3 bg-secondary/50 rounded-lg">
                    <div className="flex items-start justify-between mb-1">
                      <p className="font-medium text-sm">{analysis.location}</p>
                      <span className={`text-xs font-medium ${analysis.result === 'Flood Detected' ? 'text-risk-severe' : 'text-risk-low'}`}>
                        {analysis.result}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{analysis.date}</span>
                      <span>Confidence: {analysis.confidence}%</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-3 bg-neer-sky/10 rounded-lg border border-neer-sky/20">
                <p className="text-sm font-medium text-neer-sky mb-1">Contribute Ground Reports</p>
                <p className="text-xs text-muted-foreground">Your ground-level photos help improve our detection accuracy.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
