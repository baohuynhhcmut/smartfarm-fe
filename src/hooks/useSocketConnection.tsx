import { useEffect, useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import socket, { connectSocket, disconnectSocket, isSocketConnected } from '../services/socket';

/**
 * Hook để quản lý kết nối socket trong toàn app
 * @returns Các hàm và trạng thái cần thiết để quản lý socket
 */
export const useSocketConnection = () => {
  const { state, dispatch } = useAppContext();
  const isConnected = state.socket.connected;

  // Kết nối tới socket
  const connect = useCallback(() => {
    console.log('Connecting socket from hook...');
    connectSocket();
    dispatch({ type: 'SOCKET_CONNECT' });
  }, [dispatch]);

  // Ngắt kết nối socket
  const disconnect = useCallback(() => {
    console.log('Disconnecting socket from hook...');
    disconnectSocket();
    dispatch({ type: 'SOCKET_DISCONNECT' });
  }, [dispatch]);

  // Gửi yêu cầu tới socket
  const emit = useCallback((event: string, data: any, callback?: Function) => {
    console.log(`Emitting event: ${event}`, data);
    if (!isSocketConnected()) {
      connectSocket();
      
      // Đợi kết nối trước khi gửi sự kiện
      socket.once('connect', () => {
        socket.emit(event, data, callback);
      });
    } else {
      socket.emit(event, data, callback);
    }
  }, []);

  // Thiết lập một socket listener mới
  const addListener = useCallback((event: string, listener: (data: any) => void) => {
    socket.on(event, listener);
    return () => {
      socket.off(event, listener);
    };
  }, []);

  // Tự động kết nối socket khi component sử dụng hook được mount
  useEffect(() => {
    if (!isConnected) {
      connect();
    }

    return () => {
      // Không ngắt kết nối khi component unmount vì socket là toàn cục
      // disconnect(); 
    };
  }, [connect, isConnected]);

  return {
    isConnected,
    connect,
    disconnect,
    emit,
    addListener,
    socket,
  };
};

export default useSocketConnection; 