'use client'

import { useEffect } from 'react';
import { LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { useTemperatureStore } from '../../store/temperatureStore';


export const TemperatureCharts = ({ currentReading }: { currentReading: { avg_temperature: number; timestamp: string } | null }) => {
  const { readings, addReading } = useTemperatureStore();
  
  const temperature = currentReading ? Math.min(Math.max(currentReading.avg_temperature, 0), 100) : 0; // Clamp between 0 and 100

  useEffect(() => {
    if (currentReading) {
      addReading({
        temperature: currentReading.avg_temperature,
        timestamp: currentReading.timestamp
      });
    }
  }, [currentReading, addReading]);

  const pieData = [
    { name: 'Temperature', value: temperature },
    { name: 'Remaining', value: 100 - temperature } 
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="p-4  text-black  bg-white rounded-lg shadow">
      <h3 className="text-lg text-black font-semibold mb-4">Current Temperature Gauge</h3>
      <PieChart width={400} height={200}>
        <Pie
          data={pieData}
          cx="60%" // Center the chart
          cy="100%" // Center it on the bottom of the container
          startAngle={180} // Start the arc at 180 degrees
          endAngle={0} // End the arc at 0 degrees
          innerRadius={70} // Make the gauge a bit thicker
          outerRadius={90} // Outer boundary of the gauge
          fill="#8884d8"
          dataKey="value"
        >
          {/* Color the gauge based on the temperature value */}
          <Cell key="cell1" fill="#00C49F" />
          <Cell key="cell2" fill="#E0E0E0" />
        </Pie>
        <Tooltip />
      </PieChart>
      </div>
      <div className="p-4 bg-white text-black  rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Temperature History</h3>
        <LineChart width={400} height={400} data={readings}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="temperature" stroke="#8884d8" />
        </LineChart>
      </div>
    </div>
  );
};