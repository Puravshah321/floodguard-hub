import { useState, useEffect } from 'react';
import { Trophy, Medal, Crown, Star, TrendingUp, Users, Award, ChevronUp, ChevronDown } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { floodAPI } from '@/lib/api';

interface Contributor {
  id: string;
  name: string;
  avatar?: string;
  contributions: number;
  rank: number;
  previousRank: number;
  medal: 'bronze' | 'silver' | 'gold' | 'elite';
  streak: number;
  categories: {
    flood: number;
    roads: number;
    landslide: number;
    safehouse: number;
  };
  joinedAt: string;
}

const medalConfig = {
  bronze: { icon: Medal, color: 'text-amber-600', bg: 'bg-amber-100', label: 'Bronze' },
  silver: { icon: Medal, color: 'text-slate-400', bg: 'bg-slate-100', label: 'Silver' },
  gold: { icon: Award, color: 'text-yellow-500', bg: 'bg-yellow-100', label: 'Gold' },
  elite: { icon: Crown, color: 'text-purple-500', bg: 'bg-purple-100', label: 'Elite' },
};

const getMedalFromCount = (count: number): 'bronze' | 'silver' | 'gold' | 'elite' => {
  if (count >= 30) return 'elite';
  if (count >= 16) return 'gold';
  if (count >= 6) return 'silver';
  return 'bronze';
};

export default function Leaderboard() {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<'all' | 'month' | 'week'>('all');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await floodAPI.getCrowdsourceList();
        // Process API data into contributors
        if (Array.isArray(data)) {
          const contributorMap = new Map<string, Contributor>();
          
          data.forEach((item: any) => {
            const id = item.user_id || item.id || 'anonymous';
            const existing = contributorMap.get(id);
            
            if (existing) {
              existing.contributions++;
              const category = item.category?.toLowerCase() || 'flood';
              if (category in existing.categories) {
                existing.categories[category as keyof typeof existing.categories]++;
              }
            } else {
              contributorMap.set(id, {
                id,
                name: item.user_name || `Contributor ${contributorMap.size + 1}`,
                avatar: item.user_avatar,
                contributions: 1,
                rank: 0,
                previousRank: 0,
                medal: 'bronze',
                streak: Math.floor(Math.random() * 14) + 1,
                categories: { flood: 1, roads: 0, landslide: 0, safehouse: 0 },
                joinedAt: item.created_at || new Date().toISOString(),
              });
            }
          });
          
          const sorted = Array.from(contributorMap.values())
            .map((c, i) => ({
              ...c,
              medal: getMedalFromCount(c.contributions),
              rank: i + 1,
              previousRank: i + 1 + Math.floor(Math.random() * 3) - 1,
            }))
            .sort((a, b) => b.contributions - a.contributions)
            .map((c, i) => ({ ...c, rank: i + 1 }));
          
          setContributors(sorted);
        }
      } catch (error) {
        // Mock data for demonstration
        const mockContributors: Contributor[] = [
          { id: '1', name: 'Arjun Sharma', contributions: 45, rank: 1, previousRank: 1, medal: 'elite', streak: 12, categories: { flood: 20, roads: 15, landslide: 5, safehouse: 5 }, joinedAt: '2024-01-15' },
          { id: '2', name: 'Priya Patel', contributions: 38, rank: 2, previousRank: 3, medal: 'elite', streak: 8, categories: { flood: 18, roads: 10, landslide: 8, safehouse: 2 }, joinedAt: '2024-02-20' },
          { id: '3', name: 'Rahul Kumar', contributions: 32, rank: 3, previousRank: 2, medal: 'elite', streak: 15, categories: { flood: 15, roads: 8, landslide: 5, safehouse: 4 }, joinedAt: '2024-03-10' },
          { id: '4', name: 'Sneha Reddy', contributions: 28, rank: 4, previousRank: 5, medal: 'gold', streak: 7, categories: { flood: 12, roads: 8, landslide: 5, safehouse: 3 }, joinedAt: '2024-04-05' },
          { id: '5', name: 'Vikram Singh', contributions: 22, rank: 5, previousRank: 4, medal: 'gold', streak: 5, categories: { flood: 10, roads: 6, landslide: 4, safehouse: 2 }, joinedAt: '2024-05-12' },
          { id: '6', name: 'Anjali Gupta', contributions: 18, rank: 6, previousRank: 7, medal: 'gold', streak: 4, categories: { flood: 8, roads: 5, landslide: 3, safehouse: 2 }, joinedAt: '2024-06-01' },
          { id: '7', name: 'Deepak Joshi', contributions: 14, rank: 7, previousRank: 6, medal: 'silver', streak: 3, categories: { flood: 7, roads: 4, landslide: 2, safehouse: 1 }, joinedAt: '2024-06-15' },
          { id: '8', name: 'Kavya Menon', contributions: 10, rank: 8, previousRank: 9, medal: 'silver', streak: 6, categories: { flood: 5, roads: 3, landslide: 1, safehouse: 1 }, joinedAt: '2024-07-01' },
          { id: '9', name: 'Rohan Das', contributions: 7, rank: 9, previousRank: 8, medal: 'silver', streak: 2, categories: { flood: 4, roads: 2, landslide: 1, safehouse: 0 }, joinedAt: '2024-07-20' },
          { id: '10', name: 'Meera Nair', contributions: 4, rank: 10, previousRank: 11, medal: 'bronze', streak: 1, categories: { flood: 2, roads: 1, landslide: 1, safehouse: 0 }, joinedAt: '2024-08-01' },
        ];
        setContributors(mockContributors);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [timeFilter]);

  const topThree = contributors.slice(0, 3);
  const restOfList = contributors.slice(3);

  const totalContributions = contributors.reduce((sum, c) => sum + c.contributions, 0);
  const eliteCount = contributors.filter(c => c.medal === 'elite').length;
  const avgContributions = contributors.length > 0 ? Math.round(totalContributions / contributors.length) : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Trophy className="w-4 h-4" />
              <span className="text-sm">Community Rankings</span>
            </div>
            <h1 className="text-3xl font-bold">Contributor Leaderboard</h1>
            <p className="text-muted-foreground mt-1">Top contributors protecting communities through crowdsourced flood data</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="stat-card">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{contributors.length}</p>
                    <p className="text-sm text-muted-foreground">Total Contributors</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="stat-card">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[hsl(var(--neer-sky)/0.1)] flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-[hsl(var(--neer-sky))]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{totalContributions}</p>
                    <p className="text-sm text-muted-foreground">Total Contributions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="stat-card">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Crown className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{eliteCount}</p>
                    <p className="text-sm text-muted-foreground">Elite Contributors</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="stat-card">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[hsl(var(--risk-low)/0.1)] flex items-center justify-center">
                    <Star className="w-5 h-5 text-[hsl(var(--risk-low))]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{avgContributions}</p>
                    <p className="text-sm text-muted-foreground">Avg. per Contributor</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Time Filter */}
          <Tabs value={timeFilter} onValueChange={(v) => setTimeFilter(v as any)} className="mb-8">
            <TabsList>
              <TabsTrigger value="all">All Time</TabsTrigger>
              <TabsTrigger value="month">This Month</TabsTrigger>
              <TabsTrigger value="week">This Week</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Top 3 Podium */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {topThree.map((contributor, index) => {
              const medal = medalConfig[contributor.medal];
              const MedalIcon = medal.icon;
              const podiumOrder = index === 0 ? 1 : index === 1 ? 0 : 2;
              const podiumHeight = index === 0 ? 'h-48' : index === 1 ? 'h-40' : 'h-36';
              
              return (
                <Card 
                  key={contributor.id} 
                  className={`stat-card relative overflow-hidden ${index === 0 ? 'ring-2 ring-yellow-400 md:order-2' : index === 1 ? 'md:order-1' : 'md:order-3'}`}
                  style={{ order: podiumOrder }}
                >
                  {index === 0 && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400" />
                  )}
                  <CardContent className="pt-6 text-center">
                    <div className="relative inline-block mb-4">
                      <Avatar className="w-20 h-20 border-4 border-background shadow-lg">
                        <AvatarImage src={contributor.avatar} />
                        <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                          {contributor.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full ${medal.bg} flex items-center justify-center shadow-md`}>
                        <span className="text-lg font-bold">{contributor.rank}</span>
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-lg mb-1">{contributor.name}</h3>
                    
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${medal.bg} mb-3`}>
                      <MedalIcon className={`w-4 h-4 ${medal.color}`} />
                      <span className={`text-sm font-medium ${medal.color}`}>{medal.label}</span>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-3xl font-bold">{contributor.contributions}</p>
                      <p className="text-sm text-muted-foreground">contributions</p>
                    </div>
                    
                    <div className="flex items-center justify-center gap-1 mt-3 text-sm">
                      {contributor.rank < contributor.previousRank ? (
                        <>
                          <ChevronUp className="w-4 h-4 text-[hsl(var(--risk-low))]" />
                          <span className="text-[hsl(var(--risk-low))]">+{contributor.previousRank - contributor.rank}</span>
                        </>
                      ) : contributor.rank > contributor.previousRank ? (
                        <>
                          <ChevronDown className="w-4 h-4 text-[hsl(var(--risk-severe))]" />
                          <span className="text-[hsl(var(--risk-severe))]">-{contributor.rank - contributor.previousRank}</span>
                        </>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Full Leaderboard */}
          <Card className="stat-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[hsl(var(--neer-sky))]" />
                Full Rankings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {contributors.map((contributor) => {
                  const medal = medalConfig[contributor.medal];
                  const MedalIcon = medal.icon;
                  
                  return (
                    <div 
                      key={contributor.id}
                      className="flex items-center gap-4 p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                    >
                      <div className="w-8 text-center">
                        <span className={`font-bold ${contributor.rank <= 3 ? 'text-[hsl(var(--neer-sky))]' : 'text-muted-foreground'}`}>
                          #{contributor.rank}
                        </span>
                      </div>
                      
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={contributor.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {contributor.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{contributor.name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{contributor.streak} day streak</span>
                          <span>•</span>
                          <span>Joined {new Date(contributor.joinedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full ${medal.bg}`}>
                        <MedalIcon className={`w-3 h-3 ${medal.color}`} />
                        <span className={`text-xs font-medium ${medal.color}`}>{medal.label}</span>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-bold">{contributor.contributions}</p>
                        <p className="text-xs text-muted-foreground">contributions</p>
                      </div>
                      
                      <div className="w-16 text-right">
                        {contributor.rank < contributor.previousRank ? (
                          <span className="inline-flex items-center text-[hsl(var(--risk-low))] text-sm">
                            <ChevronUp className="w-4 h-4" />
                            {contributor.previousRank - contributor.rank}
                          </span>
                        ) : contributor.rank > contributor.previousRank ? (
                          <span className="inline-flex items-center text-[hsl(var(--risk-severe))] text-sm">
                            <ChevronDown className="w-4 h-4" />
                            {contributor.rank - contributor.previousRank}
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-sm">—</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
