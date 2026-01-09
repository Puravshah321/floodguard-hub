import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI, tokenManager } from '@/lib/api';
import type { User, Location } from '@/types';

interface ProfileResponse {
  id?: string;
  email: string;
  name?: string;
  is_admin?: boolean;
  location?: Location;
}

interface AuthUser extends User {
  token?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateLocation: (location: Location) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = tokenManager.getAccessToken();
      if (token) {
        try {
          const profile = await authAPI.getProfile() as ProfileResponse;
          setUser({
            id: profile.id || 'user-1',
            email: profile.email,
            name: profile.name || profile.email.split('@')[0],
            role: profile.is_admin ? 'admin' : 'user',
            location: profile.location,
          });
        } catch (error) {
          console.error('Auth check failed:', error);
          tokenManager.clearTokens();
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authAPI.login(email, password);
      setUser({
        id: response.user?.id || 'user-1',
        email: response.user?.email || email,
        name: response.user?.name || email.split('@')[0],
        role: response.user?.is_admin ? 'admin' : 'user',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      await authAPI.register(email, password, name);
      // Auto-login after registration
      await login(email, password);
    } finally {
      setIsLoading(false);
    }
  }, [login]);

  const logout = useCallback(() => {
    authAPI.logout();
    setUser(null);
  }, []);

  const updateLocation = useCallback((location: Location) => {
    setUser(prev => prev ? { ...prev, location } : null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateLocation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
