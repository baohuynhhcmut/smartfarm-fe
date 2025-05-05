import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { connect, disconnect, setLastMessage } from '../store/SocketSlice';
import socket from '../services/socket';

export const useSocket = () => {
  let connected = false;
  let lastMessage = null;
  let dispatch = null;

  try {
    dispatch = useDispatch();
    connected = useSelector((state: RootState) => state.socket.connected);
    lastMessage = useSelector((state: RootState) => state.socket.lastMessage);
  } catch (error) {
    console.error("Error in useSocket hook:", error);
  }
  
  const connectSocket = useCallback(() => {
    try {
      if (dispatch) {
        dispatch(connect());
      } else {
        // Fallback if dispatch is not available
        socket.connect();
      }
    } catch (error) {
      console.error("Error connecting socket:", error);
      // Fallback
      socket.connect();
    }
  }, [dispatch]);

  const disconnectSocket = useCallback(() => {
    try {
      if (dispatch) {
        dispatch(disconnect());
      } else {
        // Fallback if dispatch is not available
        socket.disconnect();
      }
    } catch (error) {
      console.error("Error disconnecting socket:", error);
      // Fallback
      socket.disconnect();
    }
  }, [dispatch]);

  const listenEvent = useCallback((eventName: string, callback: (data: any) => void) => {
    try {
      socket.on(eventName, (data: any) => {
        if (dispatch) {
          dispatch(setLastMessage({ event: eventName, data }));
        }
        callback(data);
      });
      
      return () => {
        socket.off(eventName);
      };
    } catch (error) {
      console.error(`Error listening to event ${eventName}:`, error);
      return () => {};
    }
  }, [dispatch]);

  const emitEvent = useCallback((eventName: string, data: any) => {
    try {
      if (connected) {
        socket.emit(eventName, data);
      } else {
        console.warn('Socket is not connected. Connecting now...');
        
        if (dispatch) {
          dispatch(connect());
        } else {
          socket.connect();
        }
        
        setTimeout(() => {
          socket.emit(eventName, data);
        }, 100);
      }
    } catch (error) {
      console.error(`Error emitting event ${eventName}:`, error);
      // Try direct socket connection as fallback
      socket.connect();
      setTimeout(() => {
        socket.emit(eventName, data);
      }, 100);
    }
  }, [connected, dispatch]);

  return {
    socket,
    connected: connected || false,
    lastMessage,
    connect: connectSocket,
    disconnect: disconnectSocket,
    listenEvent,
    emitEvent
  };
}; 