import React from 'react';
import { useAppContext } from '../context/AppContext';
import useSocketConnection from '../hooks/useSocketConnection';

interface SocketStatusProps {
  showControls?: boolean;
}

/**
 * Component hiển thị trạng thái kết nối socket
 */
const SocketStatus: React.FC<SocketStatusProps> = ({ showControls = false }) => {
  const { state } = useAppContext();
  const { isConnected, connect, disconnect } = useSocketConnection();

  return (
    <div className="socket-status">
      <div className="flex items-center gap-2">
        <div 
          className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} 
          title={isConnected ? 'Đã kết nối' : 'Mất kết nối'}
        />
        <span>{isConnected ? 'Đã kết nối máy chủ' : 'Mất kết nối máy chủ'}</span>
      </div>
      
      {showControls && (
        <div className="socket-controls mt-2">
          <button 
            onClick={connect}
            disabled={isConnected}
            className={`px-3 py-1 mr-2 rounded text-sm ${isConnected ? 'bg-gray-200 cursor-not-allowed' : 'bg-green-500 text-white'}`}
          >
            Kết nối
          </button>
          <button 
            onClick={disconnect}
            disabled={!isConnected}
            className={`px-3 py-1 rounded text-sm ${!isConnected ? 'bg-gray-200 cursor-not-allowed' : 'bg-red-500 text-white'}`}
          >
            Ngắt kết nối
          </button>
        </div>
      )}
    </div>
  );
};

export default SocketStatus; 