/**
 * Maturity calculation based on the formula: Maturity M = Σ (Ta - To) Δt
 * Where:
 * - To = 10°C (base temperature)
 * - Ta = Average Temperature
 * - Δt = time interval (0.5 hours)
 */

export interface MaturityData {
  temperature: number
  timestamp: string
  timeInterval: number // in hours
  baseTemperature: number // To = 10°C
}

export interface MaturityResult {
  maturity: number
  temperature: number
  timestamp: string
  timeInterval: number
  baseTemperature: number
}

/**
 * Calculate maturity for a single reading
 */
export function calculateMaturity(data: MaturityData): MaturityResult {
  const { temperature, timestamp, timeInterval = 0.5, baseTemperature = 10 } = data
  
  // Maturity M = (Ta - To) * Δt
  const maturity = (temperature - baseTemperature) * timeInterval
  
  return {
    maturity,
    temperature,
    timestamp,
    timeInterval,
    baseTemperature
  }
}

/**
 * Calculate cumulative maturity from multiple readings
 */
export function calculateCumulativeMaturity(readings: MaturityData[]): number {
  return readings.reduce((total, reading) => {
    const result = calculateMaturity(reading)
    return total + result.maturity
  }, 0)
}

/**
 * Calculate maturity with different time intervals
 */
export function calculateMaturityWithInterval(
  temperature: number, 
  timeIntervalHours: number = 0.5, 
  baseTemperature: number = 10
): number {
  return (temperature - baseTemperature) * timeIntervalHours
}

/**
 * Get maturity status based on value
 */
export function getMaturityStatus(maturity: number): {
  status: 'low' | 'moderate' | 'high' | 'critical'
  color: string
  description: string
} {
  if (maturity < 50) {
    return {
      status: 'low',
      color: 'blue',
      description: 'Low maturity - early stage'
    }
  } else if (maturity < 100) {
    return {
      status: 'moderate',
      color: 'yellow',
      description: 'Moderate maturity - developing'
    }
  } else if (maturity < 200) {
    return {
      status: 'high',
      color: 'orange',
      description: 'High maturity - advanced stage'
    }
  } else {
    return {
      status: 'critical',
      color: 'red',
      description: 'Critical maturity - final stage'
    }
  }
}
