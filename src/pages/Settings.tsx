import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Bell, 
  MapPin, 
  Shield, 
  LogOut, 
  Save,
  ArrowLeft,
  Moon,
  Sun,
  Globe,
  Lock,
  Eye,
  EyeOff,
  Smartphone,
  Trash2,
  AlertTriangle,
  KeyRound,
  Monitor
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/layout/Header';
import { useNotifications } from '@/hooks/useNotifications';

export default function Settings() {
  const { user, logout, updateLocation } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { requestPermission, permission } = useNotifications();
  
  // Profile settings
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  
  // Password settings
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  // Preferences
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState('en');
  
  // Privacy settings
  const [privacy, setPrivacy] = useState({
    showProfile: true,
    showContributions: true,
    showLocation: false,
    showEmail: false,
    allowDataCollection: true,
  });
  
  // Notification settings
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: true,
    pushNotifications: true,
    floodWarnings: true,
    contributionUpdates: true,
    medalNotifications: true,
    weatherUpdates: false,
    weeklyDigest: true,
    highRiskAlerts: true,
  });

  // Location settings
  const [location, setLocation] = useState({
    state: user?.location?.state || '',
    city: user?.location?.city || '',
    pincode: '',
  });

  // Active sessions (mock data)
  const [sessions] = useState([
    { id: '1', device: 'Chrome on Windows', location: 'Mumbai, India', lastActive: 'Now', current: true },
    { id: '2', device: 'Safari on iPhone', location: 'Delhi, India', lastActive: '2 hours ago', current: false },
    { id: '3', device: 'Firefox on MacOS', location: 'Bangalore, India', lastActive: '1 day ago', current: false },
  ]);

  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile has been saved successfully.",
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: "Notification Preferences Saved",
      description: "Your notification settings have been updated.",
    });
  };

  const handleSavePrivacy = () => {
    toast({
      title: "Privacy Settings Saved",
      description: "Your privacy preferences have been updated.",
    });
  };

  const handleSaveLocation = () => {
    updateLocation({
      lat: 0,
      lon: 0,
      state: location.state,
      city: location.city,
    });
    toast({
      title: "Location Updated",
      description: "Your location preferences have been saved.",
    });
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Password Changed",
      description: "Your password has been updated successfully.",
    });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleLogoutAllDevices = () => {
    toast({
      title: "Logged Out From All Devices",
      description: "You have been logged out from all other devices.",
    });
  };

  const handleDeleteAccount = () => {
    logout();
    navigate('/');
    toast({
      title: "Account Deleted",
      description: "Your account has been permanently deleted.",
      variant: "destructive",
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleEnablePushNotifications = async () => {
    const granted = await requestPermission();
    if (granted) {
      toast({
        title: "Push Notifications Enabled",
        description: "You will now receive browser notifications.",
      });
    } else {
      toast({
        title: "Permission Denied",
        description: "Please enable notifications in your browser settings.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Settings</h1>
              <p className="text-muted-foreground">Manage your account, privacy, and preferences</p>
            </div>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-flex">
              <TabsTrigger value="profile" className="gap-2">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="account" className="gap-2">
                <Lock className="w-4 h-4" />
                <span className="hidden sm:inline">Account</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="gap-2">
                <Bell className="w-4 h-4" />
                <span className="hidden sm:inline">Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="privacy" className="gap-2">
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">Privacy</span>
              </TabsTrigger>
              <TabsTrigger value="danger" className="gap-2">
                <AlertTriangle className="w-4 h-4" />
                <span className="hidden sm:inline">Danger Zone</span>
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card className="stat-card">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal details and public profile</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex items-center gap-4">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={avatar} />
                      <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                        {name.split(' ').map(n => n[0]).join('') || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm">Change Avatar</Button>
                      <p className="text-xs text-muted-foreground">JPG, PNG or GIF. Max 2MB.</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell us about yourself..."
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground">Brief description for your profile.</p>
                  </div>

                  <Separator />

                  {/* Location */}
                  <div>
                    <h3 className="font-medium mb-4 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Location Settings
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Select value={location.state} onValueChange={(value) => setLocation(prev => ({ ...prev, state: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                            <SelectItem value="Gujarat">Gujarat</SelectItem>
                            <SelectItem value="Kerala">Kerala</SelectItem>
                            <SelectItem value="West Bengal">West Bengal</SelectItem>
                            <SelectItem value="Bihar">Bihar</SelectItem>
                            <SelectItem value="Assam">Assam</SelectItem>
                            <SelectItem value="Uttar Pradesh">Uttar Pradesh</SelectItem>
                            <SelectItem value="Odisha">Odisha</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">City/District</Label>
                        <Input
                          id="city"
                          value={location.city}
                          onChange={(e) => setLocation(prev => ({ ...prev, city: e.target.value }))}
                          placeholder="Enter city"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pincode">PIN Code</Label>
                        <Input
                          id="pincode"
                          value={location.pincode}
                          onChange={(e) => setLocation(prev => ({ ...prev, pincode: e.target.value }))}
                          placeholder="Enter PIN"
                        />
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleSaveProfile} className="gap-2">
                    <Save className="w-4 h-4" />
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Account Tab */}
            <TabsContent value="account">
              <div className="space-y-6">
                {/* Password Change */}
                <Card className="stat-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <KeyRound className="w-5 h-5" />
                      Change Password
                    </CardTitle>
                    <CardDescription>Update your password to keep your account secure</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Enter current password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            type={showNewPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm new password"
                        />
                      </div>
                    </div>
                    <Button onClick={handleChangePassword} className="gap-2">
                      <Lock className="w-4 h-4" />
                      Update Password
                    </Button>
                  </CardContent>
                </Card>

                {/* Active Sessions */}
                <Card className="stat-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Monitor className="w-5 h-5" />
                      Active Sessions
                    </CardTitle>
                    <CardDescription>Manage devices where you're logged in</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {sessions.map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Smartphone className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{session.device}</p>
                            <p className="text-sm text-muted-foreground">
                              {session.location} • {session.lastActive}
                            </p>
                          </div>
                        </div>
                        {session.current ? (
                          <span className="text-xs bg-[hsl(var(--risk-low)/0.15)] text-[hsl(var(--risk-low))] px-2 py-1 rounded-full">
                            Current
                          </span>
                        ) : (
                          <Button variant="ghost" size="sm" className="text-destructive">
                            Revoke
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button variant="outline" onClick={handleLogoutAllDevices} className="w-full gap-2">
                      <LogOut className="w-4 h-4" />
                      Logout from All Other Devices
                    </Button>
                  </CardContent>
                </Card>

                {/* Preferences */}
                <Card className="stat-card">
                  <CardHeader>
                    <CardTitle>Preferences</CardTitle>
                    <CardDescription>Customize how the app looks and behaves</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                        <div>
                          <p className="font-medium">Dark Mode</p>
                          <p className="text-sm text-muted-foreground">Use dark theme</p>
                        </div>
                      </div>
                      <Switch checked={isDarkMode} onCheckedChange={setIsDarkMode} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5" />
                        <div>
                          <p className="font-medium">Language</p>
                          <p className="text-sm text-muted-foreground">Select your preferred language</p>
                        </div>
                      </div>
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="hi">हिंदी</SelectItem>
                          <SelectItem value="mr">मराठी</SelectItem>
                          <SelectItem value="gu">ગુજરાતી</SelectItem>
                          <SelectItem value="bn">বাংলা</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <Card className="stat-card">
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Choose how you want to receive alerts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Push Notification Permission */}
                  {permission !== 'granted' && (
                    <div className="p-4 rounded-lg bg-[hsl(var(--neer-sky)/0.1)] border border-[hsl(var(--neer-sky)/0.2)]">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-[hsl(var(--neer-sky))]">Enable Browser Notifications</p>
                          <p className="text-sm text-muted-foreground">Get instant alerts even when the app is in background</p>
                        </div>
                        <Button onClick={handleEnablePushNotifications} size="sm">Enable</Button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <h3 className="font-medium">Alert Channels</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Alerts</p>
                        <p className="text-sm text-muted-foreground">Receive flood alerts via email</p>
                      </div>
                      <Switch
                        checked={notifications.emailAlerts}
                        onCheckedChange={(checked) => 
                          setNotifications(prev => ({ ...prev, emailAlerts: checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">SMS Alerts</p>
                        <p className="text-sm text-muted-foreground">Get critical alerts via SMS</p>
                      </div>
                      <Switch
                        checked={notifications.smsAlerts}
                        onCheckedChange={(checked) => 
                          setNotifications(prev => ({ ...prev, smsAlerts: checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Push Notifications</p>
                        <p className="text-sm text-muted-foreground">Browser push notifications</p>
                      </div>
                      <Switch
                        checked={notifications.pushNotifications}
                        onCheckedChange={(checked) => 
                          setNotifications(prev => ({ ...prev, pushNotifications: checked }))
                        }
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-medium">Alert Types</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Flood Warnings</p>
                        <p className="text-sm text-muted-foreground">Immediate flood risk alerts</p>
                      </div>
                      <Switch
                        checked={notifications.floodWarnings}
                        onCheckedChange={(checked) => 
                          setNotifications(prev => ({ ...prev, floodWarnings: checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">High-Risk Area Alerts</p>
                        <p className="text-sm text-muted-foreground">Alerts when you're in a high-risk zone</p>
                      </div>
                      <Switch
                        checked={notifications.highRiskAlerts}
                        onCheckedChange={(checked) => 
                          setNotifications(prev => ({ ...prev, highRiskAlerts: checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Contribution Updates</p>
                        <p className="text-sm text-muted-foreground">When your reports are approved</p>
                      </div>
                      <Switch
                        checked={notifications.contributionUpdates}
                        onCheckedChange={(checked) => 
                          setNotifications(prev => ({ ...prev, contributionUpdates: checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Medal Notifications</p>
                        <p className="text-sm text-muted-foreground">When you earn new medals</p>
                      </div>
                      <Switch
                        checked={notifications.medalNotifications}
                        onCheckedChange={(checked) => 
                          setNotifications(prev => ({ ...prev, medalNotifications: checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Weather Updates</p>
                        <p className="text-sm text-muted-foreground">Daily weather summaries</p>
                      </div>
                      <Switch
                        checked={notifications.weatherUpdates}
                        onCheckedChange={(checked) => 
                          setNotifications(prev => ({ ...prev, weatherUpdates: checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Weekly Digest</p>
                        <p className="text-sm text-muted-foreground">Weekly flood risk summary</p>
                      </div>
                      <Switch
                        checked={notifications.weeklyDigest}
                        onCheckedChange={(checked) => 
                          setNotifications(prev => ({ ...prev, weeklyDigest: checked }))
                        }
                      />
                    </div>
                  </div>

                  <Button onClick={handleSaveNotifications} className="gap-2">
                    <Save className="w-4 h-4" />
                    Save Preferences
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Privacy Tab */}
            <TabsContent value="privacy">
              <Card className="stat-card">
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                  <CardDescription>Control who can see your information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Profile Visibility</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Public Profile</p>
                        <p className="text-sm text-muted-foreground">Allow others to view your profile</p>
                      </div>
                      <Switch
                        checked={privacy.showProfile}
                        onCheckedChange={(checked) => 
                          setPrivacy(prev => ({ ...prev, showProfile: checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Show Contributions</p>
                        <p className="text-sm text-muted-foreground">Display your contributions on leaderboard</p>
                      </div>
                      <Switch
                        checked={privacy.showContributions}
                        onCheckedChange={(checked) => 
                          setPrivacy(prev => ({ ...prev, showContributions: checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Show Location</p>
                        <p className="text-sm text-muted-foreground">Display your location on profile</p>
                      </div>
                      <Switch
                        checked={privacy.showLocation}
                        onCheckedChange={(checked) => 
                          setPrivacy(prev => ({ ...prev, showLocation: checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Show Email</p>
                        <p className="text-sm text-muted-foreground">Display your email publicly</p>
                      </div>
                      <Switch
                        checked={privacy.showEmail}
                        onCheckedChange={(checked) => 
                          setPrivacy(prev => ({ ...prev, showEmail: checked }))
                        }
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-medium">Data & Analytics</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Data Collection</p>
                        <p className="text-sm text-muted-foreground">Allow anonymous usage data for improving the platform</p>
                      </div>
                      <Switch
                        checked={privacy.allowDataCollection}
                        onCheckedChange={(checked) => 
                          setPrivacy(prev => ({ ...prev, allowDataCollection: checked }))
                        }
                      />
                    </div>
                  </div>

                  <Button onClick={handleSavePrivacy} className="gap-2">
                    <Save className="w-4 h-4" />
                    Save Privacy Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Danger Zone Tab */}
            <TabsContent value="danger">
              <div className="space-y-6">
                <Card className="stat-card border-[hsl(var(--risk-high)/0.3)]">
                  <CardHeader>
                    <CardTitle className="text-[hsl(var(--risk-high))] flex items-center gap-2">
                      <LogOut className="w-5 h-5" />
                      Sign Out
                    </CardTitle>
                    <CardDescription>Sign out from this device</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" onClick={handleLogout} className="gap-2">
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </Button>
                  </CardContent>
                </Card>

                <Card className="stat-card border-destructive/50">
                  <CardHeader>
                    <CardTitle className="text-destructive flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Danger Zone
                    </CardTitle>
                    <CardDescription>Irreversible actions - proceed with caution</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-medium text-destructive">Delete Account</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Permanently delete your account and all associated data. This action cannot be undone.
                          </p>
                        </div>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" className="gap-2 shrink-0">
                              <Trash2 className="w-4 h-4" />
                              Delete Account
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your account
                                and remove all your data including contributions, achievements, and settings.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                Delete Account
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
