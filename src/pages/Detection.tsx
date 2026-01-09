import { motion } from 'framer-motion';
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Satellite className="w-4 h-4" />
              <span className="text-sm">AI-Powered Analysis</span>
            </div>
            <h1 className="text-3xl font-bold">Flood Detection</h1>
            <p className="text-muted-foreground mt-1">
              Upload satellite or ground images for instant flood analysis
            </p>
          </motion.div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              title="Images Analyzed"
              value="1,247"
              subtitle="This month"
              icon={Camera}
              variant="primary"
            />
            <StatCard
              title="Floods Detected"
              value="89"
              subtitle="Confirmed events"
              icon={Satellite}
              variant="danger"
            />
            <StatCard
              title="Avg. Accuracy"
              value="94.2%"
              subtitle="Model confidence"
              icon={Upload}
              variant="success"
            />
            <StatCard
              title="Processing Time"
              value="< 5s"
              subtitle="Per image"
              icon={History}
            />
          </div>
          
          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Image Uploader - Takes 2 columns */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2"
            >
              <ImageUploader />
            </motion.div>
            
            {/* Recent Analyses */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="stat-card"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <History className="w-5 h-5 text-muted-foreground" />
                Recent Analyses
              </h3>
              
              <div className="space-y-3">
                {recentAnalyses.map((analysis, index) => (
                  <motion.div
                    key={analysis.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="p-3 bg-secondary/50 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <p className="font-medium text-sm">{analysis.location}</p>
                      <span className={`text-xs font-medium ${
                        analysis.result === 'Flood Detected' 
                          ? 'text-risk-severe' 
                          : 'text-risk-low'
                      }`}>
                        {analysis.result}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{analysis.date}</span>
                      <span>Confidence: {analysis.confidence}%</span>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-4 p-3 bg-neer-sky/10 rounded-lg border border-neer-sky/20">
                <p className="text-sm font-medium text-neer-sky mb-1">
                  Contribute Ground Reports
                </p>
                <p className="text-xs text-muted-foreground">
                  Your ground-level photos help improve our detection accuracy 
                  and provide critical real-time data.
                </p>
              </div>
            </motion.div>
          </div>
          
          {/* How It Works */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 stat-card"
          >
            <h3 className="font-semibold mb-4">How Detection Works</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-neer-sky/20 flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-neer-sky">1</span>
                </div>
                <div>
                  <p className="font-medium mb-1">Upload Image</p>
                  <p className="text-sm text-muted-foreground">
                    Submit satellite imagery or ground-level photos of the area
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-neer-sky/20 flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-neer-sky">2</span>
                </div>
                <div>
                  <p className="font-medium mb-1">AI Analysis</p>
                  <p className="text-sm text-muted-foreground">
                    Our ML model analyzes spectral patterns and water signatures
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-neer-sky/20 flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-neer-sky">3</span>
                </div>
                <div>
                  <p className="font-medium mb-1">Get Results</p>
                  <p className="text-sm text-muted-foreground">
                    Receive flood detection results with confidence scores
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
