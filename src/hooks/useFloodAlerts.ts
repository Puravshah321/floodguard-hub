import { useState, useEffect, useCallback } from 'react';
import { MeteostatDataPoint } from '@/lib/meteostat';
import { calculateFloodRisk } from '@/lib/floodRisk';
import { toast } from 'sonner';

export interface SavedLocation {
  id: string;
  name: string;
  lat: number;
  lon: number;
  notificationsEnabled: boolean;
}

const STORAGE_KEY = 'flood-alert-saved-locations';
const NOTIFIED_KEY = 'flood-alert-notified';

export function useFloodAlerts() {
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([]);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [notifiedLocations, setNotifiedLocations] = useState<Set<string>>(new Set());

  // Load saved locations from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSavedLocations(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse saved locations:', e);
      }
    }

    const notified = localStorage.getItem(NOTIFIED_KEY);
    if (notified) {
      try {
        setNotifiedLocations(new Set(JSON.parse(notified)));
      } catch (e) {
        console.error('Failed to parse notified locations:', e);
      }
    }

    // Check notification permission
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  // Save locations to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedLocations));
  }, [savedLocations]);

  // Save notified locations
  useEffect(() => {
    localStorage.setItem(NOTIFIED_KEY, JSON.stringify([...notifiedLocations]));
  }, [notifiedLocations]);

  // Request notification permission
  const requestNotificationPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      toast.error('Push notifications are not supported in this browser');
      return false;
    }

    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
    
    if (permission === 'granted') {
      toast.success('Notifications enabled! You will be alerted for extreme flood risks.');
      return true;
    } else {
      toast.error('Notification permission denied');
      return false;
    }
  }, []);

  // Add a saved location
  const addSavedLocation = useCallback((location: Omit<SavedLocation, 'id'>) => {
    const newLocation: SavedLocation = {
      ...location,
      id: `loc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    setSavedLocations(prev => [...prev, newLocation]);
    toast.success(`${location.name} added to your watched locations`);
    return newLocation;
  }, []);

  // Remove a saved location
  const removeSavedLocation = useCallback((id: string) => {
    setSavedLocations(prev => prev.filter(loc => loc.id !== id));
    toast.success('Location removed from watched list');
  }, []);

  // Toggle notifications for a location
  const toggleLocationNotifications = useCallback((id: string) => {
    setSavedLocations(prev => 
      prev.map(loc => 
        loc.id === id 
          ? { ...loc, notificationsEnabled: !loc.notificationsEnabled }
          : loc
      )
    );
  }, []);

  // Check for extreme risks and send notifications
  const checkExtremeRisks = useCallback((data: MeteostatDataPoint[]) => {
    if (notificationPermission !== 'granted') return;

    const today = new Date().toDateString();

    savedLocations.forEach(savedLoc => {
      if (!savedLoc.notificationsEnabled) return;

      // Find matching data point (within ~50km)
      const matchingPoint = data.find(point => {
        const latDiff = Math.abs(point.lat - savedLoc.lat);
        const lonDiff = Math.abs(point.lon - savedLoc.lon);
        return latDiff < 0.5 && lonDiff < 0.5;
      });

      if (!matchingPoint) return;

      const risk = calculateFloodRisk(matchingPoint.precipitation);
      const notificationKey = `${savedLoc.id}-${today}`;

      // Only notify for extreme or high risk, and only once per day per location
      if ((risk.level === 'extreme' || risk.level === 'high') && !notifiedLocations.has(notificationKey)) {
        // Send browser notification
        new Notification('⚠️ Flood Risk Alert', {
          body: `${risk.label} detected in ${savedLoc.name}! Precipitation: ${matchingPoint.precipitation.toFixed(1)}mm`,
          icon: '/favicon.ico',
          tag: notificationKey,
          requireInteraction: true,
        });

        // Also show toast
        toast.warning(`${risk.label} in ${savedLoc.name}`, {
          description: `Precipitation: ${matchingPoint.precipitation.toFixed(1)}mm - ${risk.description}`,
          duration: 10000,
        });

        // Mark as notified
        setNotifiedLocations(prev => new Set([...prev, notificationKey]));
      }
    });
  }, [savedLocations, notificationPermission, notifiedLocations]);

  // Check if a location is saved
  const isLocationSaved = useCallback((lat: number, lon: number) => {
    return savedLocations.some(loc => {
      const latDiff = Math.abs(loc.lat - lat);
      const lonDiff = Math.abs(loc.lon - lon);
      return latDiff < 0.01 && lonDiff < 0.01;
    });
  }, [savedLocations]);

  return {
    savedLocations,
    notificationPermission,
    requestNotificationPermission,
    addSavedLocation,
    removeSavedLocation,
    toggleLocationNotifications,
    checkExtremeRisks,
    isLocationSaved,
  };
}
