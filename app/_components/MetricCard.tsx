import { DivideIcon as LucideIcon } from 'lucide-react';

interface MetricCardProps {
    title: string;
    value: string | number;
    unit?: string;
    icon: typeof LucideIcon;
    trend?: 'up' | 'down' | 'stable';
    trendValue?: string;
    color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  }
  
  const colorClasses = {
    blue: 'bg-blue-500 text-blue-100',
    green: 'bg-green-500 text-green-100',
    yellow: 'bg-yellow-500 text-yellow-100',
    red: 'bg-red-500 text-red-100',
    purple: 'bg-purple-500 text-purple-100',
  };
  
  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    stable: 'text-gray-600',
  };
  
  export const MetricCard: React.FC<MetricCardProps> = ({ 
    title, 
    value, 
    unit, 
    icon: Icon, 
    trend, 
    trendValue, 
    color = 'blue' 
  }) => {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <div className="flex items-baseline">
              <p className="text-3xl font-bold text-gray-900">
                {typeof value === 'number' ? value.toFixed(1) : value}
              </p>
              {unit && <span className="ml-1 text-lg text-gray-500">{unit}</span>}
            </div>
            {trend && trendValue && (
              <div className={`flex items-center mt-2 text-sm ${trendColors[trend]}`}>
                <span>{trendValue}</span>
                <span className="ml-1">
                  {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'}
                </span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-full ${colorClasses[color]}`}>
            <Icon size={24} />
          </div>
        </div>
      </div>
    );
  };