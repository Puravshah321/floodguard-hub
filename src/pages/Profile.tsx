import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  User, 
  MapPin, 
  Calendar, 
  Award, 
  Camera, 
  Edit, 
  Settings,
  Trophy,
  Flame,
  TrendingUp,
  ExternalLink,
  ChevronRight,
  Grid3X3,
  List,
  Filter,
  X,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Header } from '@/components/layout/Header';
import { useAuth } from '@/contexts/AuthContext';
import { useContributions, getMedalInfo, type Contribution } from '@/hooks/useContributions';

const CATEGORY_ICONS: Record<string, string> = {
  Flood: '🌊',
  Roads: '🛣️',
  Landslide: '⛰️',
  Safehouse: '🏠',
  Other: '📍',
};

const CATEGORY_COLORS: Record<string, string> = {
  Flood: 'bg-blue-500/10 text-blue-600 border-blue-200',
  Roads: 'bg-orange-500/10 text-orange-600 border-orange-200',
  Landslide: 'bg-amber-500/10 text-amber-600 border-amber-200',
  Safehouse: 'bg-green-500/10 text-green-600 border-green-200',
  Other: 'bg-slate-500/10 text-slate-600 border-slate-200',
};

const STATUS_CONFIG = {
  approved: { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100', label: 'Approved' },
  pending: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100', label: 'Pending' },
  rejected: { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-100', label: 'Rejected' },
};

export default function Profile() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { userContributions, stats, isLoading: contributionsLoading } = useContributions();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [selectedContribution, setSelectedContribution] = useState<Contribution | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  
  const defaultTab = searchParams.get('tab') || 'overview';

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/auth');
    }
  }, [authLoading, isAuthenticated, navigate]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const initials = user.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || user.email[0].toUpperCase();

  const medalInfo = getMedalInfo(stats.medal);
  const memberSince = new Date(2024, 5, 15); // Mock - would come from API
  const nextMedalThreshold = stats.medal === 'Elite' ? 100 : 
    stats.medal === 'Gold' ? 31 : 
    stats.medal === 'Silver' ? 16 : 
    stats.medal === 'Bronze' ? 6 : 1;
  const progressToNextMedal = Math.min(100, (stats.totalContributions / nextMedalThreshold) * 100);

  const filteredContributions = categoryFilter 
    ? userContributions.filter(c => c.category === categoryFilter)
    : userContributions;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-12">
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-primary/5 via-primary/10 to-accent/5 border-b border-border">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar */}
              <div className="relative group">
                <Avatar className="h-28 w-28 border-4 border-background shadow-xl">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-3xl font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="w-6 h-6 text-white" />
                </button>
                {/* Medal Badge */}
                {stats.medal && (
                  <div className={`absolute -bottom-1 -right-1 w-10 h-10 rounded-full ${medalInfo.bgColor} ${medalInfo.borderColor} border-2 flex items-center justify-center text-xl shadow-lg`}>
                    {medalInfo.emoji}
                  </div>
                )}
              </div>
              
              {/* User Info */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold">{user.name}</h1>
                  {stats.medal && (
                    <Badge className={`${medalInfo.bgColor} ${medalInfo.color} border ${medalInfo.borderColor} font-medium`}>
                      {medalInfo.emoji} {stats.medal} Contributor
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground mb-3">Disaster Response Contributor</p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  {user.location?.city && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {user.location.city}, {user.location.state}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Joined {memberSince.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Trophy className="w-4 h-4" />
                    Rank #{stats.globalRank}
                  </span>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2">
                <Link to="/settings">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </Button>
                </Link>
                <Link to="/detection">
                  <Button size="sm" className="gap-2">
                    <Camera className="w-4 h-4" />
                    Contribute Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <Tabs defaultValue={defaultTab} className="space-y-8">
            <TabsList className="inline-flex">
              <TabsTrigger value="overview" className="gap-2">
                <TrendingUp className="w-4 h-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="contributions" className="gap-2">
                <Camera className="w-4 h-4" />
                Contributions
              </TabsTrigger>
              <TabsTrigger value="achievements" className="gap-2">
                <Award className="w-4 h-4" />
                Achievements
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="border-border hover:border-primary/30 transition-colors">
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold text-primary">{stats.totalContributions}</div>
                    <p className="text-sm text-muted-foreground">Total Contributions</p>
                  </CardContent>
                </Card>
                <Card className="border-border hover:border-primary/30 transition-colors">
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold text-orange-500 flex items-center gap-1">
                      {stats.contributionStreak}
                      <Flame className="w-6 h-6" />
                    </div>
                    <p className="text-sm text-muted-foreground">Day Streak</p>
                  </CardContent>
                </Card>
                <Card className="border-border hover:border-primary/30 transition-colors">
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold text-green-600">#{stats.globalRank}</div>
                    <p className="text-sm text-muted-foreground">Global Rank</p>
                  </CardContent>
                </Card>
                <Card className="border-border hover:border-primary/30 transition-colors">
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold text-blue-600">{stats.monthlyContributions}</div>
                    <p className="text-sm text-muted-foreground">This Month</p>
                  </CardContent>
                </Card>
              </div>

              {/* Progress to Next Medal */}
              {stats.medal !== 'Elite' && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Progress to {stats.medal === 'Gold' ? 'Elite' : stats.medal === 'Silver' ? 'Gold' : stats.medal === 'Bronze' ? 'Silver' : 'Bronze'}</span>
                      <span className="text-sm text-muted-foreground">{stats.totalContributions}/{nextMedalThreshold} contributions</span>
                    </div>
                    <Progress value={progressToNextMedal} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-2">
                      {nextMedalThreshold - stats.totalContributions} more contributions to unlock the next level
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Categories Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contribution Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(stats.categoryCounts).map(([category, count]) => (
                      <div 
                        key={category}
                        className={`p-4 rounded-lg border ${CATEGORY_COLORS[category] || CATEGORY_COLORS.Other}`}
                      >
                        <div className="text-2xl mb-1">{CATEGORY_ICONS[category] || '📍'}</div>
                        <div className="text-xl font-bold">{count}</div>
                        <div className="text-sm">{category}</div>
                      </div>
                    ))}
                    {Object.keys(stats.categoryCounts).length === 0 && (
                      <p className="col-span-4 text-center text-muted-foreground py-8">
                        No contributions yet. Start contributing to see your stats!
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Contributions Preview */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Recent Contributions</CardTitle>
                  <Link to="/profile?tab=contributions">
                    <Button variant="ghost" size="sm" className="gap-1">
                      View All
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {userContributions.slice(0, 4).map((contribution) => (
                      <button
                        key={contribution.id}
                        onClick={() => setSelectedContribution(contribution)}
                        className="group relative aspect-square rounded-lg overflow-hidden border border-border hover:border-primary/50 transition-all"
                      >
                        <img
                          src={contribution.imageUrl}
                          alt={contribution.description}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="absolute bottom-2 left-2 right-2">
                            <Badge className="text-xs bg-black/50 text-white border-0">
                              {CATEGORY_ICONS[contribution.category]} {contribution.category}
                            </Badge>
                          </div>
                        </div>
                      </button>
                    ))}
                    {userContributions.length === 0 && (
                      <div className="col-span-4 text-center py-12">
                        <Camera className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                        <p className="text-muted-foreground">No contributions yet</p>
                        <Link to="/detection">
                          <Button variant="outline" size="sm" className="mt-3">
                            Make Your First Contribution
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Contributions Tab */}
            <TabsContent value="contributions" className="space-y-6">
              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 flex-1">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Filter:</span>
                  {['Flood', 'Roads', 'Landslide', 'Safehouse'].map((cat) => (
                    <Button
                      key={cat}
                      variant={categoryFilter === cat ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCategoryFilter(categoryFilter === cat ? null : cat)}
                      className="text-xs"
                    >
                      {CATEGORY_ICONS[cat]} {cat}
                    </Button>
                  ))}
                  {categoryFilter && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCategoryFilter(null)}
                      className="text-xs"
                    >
                      <X className="w-4 h-4" />
                      Clear
                    </Button>
                  )}
                </div>
                <div className="flex items-center gap-1 border rounded-lg p-1">
                  <Button
                    variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Contributions Grid/List */}
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredContributions.map((contribution) => {
                    const statusConfig = STATUS_CONFIG[contribution.status];
                    const StatusIcon = statusConfig.icon;
                    
                    return (
                      <button
                        key={contribution.id}
                        onClick={() => setSelectedContribution(contribution)}
                        className="group text-left rounded-xl overflow-hidden border border-border bg-card hover:border-primary/30 hover:shadow-lg transition-all"
                      >
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <img
                            src={contribution.imageUrl}
                            alt={contribution.description}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute top-2 right-2">
                            <Badge className={`${statusConfig.bg} ${statusConfig.color} border-0 text-xs`}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {statusConfig.label}
                            </Badge>
                          </div>
                        </div>
                        <div className="p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className={`${CATEGORY_COLORS[contribution.category]} text-xs`}>
                              {CATEGORY_ICONS[contribution.category]} {contribution.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {contribution.description}
                          </p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            <span>{contribution.latitude.toFixed(4)}, {contribution.longitude.toFixed(4)}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(contribution.timestamp).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredContributions.map((contribution) => {
                    const statusConfig = STATUS_CONFIG[contribution.status];
                    const StatusIcon = statusConfig.icon;
                    
                    return (
                      <button
                        key={contribution.id}
                        onClick={() => setSelectedContribution(contribution)}
                        className="w-full text-left flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-md transition-all"
                      >
                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={contribution.imageUrl}
                            alt={contribution.description}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className={`${CATEGORY_COLORS[contribution.category]} text-xs`}>
                              {CATEGORY_ICONS[contribution.category]} {contribution.category}
                            </Badge>
                            <Badge className={`${statusConfig.bg} ${statusConfig.color} border-0 text-xs`}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {statusConfig.label}
                            </Badge>
                          </div>
                          <p className="text-sm line-clamp-1">{contribution.description}</p>
                          <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {contribution.latitude.toFixed(2)}, {contribution.longitude.toFixed(2)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(contribution.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </button>
                    );
                  })}
                </div>
              )}

              {filteredContributions.length === 0 && (
                <div className="text-center py-16">
                  <Camera className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                  <h3 className="text-lg font-medium mb-1">No contributions found</h3>
                  <p className="text-muted-foreground mb-4">
                    {categoryFilter ? `No ${categoryFilter} contributions yet.` : 'Start contributing to build your profile!'}
                  </p>
                  <Link to="/detection">
                    <Button className="gap-2">
                      <Camera className="w-4 h-4" />
                      Make a Contribution
                    </Button>
                  </Link>
                </div>
              )}
            </TabsContent>

            {/* Achievements Tab */}
            <TabsContent value="achievements" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Medal Progress */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-yellow-500" />
                      Contributor Level
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {['Bronze', 'Silver', 'Gold', 'Elite'].map((medal) => {
                      const info = getMedalInfo(medal as any);
                      const threshold = medal === 'Bronze' ? 1 : medal === 'Silver' ? 6 : medal === 'Gold' ? 16 : 31;
                      const isUnlocked = stats.totalContributions >= threshold;
                      const isCurrent = stats.medal === medal;
                      
                      return (
                        <div 
                          key={medal}
                          className={`flex items-center gap-4 p-3 rounded-lg border transition-all ${
                            isCurrent 
                              ? `${info.bgColor} ${info.borderColor}` 
                              : isUnlocked 
                                ? 'border-border bg-secondary/30' 
                                : 'border-dashed border-muted'
                          }`}
                        >
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                            isUnlocked ? info.bgColor : 'bg-muted'
                          }`}>
                            {isUnlocked ? info.emoji : '🔒'}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className={`font-medium ${isUnlocked ? '' : 'text-muted-foreground'}`}>
                                {medal}
                              </span>
                              {isCurrent && (
                                <Badge className="text-xs bg-primary text-primary-foreground">Current</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {threshold}+ contributions
                            </p>
                          </div>
                          {isUnlocked && (
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                          )}
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>

                {/* Achievements */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Award className="w-5 h-5 text-purple-500" />
                      Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { name: 'First Steps', desc: 'Make your first contribution', emoji: '👣', unlocked: stats.totalContributions >= 1 },
                      { name: 'Getting Started', desc: 'Reach 5 contributions', emoji: '🚀', unlocked: stats.totalContributions >= 5 },
                      { name: 'Streak Master', desc: 'Maintain a 7-day streak', emoji: '🔥', unlocked: stats.contributionStreak >= 7 },
                      { name: 'Category Explorer', desc: 'Contribute in 3+ categories', emoji: '🗺️', unlocked: Object.keys(stats.categoryCounts).length >= 3 },
                      { name: 'Community Hero', desc: 'Reach top 50 globally', emoji: '🦸', unlocked: stats.globalRank <= 50 },
                      { name: 'Legend', desc: 'Make 50 contributions', emoji: '👑', unlocked: stats.totalContributions >= 50 },
                    ].map((achievement) => (
                      <div 
                        key={achievement.name}
                        className={`flex items-center gap-4 p-3 rounded-lg border transition-all ${
                          achievement.unlocked 
                            ? 'border-primary/30 bg-primary/5' 
                            : 'border-dashed border-muted'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                          achievement.unlocked ? 'bg-primary/10' : 'bg-muted grayscale'
                        }`}>
                          {achievement.emoji}
                        </div>
                        <div className="flex-1">
                          <span className={`font-medium ${achievement.unlocked ? '' : 'text-muted-foreground'}`}>
                            {achievement.name}
                          </span>
                          <p className="text-sm text-muted-foreground">{achievement.desc}</p>
                        </div>
                        {achievement.unlocked && (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Contribution Detail Modal */}
      <Dialog open={!!selectedContribution} onOpenChange={() => setSelectedContribution(null)}>
        <DialogContent className="max-w-2xl">
          {selectedContribution && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Badge variant="outline" className={CATEGORY_COLORS[selectedContribution.category]}>
                    {CATEGORY_ICONS[selectedContribution.category]} {selectedContribution.category}
                  </Badge>
                  <Badge className={`${STATUS_CONFIG[selectedContribution.status].bg} ${STATUS_CONFIG[selectedContribution.status].color} border-0`}>
                    {STATUS_CONFIG[selectedContribution.status].label}
                  </Badge>
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="aspect-video rounded-lg overflow-hidden">
                  <img
                    src={selectedContribution.imageUrl}
                    alt={selectedContribution.description}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-3">
                  <p className="text-sm">{selectedContribution.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {selectedContribution.latitude.toFixed(6)}, {selectedContribution.longitude.toFixed(6)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(selectedContribution.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2" asChild>
                    <a 
                      href={`https://www.google.com/maps?q=${selectedContribution.latitude},${selectedContribution.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View on Map
                    </a>
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
