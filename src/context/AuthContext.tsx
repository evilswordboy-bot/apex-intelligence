"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserProfile,
  UserProfileUpdate,
  UserFavoriteItem,
  AddFavoriteRequest,
  DashboardPreferences,
  DashboardPreferencesUpdate
} from '@/types/auth';
import {
  getCurrentUser,
  getUserProfile,
  getUserFavorites,
  getDashboardPreferences,
  loginUser,
  registerUser,
  logoutUser,
  updateUserProfile,
  addUserFavorite,
  removeUserFavorite,
  updateDashboardPreferences
} from '@/lib/authApi';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  favorites: UserFavoriteItem[];
  dashboardPrefs: DashboardPreferences | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, name: string, sport?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (update: UserProfileUpdate) => Promise<void>;
  toggleFavorite: (item: AddFavoriteRequest) => Promise<boolean>;
  isFavorited: (itemType: string, itemId: string) => boolean;
  updateDashboardPrefs: (update: DashboardPreferencesUpdate) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [favorites, setFavorites] = useState<UserFavoriteItem[]>([]);
  const [dashboardPrefs, setDashboardPrefs] = useState<DashboardPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      if (currentUser) {
        const [prof, favs, prefs] = await Promise.all([
          getUserProfile(),
          getUserFavorites(),
          getDashboardPreferences()
        ]);
        setProfile(prof);
        setFavorites(favs);
        setDashboardPrefs(prefs);
      } else {
        setProfile(null);
        setFavorites([]);
        setDashboardPrefs(null);
      }
    } catch (err) {
      console.warn('[AuthContext] Session restore failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, pass: string) => {
    await loginUser(email, pass);
    await refreshUser();
  };

  const register = async (email: string, pass: string, name: string, sport?: string) => {
    await registerUser(email, pass, name, sport);
    await refreshUser();
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
    setProfile(null);
    setFavorites([]);
    setDashboardPrefs(null);
  };

  const handleUpdateProfile = async (update: UserProfileUpdate) => {
    const updated = await updateUserProfile(update);
    setProfile(updated);
    if (update.display_name && user) {
      setUser({ ...user, display_name: update.display_name });
    }
  };

  const toggleFavorite = async (item: AddFavoriteRequest): Promise<boolean> => {
    const existing = favorites.find(
      (f) => f.item_type === item.item_type && f.item_id === item.item_id
    );
    if (existing) {
      await removeUserFavorite(existing.id);
      setFavorites((prev) => prev.filter((f) => f.id !== existing.id));
      return false;
    } else {
      const added = await addUserFavorite(item);
      setFavorites((prev) => [added, ...prev]);
      return true;
    }
  };

  const isFavorited = (itemType: string, itemId: string): boolean => {
    return favorites.some((f) => f.item_type === itemType && f.item_id === itemId);
  };

  const handleUpdateDashboardPrefs = async (update: DashboardPreferencesUpdate) => {
    const updated = await updateDashboardPreferences(update);
    setDashboardPrefs(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        favorites,
        dashboardPrefs,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        updateProfile: handleUpdateProfile,
        toggleFavorite,
        isFavorited,
        updateDashboardPrefs: handleUpdateDashboardPrefs,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
