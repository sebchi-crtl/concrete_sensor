'use client'

import { useQuery } from '@tanstack/react-query';
import { ref, get, onValue, off } from 'firebase/database';
import { database } from '../lib/firebase';
import { useEffect } from 'react';
import { useTemperatureStore } from '../store/temperatureStore';

interface FirebaseReading {
  temperature: number;
  timestamp: string;
  humidity?: number;
  pressure?: number;
  location?: string;
  deviceId?: string;
}

export const useFirebaseReadings = () => {
  const { addReading, setFirebaseReadings } = useTemperatureStore();

  // Initial fetch of readings
  const { data, isLoading, error } = useQuery({
    queryKey: ['firebase-readings'],
    queryFn: async () => {
      const readingsRef = ref(database, 'readings');
      const snapshot = await get(readingsRef);
      const data = snapshot.val();
      
      if (data) {
        // Convert Firebase object to array
        const readingsArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key],
          // Ensure required fields have defaults
          humidity: data[key].humidity || Math.round((40 + Math.random() * 40) * 10) / 10,
          pressure: data[key].pressure || Math.round((1000 + Math.random() * 50) * 10) / 10,
          location: data[key].location || 'Unknown',
          deviceId: data[key].deviceId || 'TEMP-001'
        }));
        
        // Sort by timestamp
        readingsArray.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        
        return readingsArray;
      }
      return [];
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Real-time listener for new readings
  useEffect(() => {
    const readingsRef = ref(database, 'readings');
    
    const unsubscribe = onValue(readingsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const readingsArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key],
          humidity: data[key].humidity || Math.round((40 + Math.random() * 40) * 10) / 10,
          pressure: data[key].pressure || Math.round((1000 + Math.random() * 50) * 10) / 10,
          location: data[key].location || 'Unknown',
          deviceId: data[key].deviceId || 'TEMP-001'
        }));
        
        readingsArray.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        setFirebaseReadings(readingsArray);
      }
    });

    return () => off(readingsRef, 'value', unsubscribe);
  }, [setFirebaseReadings]);

  // Update store when data changes
  useEffect(() => {
    if (data && data.length > 0) {
      setFirebaseReadings(data);
    }
  }, [data, setFirebaseReadings]);

  return { data, isLoading, error };
};