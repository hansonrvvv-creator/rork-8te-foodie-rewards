import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';

export interface CheckIn {
  restaurantId: string;
  timestamp: number;
  location: {
    latitude: number;
    longitude: number;
  };
}

const CHECK_IN_STORAGE_KEY = '@checkins';
const CHECK_IN_EXPIRY_MS = 24 * 60 * 60 * 1000;

export const [CheckInProvider, useCheckIns] = createContextHook(() => {
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    loadCheckIns();
  }, []);

  const loadCheckIns = async () => {
    try {
      const stored = await AsyncStorage.getItem(CHECK_IN_STORAGE_KEY);
      if (stored) {
        const parsed: CheckIn[] = JSON.parse(stored);
        const validCheckIns = parsed.filter(
          (ci) => Date.now() - ci.timestamp < CHECK_IN_EXPIRY_MS
        );
        setCheckIns(validCheckIns);
        
        if (validCheckIns.length !== parsed.length) {
          await AsyncStorage.setItem(CHECK_IN_STORAGE_KEY, JSON.stringify(validCheckIns));
        }
      }
    } catch (error) {
      console.error('Failed to load check-ins:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  const addCheckIn = useCallback(async (checkIn: CheckIn) => {
    try {
      const updated = [...checkIns, checkIn];
      setCheckIns(updated);
      await AsyncStorage.setItem(CHECK_IN_STORAGE_KEY, JSON.stringify(updated));
      console.log('Check-in saved:', checkIn);
    } catch (error) {
      console.error('Failed to save check-in:', error);
    }
  }, [checkIns]);

  const hasActiveCheckIn = useCallback((restaurantId: string): boolean => {
    const checkIn = checkIns.find((ci) => ci.restaurantId === restaurantId);
    if (!checkIn) return false;
    
    const isExpired = Date.now() - checkIn.timestamp > CHECK_IN_EXPIRY_MS;
    return !isExpired;
  }, [checkIns]);

  const getCheckIn = useCallback((restaurantId: string): CheckIn | undefined => {
    const checkIn = checkIns.find((ci) => ci.restaurantId === restaurantId);
    if (!checkIn) return undefined;
    
    const isExpired = Date.now() - checkIn.timestamp > CHECK_IN_EXPIRY_MS;
    return isExpired ? undefined : checkIn;
  }, [checkIns]);

  const clearCheckIns = useCallback(async () => {
    try {
      setCheckIns([]);
      await AsyncStorage.removeItem(CHECK_IN_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear check-ins:', error);
    }
  }, []);

  return useMemo(() => ({
    checkIns,
    isLoaded,
    addCheckIn,
    hasActiveCheckIn,
    getCheckIn,
    clearCheckIns,
  }), [checkIns, isLoaded, addCheckIn, hasActiveCheckIn, getCheckIn, clearCheckIns]);
});
