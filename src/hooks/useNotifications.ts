import { useEffect, useCallback, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface Notification {
  id: string;
  type: 'contribution_approved' | 'medal_upgrade' | 'flood_alert' | 'general';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export function useNotifications() {
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  // Request notification permission
  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      setPermission('granted');
      return true;
    }

    if (Notification.permission !== 'denied') {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === 'granted';
    }

    return false;
  }, []);

  // Show browser notification
  const showBrowserNotification = useCallback((title: string, options?: NotificationOptions) => {
    if (permission === 'granted') {
      const notification = new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      return notification;
    }
  }, [permission]);

  // Add a notification
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      timestamp: new Date(),
      read: false,
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Show toast notification
    toast({
      title: notification.title,
      description: notification.message,
    });

    // Show browser notification if permitted
    showBrowserNotification(notification.title, {
      body: notification.message,
      tag: notification.type,
    });

    return newNotification;
  }, [toast, showBrowserNotification]);

  // Notify on contribution approval
  const notifyContributionApproved = useCallback((contributionId: string) => {
    addNotification({
      type: 'contribution_approved',
      title: 'Contribution Approved! 🎉',
      message: 'Your flood report has been verified and added to the database.',
    });
  }, [addNotification]);

  // Notify on medal upgrade
  const notifyMedalUpgrade = useCallback((newMedal: 'bronze' | 'silver' | 'gold' | 'elite') => {
    const medalEmojis = {
      bronze: '🥉',
      silver: '🥈',
      gold: '🥇',
      elite: '🏆',
    };

    const medalNames = {
      bronze: 'Bronze',
      silver: 'Silver',
      gold: 'Gold',
      elite: 'Elite',
    };

    addNotification({
      type: 'medal_upgrade',
      title: `New Medal: ${medalNames[newMedal]} ${medalEmojis[newMedal]}`,
      message: `Congratulations! You've been promoted to ${medalNames[newMedal]} contributor status!`,
    });
  }, [addNotification]);

  // Notify flood alert
  const notifyFloodAlert = useCallback((area: string, severity: 'low' | 'moderate' | 'high' | 'severe') => {
    addNotification({
      type: 'flood_alert',
      title: `⚠️ Flood Alert: ${area}`,
      message: `${severity.charAt(0).toUpperCase() + severity.slice(1)} flood risk detected in your area. Stay safe!`,
    });
  }, [addNotification]);

  // Mark notification as read
  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === notificationId ? { ...n, read: true } : n))
    );
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  // Clear all notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Get unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Initialize permission status on mount
  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  // Request permission when user logs in
  useEffect(() => {
    if (isAuthenticated) {
      requestPermission();
    }
  }, [isAuthenticated, requestPermission]);

  return {
    notifications,
    unreadCount,
    permission,
    requestPermission,
    addNotification,
    notifyContributionApproved,
    notifyMedalUpgrade,
    notifyFloodAlert,
    markAsRead,
    markAllAsRead,
    clearNotifications,
  };
}
