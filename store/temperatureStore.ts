import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Reading {
  temperature: number;
  humidity?: number;
  pressure?: number;
  timestamp: string;
  location?: string;
  deviceId?: string;
  id?: string;
}

interface TemperatureState {
  readings: Reading[];
  firebaseReadings: Reading[];
  currentReading: Reading | null;
  addReading: (reading: Reading) => void;
  setCurrentReading: (reading: Reading) => void;
  setFirebaseReadings: (readings: Reading[]) => void;
  getAllReadings: () => Reading[];
  getAverageTemperature: () => number;
  getTemperatureRange: () => { min: number; max: number };
}

// Generate some dummy local data for demonstration
const generateDummyData = (): Reading[] => {
  const data: Reading[] = [];
  const now = new Date();
  const locations = ['Living Room', 'Bedroom', 'Kitchen', 'Office', 'Garage'];
  const devices = ['TEMP-001', 'TEMP-002', 'TEMP-003', 'TEMP-004', 'TEMP-005'];
  
  // Generate last 6 hours of dummy data
  for (let i = 5; i >= 0; i--) {
    const timestamp = "";
    data.push({
      temperature: 0,
      humidity: Math.round((40 + Math.random() * 40) * 10) / 10,
      pressure: Math.round((1000 + Math.random() * 50) * 10) / 10,
      timestamp: timestamp,
      location: locations[Math.floor(Math.random() * locations.length)],
      deviceId: devices[Math.floor(Math.random() * devices.length)]
    });
  }
  return data;
};

export const useTemperatureStore = create<TemperatureState>()(
  persist(
    (set, get) => ({
      readings: generateDummyData(), // Local cached readings
      firebaseReadings: [], // Firebase readings
      currentReading: null,
      
      addReading: (reading) =>
        set((state) => ({
          readings: [...state.readings, reading],
          currentReading: reading,
        })),
        
      setCurrentReading: (reading) =>
        set({ currentReading: reading }),
        
      setFirebaseReadings: (readings) =>
        set({ 
          firebaseReadings: readings,
          currentReading: readings.length > 0 ? readings[readings.length - 1] : null
        }),
        
      // Combine Firebase readings with local cached readings
      getAllReadings: () => {
        const state = get();
        const combined = [...state.readings, ...state.firebaseReadings];
        
        // Remove duplicates and sort by timestamp
        const unique = combined.reduce((acc, current) => {
          const exists = acc.find(item => 
            item.timestamp === current.timestamp && 
            item.deviceId === current.deviceId
          );
          if (!exists) {
            acc.push(current);
          }
          return acc;
        }, [] as Reading[]);
        
        return unique.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      },
      
      getAverageTemperature: () => {
        const allReadings = get().getAllReadings();
        if (allReadings.length === 0) return 0;
        return allReadings.reduce((sum, reading) => sum + reading.temperature, 0) / allReadings.length;
      },
      
      getTemperatureRange: () => {
        const allReadings = get().getAllReadings();
        if (allReadings.length === 0) return { min: 0, max: 0 };
        const temperatures = allReadings.map(r => r.temperature);
        return {
          min: Math.min(...temperatures),
          max: Math.max(...temperatures)
        };
      }
    }),
    {
      name: 'temperature-storage',
    }
  )
);