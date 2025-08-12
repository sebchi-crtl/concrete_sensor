'use client'

import { useTemperatureStore } from '../store/temperatureStore';
import { 
  Thermometer, 
  Droplets, 
  Gauge, 
  TrendingUp, 
  Activity,
  Calendar,
  MapPin,
  Zap,
  Database,
  Wifi
} from 'lucide-react';
import { format } from 'date-fns';
import { MetricCard } from './_components/MetricCard';
import { TemperatureCharts } from './_components/TemperatureCharts';
import { DeviceStatus } from './_components/DeviceStatus';
import { useQuery } from '@tanstack/react-query';
import { database } from '@/lib/firebase';
import { get, ref } from 'firebase/database';

export default function Home() {
  const { data: firebaseData, isLoading, error } = useQuery({
    queryKey: ['temperature'],
    queryFn: async () => {
      const readingsRef = ref(database, 'readings');
      const snapshot = await get(readingsRef);
      return snapshot.val();
    },
    refetchInterval: 5000, // Refetch every 5 seconds
  });
  
  const { 
    getAllReadings,
    currentReading, 
    getAverageTemperature, 
    getTemperatureRange,
    firebaseReadings
  } = useTemperatureStore();

  const allReadings = getAllReadings();
  const avgTemp = getAverageTemperature();
  const tempRange = getTemperatureRange();
  
  // Calculate trends
  const recentReadings = allReadings.slice(-5);
  const tempTrend = recentReadings.length > 1 
    ? recentReadings[recentReadings.length - 1].temperature - recentReadings[0].temperature
    : 0;

  // Get unique locations and devices
  const uniqueLocations = [...new Set(allReadings.map(r => r.location))];
  const uniqueDevices = [...new Set(allReadings.map(r => r.deviceId))];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading Firebase data...</p>
          <p className="text-sm text-gray-500">Connecting to database...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-red-800 mb-2">Firebase Connection Error</h2>
          <p className="text-red-600 mb-4">{error.message}</p>
          <div className="bg-red-100 border border-red-300 rounded-lg p-4 text-left">
            <p className="text-sm text-red-700 mb-2">Please check:</p>
            <ul className="text-xs text-red-600 space-y-1">
              <li>• Firebase configuration in .env.local</li>
              <li>• Database rules allow read access</li>
              <li>• "readings" collection exists in Firebase</li>
              <li>• Internet connection is stable</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Consor</h1>
              <p className="text-gray-600 mt-1">Real-time Firebase monitoring system</p>
              <div className="flex items-center mt-2 space-x-4">
                <div className="flex items-center text-sm text-green-600">
                  <Database size={16} className="mr-1" />
                  Firebase Connected
                </div>
                <div className="flex items-center text-sm text-blue-600">
                  <Wifi size={16} className="mr-1" />
                  {firebaseReadings.length} Firebase readings
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Last updated</p>
              <p className="text-lg font-semibold text-gray-900">
                {/* {currentReading ? format(new Date(currentReading.timestamp), 'HH:mm:ss') : '--:--:--'} */}
                HH:mm:ss
              </p>
              <p className="text-xs text-gray-500">
              HH:mm:ss
                {/* {currentReading ? format(new Date(currentReading.timestamp), 'MMM dd, yyyy') : 'No data'} */}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Current Temperature"
            value={currentReading?.temperature || 0}
            unit="°C"
            icon={Thermometer}
            trend={tempTrend > 0 ? 'up' : tempTrend < 0 ? 'down' : 'stable'}
            trendValue={`${Math.abs(tempTrend).toFixed(1)}°C`}
            color="blue"
          />
          <MetricCard
            title="Humidity"
            value={currentReading?.humidity || 0}
            unit="%"
            icon={Droplets}
            color="green"
          />
          <MetricCard
            title="Pressure"
            value={currentReading?.pressure || 0}
            unit="hPa"
            icon={Gauge}
            color="purple"
          />
          <MetricCard
            title="Average Temp"
            value={50}
            unit="°C"
            icon={TrendingUp}
            color="yellow"
          />
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <Database className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Firebase Readings</p>
                <p className="text-2xl font-bold text-gray-900">{firebaseReadings.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Readings</p>
                <p className="text-2xl font-bold text-gray-900">{allReadings.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <MapPin className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Locations</p>
                <p className="text-2xl font-bold text-gray-900">{uniqueLocations.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <Zap className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Range</p>
                <p className="text-2xl font-bold text-gray-900">
                  60-180°C
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Data Source Info */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Data Sources</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <Database className="h-6 w-6 text-blue-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Firebase Realtime Database</p>
                  <p className="text-sm text-gray-600">Live temperature readings</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-blue-600">{firebaseReadings.length}</p>
                <p className="text-xs text-gray-500">readings</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <Activity className="h-6 w-6 text-green-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Local Cache</p>
                  <p className="text-sm text-gray-600">Stored readings</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-600">{allReadings.length - firebaseReadings.length}</p>
                <p className="text-xs text-gray-500">cached</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="mb-8">
          <TemperatureCharts currentReading={firebaseData} />
        </div>

        {/* Device Status */}
        <DeviceStatus />
      </div>
    </div>
  );
}