import { useState, useEffect, useCallback } from 'react';
import { floodAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export interface Contribution {
  id: string | number;
  category: 'Flood' | 'Roads' | 'Landslide' | 'Safehouse' | 'Other';
  imageUrl: string;
  latitude: number;
  longitude: number;
  description: string;
  timestamp: string;
  status: 'pending' | 'approved' | 'rejected';
  userId?: string;
}

export interface ContributionStats {
  totalContributions: number;
  categoryCounts: Record<string, number>;
  contributionStreak: number;
  lastContributionDate: string | null;
  medal: 'Bronze' | 'Silver' | 'Gold' | 'Elite' | null;
  globalRank: number;
  monthlyContributions: number;
}

const MEDAL_THRESHOLDS = {
  Bronze: 1,
  Silver: 6,
  Gold: 16,
  Elite: 31,
};

function getMedal(count: number): ContributionStats['medal'] {
  if (count >= MEDAL_THRESHOLDS.Elite) return 'Elite';
  if (count >= MEDAL_THRESHOLDS.Gold) return 'Gold';
  if (count >= MEDAL_THRESHOLDS.Silver) return 'Silver';
  if (count >= MEDAL_THRESHOLDS.Bronze) return 'Bronze';
  return null;
}

export function useContributions() {
  const { user, isAuthenticated } = useAuth();
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [userContributions, setUserContributions] = useState<Contribution[]>([]);
  const [stats, setStats] = useState<ContributionStats>({
    totalContributions: 0,
    categoryCounts: {},
    contributionStreak: 0,
    lastContributionDate: null,
    medal: null,
    globalRank: 0,
    monthlyContributions: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContributions = useCallback(async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch all contributions from API
      const response = await floodAPI.getCrowdsourceList();
      const allContributions = Array.isArray(response) ? response : [];
      
      // Map API response to our Contribution type
      const mappedContributions: Contribution[] = allContributions.map((item: any) => ({
        id: item.id || Math.random().toString(36),
        category: item.category || 'Flood',
        imageUrl: item.image_url || item.imageUrl || '',
        latitude: item.latitude || 0,
        longitude: item.longitude || 0,
        description: item.description || '',
        timestamp: item.created_at || item.timestamp || new Date().toISOString(),
        status: item.status || 'pending',
        userId: item.user_id || item.userId,
      }));

      setContributions(mappedContributions);

      // Filter user's own contributions
      const userItems = mappedContributions.filter(
        (c) => c.userId === user?.id
      );
      setUserContributions(userItems);

      // Calculate stats
      const totalCount = userItems.length;
      const categoryCounts: Record<string, number> = {};
      userItems.forEach((c) => {
        categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
      });

      // Calculate streak (simplified)
      const sortedDates = userItems
        .map((c) => new Date(c.timestamp).toDateString())
        .filter((v, i, a) => a.indexOf(v) === i)
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

      let streak = 0;
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      
      if (sortedDates[0] === today || sortedDates[0] === yesterday) {
        streak = 1;
        for (let i = 1; i < sortedDates.length; i++) {
          const prevDate = new Date(sortedDates[i - 1]);
          const currDate = new Date(sortedDates[i]);
          const diffDays = Math.floor((prevDate.getTime() - currDate.getTime()) / 86400000);
          if (diffDays === 1) {
            streak++;
          } else {
            break;
          }
        }
      }

      // Monthly contributions
      const thisMonth = new Date().getMonth();
      const thisYear = new Date().getFullYear();
      const monthlyCount = userItems.filter((c) => {
        const d = new Date(c.timestamp);
        return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
      }).length;

      // Mock global rank (would come from API in real implementation)
      const globalRank = Math.max(1, Math.floor(100 - totalCount * 2 + Math.random() * 10));

      setStats({
        totalContributions: totalCount,
        categoryCounts,
        contributionStreak: streak,
        lastContributionDate: sortedDates[0] || null,
        medal: getMedal(totalCount),
        globalRank,
        monthlyContributions: monthlyCount,
      });
    } catch (err) {
      console.error('Failed to fetch contributions:', err);
      setError(err instanceof Error ? err.message : 'Failed to load contributions');
      
      // Set mock data for demo purposes
      const mockContributions: Contribution[] = [
        {
          id: '1',
          category: 'Flood',
          imageUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=400',
          latitude: 25.5941,
          longitude: 85.1376,
          description: 'Flooded street in residential area',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          status: 'approved',
          userId: user?.id,
        },
        {
          id: '2',
          category: 'Roads',
          imageUrl: 'https://images.unsplash.com/photo-1523633589114-88eaf4b4f1a8?w=400',
          latitude: 25.6093,
          longitude: 85.1236,
          description: 'Road damage due to waterlogging',
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          status: 'approved',
          userId: user?.id,
        },
        {
          id: '3',
          category: 'Safehouse',
          imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400',
          latitude: 25.5876,
          longitude: 85.1089,
          description: 'Community shelter available',
          timestamp: new Date(Date.now() - 259200000).toISOString(),
          status: 'approved',
          userId: user?.id,
        },
        {
          id: '4',
          category: 'Flood',
          imageUrl: 'https://images.unsplash.com/photo-1583245177184-4ab49f5a8f59?w=400',
          latitude: 25.6102,
          longitude: 85.1442,
          description: 'River overflow near bridge',
          timestamp: new Date(Date.now() - 345600000).toISOString(),
          status: 'pending',
          userId: user?.id,
        },
        {
          id: '5',
          category: 'Landslide',
          imageUrl: 'https://images.unsplash.com/photo-1601134467661-3d775b999c8b?w=400',
          latitude: 25.6234,
          longitude: 85.0987,
          description: 'Minor landslide on hill road',
          timestamp: new Date(Date.now() - 432000000).toISOString(),
          status: 'approved',
          userId: user?.id,
        },
      ];

      setUserContributions(mockContributions);
      setContributions(mockContributions);

      const categoryCounts: Record<string, number> = {};
      mockContributions.forEach((c) => {
        categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
      });

      setStats({
        totalContributions: mockContributions.length,
        categoryCounts,
        contributionStreak: 3,
        lastContributionDate: new Date().toISOString(),
        medal: getMedal(mockContributions.length),
        globalRank: 42,
        monthlyContributions: 3,
      });
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    fetchContributions();
  }, [fetchContributions]);

  return {
    contributions,
    userContributions,
    stats,
    isLoading,
    error,
    refetch: fetchContributions,
  };
}

export function getMedalInfo(medal: ContributionStats['medal']) {
  switch (medal) {
    case 'Bronze':
      return { emoji: '🥉', color: 'text-amber-600', bgColor: 'bg-amber-100', borderColor: 'border-amber-300' };
    case 'Silver':
      return { emoji: '🥈', color: 'text-slate-500', bgColor: 'bg-slate-100', borderColor: 'border-slate-300' };
    case 'Gold':
      return { emoji: '🥇', color: 'text-yellow-600', bgColor: 'bg-yellow-100', borderColor: 'border-yellow-300' };
    case 'Elite':
      return { emoji: '🏆', color: 'text-purple-600', bgColor: 'bg-purple-100', borderColor: 'border-purple-300' };
    default:
      return { emoji: '⭐', color: 'text-muted-foreground', bgColor: 'bg-muted', borderColor: 'border-border' };
  }
}
