import { Wifi, WifiOff, Battery, AlertTriangle } from 'lucide-react';

interface Device {
    id: string;
    name: string;
    location: string;
    status: 'online' | 'offline' | 'warning';
    battery: number;
    lastSeen: string;
    temperature: number;
  }
  
  const devices: Device[] = [
    {
      id: 'TEMP-001',
      name: 'Living Room Sensor',
      location: 'Living Room',
      status: 'online',
      battery: 85,
      lastSeen: '2 min ago',
      temperature: 23.5
    },
    {
      id: 'TEMP-002',
      name: 'Bedroom Sensor',
      location: 'Bedroom',
      status: 'online',
      battery: 92,
      lastSeen: '1 min ago',
      temperature: 21.8
    },
    {
      id: 'TEMP-003',
      name: 'Kitchen Sensor',
      location: 'Kitchen',
      status: 'warning',
      battery: 15,
      lastSeen: '5 min ago',
      temperature: 26.2
    },
    {
      id: 'TEMP-004',
      name: 'Office Sensor',
      location: 'Office',
      status: 'online',
      battery: 78,
      lastSeen: '3 min ago',
      temperature: 22.1
    },
    {
      id: 'TEMP-005',
      name: 'Garage Sensor',
      location: 'Garage',
      status: 'offline',
      battery: 0,
      lastSeen: '2 hours ago',
      temperature: 18.5
    }
  ];
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-600 bg-green-100';
      case 'offline': return 'text-red-600 bg-red-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <Wifi size={16} />;
      case 'offline': return <WifiOff size={16} />;
      case 'warning': return <AlertTriangle size={16} />;
      default: return <WifiOff size={16} />;
    }
  };
  
  export const DeviceStatus: React.FC = () => {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Device Status</h3>
        <div className="space-y-4">
          {devices.map((device) => (
            <div key={device.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-full ${getStatusColor(device.status)}`}>
                  {getStatusIcon(device.status)}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{device.name}</h4>
                  <p className="text-sm text-gray-600">{device.location}</p>
                  <p className="text-xs text-gray-500">Last seen: {device.lastSeen}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2 mb-1">
                  <Battery size={16} className="text-gray-400" />
                  <span className="text-sm font-medium">{device.battery}%</span>
                </div>
                <p className="text-lg font-bold text-gray-900">{device.temperature}°C</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };