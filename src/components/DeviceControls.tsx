import React from 'react';
import { useDeviceControl } from '../hooks/useDeviceControl';

const DeviceControls: React.FC = () => {
  // Sử dụng hook DeviceControl thay cho Redux
  const { togglePump, toggleLed, pumpState, ledState, isConnected } = useDeviceControl();
  
  return (
    <div className="device-controls">
      <h3 className="text-xl font-bold mb-4">Điều khiển thiết bị</h3>
      
      <div className="flex gap-4">
        <div className="device-card p-4 border rounded-lg shadow-sm">
          <h4 className="font-semibold">Máy bơm nước</h4>
          <p className="status mb-2">
            Trạng thái: <span className={`font-bold ${pumpState === 1 ? 'text-green-500' : 'text-gray-500'}`}>
              {pumpState === 1 ? 'BẬT' : 'TẮT'}
            </span>
          </p>
          <button 
            onClick={togglePump}
            disabled={!isConnected}
            className={`px-4 py-2 rounded-md ${
              pumpState === 1 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-green-500 hover:bg-green-600'
            } text-white transition-colors ${!isConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {pumpState === 1 ? 'Tắt bơm' : 'Bật bơm'}
          </button>
        </div>
        
        <div className="device-card p-4 border rounded-lg shadow-sm">
          <h4 className="font-semibold">Đèn LED</h4>
          <p className="status mb-2">
            Trạng thái: <span className={`font-bold ${ledState === 1 ? 'text-green-500' : 'text-gray-500'}`}>
              {ledState === 1 ? 'BẬT' : 'TẮT'}
            </span>
          </p>
          <button 
            onClick={toggleLed}
            disabled={!isConnected}
            className={`px-4 py-2 rounded-md ${
              ledState === 1 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-green-500 hover:bg-green-600'
            } text-white transition-colors ${!isConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {ledState === 1 ? 'Tắt đèn' : 'Bật đèn'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeviceControls; 