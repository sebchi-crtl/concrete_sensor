import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types matching your existing temperature_data table
export interface TemperatureData {
  id: number
  timestamp: string
  avg_temperature: number
  battery_level: number
  sensor_count: number
  network_time: string
}

// Extended interface for maturity calculations
export interface ReadingWithMaturity extends TemperatureData {
  maturity?: number
  location?: string
  device_id?: string
}

export interface MaturityCalculation {
  id?: number
  temperature: number
  timestamp: string
  maturity: number
  time_interval: number // in hours
  base_temperature: number // To = 10°C
}
