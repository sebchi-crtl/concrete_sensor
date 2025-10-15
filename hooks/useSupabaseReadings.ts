'use client'

import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { supabase, TemperatureData, ReadingWithMaturity } from '../lib/supabase';
import { calculateMaturity, calculateCumulativeMaturity } from '../lib/maturity';

export const useSupabaseReadings = () => {
  const [readings, setReadings] = useState<ReadingWithMaturity[]>([]);

  // Fetch readings from Supabase
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['supabase-readings'],
    queryFn: async () => {
      const { data: temperatureData, error } = await supabase
        .from('temperature_data')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100);

      if (error) {
        throw error;
      }

      return temperatureData || [];
    },
    refetchInterval: 5000, // Refetch every 5 seconds
  });

  // Real-time subscription for new readings
  useEffect(() => {
    const channel = supabase
      .channel('temperature-data-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'temperature_data'
        },
        (payload) => {
          console.log('Real-time update:', payload);
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  // Update local state when data changes
  useEffect(() => {
    if (data) {
      // Calculate maturity for each reading using avg_temperature
      const readingsWithMaturity: ReadingWithMaturity[] = data.map(reading => ({
        ...reading,
        maturity: calculateMaturity({
          temperature: reading.avg_temperature,
          timestamp: reading.timestamp,
          timeInterval: 0.5, // 0.5 hours as per formula
          baseTemperature: 10 // To = 10°C
        }).maturity,
        // Add default values for missing fields
        location: 'Site A', // You can customize this based on your needs
        device_id: `SENSOR-${reading.sensor_count}`
      }));
      
      setReadings(readingsWithMaturity);
    }
  }, [data]);

  // Calculate current maturity (cumulative)
  const currentMaturity = readings.length > 0 
    ? calculateCumulativeMaturity(
        readings.map(r => ({
          temperature: r.avg_temperature,
          timestamp: r.timestamp,
          timeInterval: 0.5,
          baseTemperature: 10
        }))
      )
    : 0;

  // Get latest reading
  const currentReading = readings[0] || null;

  // Calculate average temperature
  const averageTemperature = readings.length > 0
    ? readings.reduce((sum, r) => sum + r.avg_temperature, 0) / readings.length
    : 0;

  return {
    readings,
    currentReading,
    currentMaturity,
    averageTemperature,
    isLoading,
    error,
    refetch
  };
};
