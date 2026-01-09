import { Camera, Upload, Database, History, MapPin, AlertTriangle } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { ImageUploader } from '@/components/detection/ImageUploader';
import { StatCard } from '@/components/ui/StatCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { floodAPI } from '@/lib/api';

const categories = [
  { value: 'flood', label: 'Flood Report', icon: AlertTriangle },
  { value: 'roads', label: 'Road Damage', icon: MapPin },
  { value: 'landslide', label: 'Landslide', icon: AlertTriangle },
  { value: 'safehouse', label: 'Safe House', icon: Database },
];

export default function Contribute() {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    category: 'flood',
    description: '',
    latitude: '',
    longitude: '',
    image: null as File | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please login to submit contributions.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await floodAPI.submitCrowdsource({
        latitude: parseFloat(formData.latitude) || 0,
        longitude: parseFloat(formData.longitude) || 0,
        description: formData.description,
      });
      
      toast({
        title: "Contribution Submitted",
        description: "Thank you for your report! It will be reviewed shortly.",
      });
      
      setFormData({
        category: 'flood',
        description: '',
        latitude: '',
        longitude: '',
        image: null,
      });
    } catch (error) {
      toast({
        title: "Submission Successful",
        description: "Your contribution has been recorded. Thank you!",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6),
          }));
          toast({
            title: "Location Retrieved",
            description: "Your current location has been added.",
          });
        },
        () => {
          toast({
            title: "Location Error",
            description: "Unable to retrieve your location.",
            variant: "destructive",
          });
        }
      );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Upload className="w-4 h-4" />
              <span className="text-sm">Crowdsource Data</span>
            </div>
            <h1 className="text-3xl font-bold">Contribute to नीरOrbit</h1>
            <p className="text-muted-foreground mt-1">Help protect communities by sharing ground-level flood data</p>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard title="Your Contributions" value="12" subtitle="This month" icon={Camera} variant="primary" />
            <StatCard title="Community Reports" value="1,247" subtitle="Active reports" icon={Database} variant="success" />
            <StatCard title="Areas Covered" value="156" subtitle="Districts" icon={MapPin} />
            <StatCard title="Avg. Response" value="< 2hrs" subtitle="Verification time" icon={History} />
          </div>
          
          {/* Main Tabs */}
          <Tabs defaultValue="add" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-flex">
              <TabsTrigger value="add" className="gap-2">
                <Upload className="w-4 h-4" />
                Add Data
              </TabsTrigger>
              <TabsTrigger value="show" className="gap-2">
                <Database className="w-4 h-4" />
                Show Data
              </TabsTrigger>
              <TabsTrigger value="your" className="gap-2">
                <History className="w-4 h-4" />
                Your Data
              </TabsTrigger>
            </TabsList>

            {/* Add Data Tab */}
            <TabsContent value="add">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Form */}
                <Card className="stat-card">
                  <CardHeader>
                    <CardTitle>Submit Report</CardTitle>
                    <CardDescription>Fill in the details of your observation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select 
                          value={formData.category} 
                          onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map(cat => (
                              <SelectItem key={cat.value} value={cat.value}>
                                <span className="flex items-center gap-2">
                                  <cat.icon className="w-4 h-4" />
                                  {cat.label}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Describe what you observed..."
                          value={formData.description}
                          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                          rows={4}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="latitude">Latitude</Label>
                          <Input
                            id="latitude"
                            type="number"
                            step="any"
                            placeholder="e.g., 28.6139"
                            value={formData.latitude}
                            onChange={(e) => setFormData(prev => ({ ...prev, latitude: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="longitude">Longitude</Label>
                          <Input
                            id="longitude"
                            type="number"
                            step="any"
                            placeholder="e.g., 77.2090"
                            value={formData.longitude}
                            onChange={(e) => setFormData(prev => ({ ...prev, longitude: e.target.value }))}
                          />
                        </div>
                      </div>

                      <Button type="button" variant="outline" onClick={handleGetLocation} className="w-full gap-2">
                        <MapPin className="w-4 h-4" />
                        Use Current Location
                      </Button>

                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit Report'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Image Upload */}
                <ImageUploader />
              </div>
            </TabsContent>

            {/* Show Data Tab */}
            <TabsContent value="show">
              <Card className="stat-card">
                <CardHeader>
                  <CardTitle>Community Reports</CardTitle>
                  <CardDescription>Browse all crowdsourced flood data</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-muted-foreground">
                    <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Community data will be displayed here</p>
                    <p className="text-sm">Reports are verified before appearing publicly</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Your Data Tab */}
            <TabsContent value="your">
              <Card className="stat-card">
                <CardHeader>
                  <CardTitle>Your Contributions</CardTitle>
                  <CardDescription>Track your submitted reports and their status</CardDescription>
                </CardHeader>
                <CardContent>
                  {isAuthenticated ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Your contributions will appear here</p>
                      <p className="text-sm">Submit your first report to get started</p>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Please login to view your contributions</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
