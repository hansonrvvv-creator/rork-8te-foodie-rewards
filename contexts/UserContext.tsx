import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { TierLevel } from '@/mocks/tiers';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  tier: TierLevel;
  points: number;
  totalCheckins: number;
  totalReviews: number;
  memberSince: string;
  friendIds: string[];
}

const USER_STORAGE_KEY = '@user_data';

const DEFAULT_USER: User = {
  id: 'current',
  name: '',
  email: '',
  phone: '',
  avatar: 'https://i.pravatar.cc/150?img=68',
  tier: 'bronze',
  points: 0,
  totalCheckins: 0,
  totalReviews: 0,
  memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
  friendIds: [],
};

export const [UserProvider, useUser] = createContextHook(() => {
  const [user, setUser] = useState<User>(DEFAULT_USER);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const stored = await AsyncStorage.getItem(USER_STORAGE_KEY);
      if (stored) {
        const parsed: User = JSON.parse(stored);
        setUser(parsed);
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  const updateUser = useCallback(async (updates: Partial<User>) => {
    try {
      const updated = { ...user, ...updates };
      setUser(updated);
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated));
      console.log('User data updated:', updated);
    } catch (error) {
      console.error('Failed to update user data:', error);
      throw error;
    }
  }, [user]);

  const addPoints = useCallback(async (points: number) => {
    await updateUser({ 
      points: user.points + points,
      totalCheckins: user.totalCheckins + 1 
    });
  }, [user, updateUser]);

  const addReview = useCallback(async () => {
    await updateUser({ totalReviews: user.totalReviews + 1 });
  }, [user, updateUser]);

  const clearUser = useCallback(async () => {
    try {
      setUser(DEFAULT_USER);
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear user data:', error);
    }
  }, []);

  return useMemo(() => ({
    user,
    isLoaded,
    updateUser,
    addPoints,
    addReview,
    clearUser,
  }), [user, isLoaded, updateUser, addPoints, addReview, clearUser]);
});
