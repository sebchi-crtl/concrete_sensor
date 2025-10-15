import { calculateMaturity, calculateCumulativeMaturity, getMaturityStatus } from '../maturity';

describe('Maturity Calculations', () => {
  describe('calculateMaturity', () => {
    it('should calculate maturity correctly for a single reading', () => {
      const data = {
        temperature: 25, // 25°C
        timestamp: '2024-01-01T10:00:00Z',
        timeInterval: 0.5, // 0.5 hours
        baseTemperature: 10 // To = 10°C
      };

      const result = calculateMaturity(data);
      
      // Expected: (25 - 10) * 0.5 = 15 * 0.5 = 7.5
      expect(result.maturity).toBe(7.5);
      expect(result.temperature).toBe(25);
      expect(result.timeInterval).toBe(0.5);
      expect(result.baseTemperature).toBe(10);
    });

    it('should handle negative maturity when temperature is below base', () => {
      const data = {
        temperature: 5, // 5°C (below base temperature of 10°C)
        timestamp: '2024-01-01T10:00:00Z',
        timeInterval: 0.5,
        baseTemperature: 10
      };

      const result = calculateMaturity(data);
      
      // Expected: (5 - 10) * 0.5 = -5 * 0.5 = -2.5
      expect(result.maturity).toBe(-2.5);
    });

    it('should use default values when not provided', () => {
      const data = {
        temperature: 20,
        timestamp: '2024-01-01T10:00:00Z'
      };

      const result = calculateMaturity(data);
      
      // Should use defaults: timeInterval = 0.5, baseTemperature = 10
      // Expected: (20 - 10) * 0.5 = 10 * 0.5 = 5
      expect(result.maturity).toBe(5);
      expect(result.timeInterval).toBe(0.5);
      expect(result.baseTemperature).toBe(10);
    });
  });

  describe('calculateCumulativeMaturity', () => {
    it('should calculate cumulative maturity from multiple readings', () => {
      const readings = [
        {
          temperature: 20,
          timestamp: '2024-01-01T10:00:00Z',
          timeInterval: 0.5,
          baseTemperature: 10
        },
        {
          temperature: 25,
          timestamp: '2024-01-01T10:30:00Z',
          timeInterval: 0.5,
          baseTemperature: 10
        },
        {
          temperature: 30,
          timestamp: '2024-01-01T11:00:00Z',
          timeInterval: 0.5,
          baseTemperature: 10
        }
      ];

      const result = calculateCumulativeMaturity(readings);
      
      // Expected: (20-10)*0.5 + (25-10)*0.5 + (30-10)*0.5 = 5 + 7.5 + 10 = 22.5
      expect(result).toBe(22.5);
    });

    it('should return 0 for empty readings array', () => {
      const result = calculateCumulativeMaturity([]);
      expect(result).toBe(0);
    });
  });

  describe('getMaturityStatus', () => {
    it('should return low status for low maturity', () => {
      const status = getMaturityStatus(25);
      expect(status.status).toBe('low');
      expect(status.color).toBe('blue');
      expect(status.description).toBe('Low maturity - early stage');
    });

    it('should return moderate status for moderate maturity', () => {
      const status = getMaturityStatus(75);
      expect(status.status).toBe('moderate');
      expect(status.color).toBe('yellow');
      expect(status.description).toBe('Moderate maturity - developing');
    });

    it('should return high status for high maturity', () => {
      const status = getMaturityStatus(150);
      expect(status.status).toBe('high');
      expect(status.color).toBe('orange');
      expect(status.description).toBe('High maturity - advanced stage');
    });

    it('should return critical status for very high maturity', () => {
      const status = getMaturityStatus(250);
      expect(status.status).toBe('critical');
      expect(status.color).toBe('red');
      expect(status.description).toBe('Critical maturity - final stage');
    });
  });
});
