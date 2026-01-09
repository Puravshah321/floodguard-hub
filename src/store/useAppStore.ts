import { create } from 'zustand';
import type { Location, Alert, User, WeatherData, FloodPrediction } from '@/types';

interface AppState {
  // User state
  user: User | null;
  setUser: (user: User | null) => void;
  
  // Location state
  userLocation: Location | null;
  setUserLocation: (location: Location | null) => void;
  
  // Weather state
  weatherData: WeatherData | null;
  setWeatherData: (data: WeatherData | null) => void;
  isLoadingWeather: boolean;
  setIsLoadingWeather: (loading: boolean) => void;
  
  // Flood prediction
  floodPrediction: FloodPrediction | null;
  setFloodPrediction: (prediction: FloodPrediction | null) => void;
  
  // Alerts
  alerts: Alert[];
  addAlert: (alert: Alert) => void;
  markAlertRead: (id: string) => void;
  clearAlerts: () => void;
  
  // UI state
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  // User
  user: null,
  setUser: (user) => set({ user }),
  
  // Location
  userLocation: null,
  setUserLocation: (userLocation) => set({ userLocation }),
  
  // Weather
  weatherData: null,
  setWeatherData: (weatherData) => set({ weatherData }),
  isLoadingWeather: false,
  setIsLoadingWeather: (isLoadingWeather) => set({ isLoadingWeather }),
  
  // Flood prediction
  floodPrediction: null,
  setFloodPrediction: (floodPrediction) => set({ floodPrediction }),
  
  // Alerts
  alerts: [],
  addAlert: (alert) => set((state) => ({ alerts: [alert, ...state.alerts] })),
  markAlertRead: (id) => set((state) => ({
    alerts: state.alerts.map((a) => a.id === id ? { ...a, isRead: true } : a)
  })),
  clearAlerts: () => set({ alerts: [] }),
  
  // UI
  isSidebarOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));
