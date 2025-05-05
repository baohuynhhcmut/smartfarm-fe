import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import socket from '../services/socket';

// Định nghĩa kiểu dữ liệu cho state
interface SensorData {
  value: number;
  device_id?: string;
  device_name?: string;
  feed?: string;
  type?: string;
  category?: string;
  location?: string;
  user?: string;
  timestamp?: string;
}

// Garden interface
export interface Garden {
  _id: string;
  name: string;
  latitude: number;
  longitude: number;
}

// Device interface
export interface Device {
  _id: string;
  device_id: string;
  device_name: string;
  feed: string;
  type: string;
  category: string;
  location: {
    garden_name: string;
    latitude: number;
    longitude: number;
  };
  threshold: {
    min: number;
    max: number;
  };
  mode: string;
  status: string;
  user: string;
  time_on: string | null;
  time_off: string | null;
  is_active: boolean;
}

// State tổng thể của ứng dụng
interface AppState {
  socket: {
    connected: boolean;
    lastMessage: any;
  };
  sensorData: {
    temperature: SensorData | null;
    humidity: SensorData | null;
    light: SensorData | null;
    soilMoisture: SensorData | null;
    pump: SensorData | null;
    led: SensorData | null;
  };
  user: {
    user: any;
    gardens: Garden[];
    selectedGarden: Garden | null;
    devices: Device[];
    isLoadingDevices: boolean;
  };
}

// Các loại action cho reducer
type AppAction =
  | { type: 'SOCKET_CONNECT' }
  | { type: 'SOCKET_DISCONNECT' }
  | { type: 'SET_LAST_MESSAGE', payload: any }
  | { type: 'SET_TEMPERATURE_DATA', payload: SensorData }
  | { type: 'SET_HUMIDITY_DATA', payload: SensorData }
  | { type: 'SET_LIGHT_DATA', payload: SensorData }
  | { type: 'SET_SOIL_MOISTURE_DATA', payload: SensorData }
  | { type: 'SET_PUMP_DATA', payload: SensorData }
  | { type: 'SET_LED_DATA', payload: SensorData }
  | { type: 'SET_USER', payload: any }
  | { type: 'SET_GARDENS', payload: Garden[] }
  | { type: 'SET_SELECTED_GARDEN', payload: Garden | null }
  | { type: 'SET_DEVICES', payload: Device[] }
  | { type: 'SET_LOADING_DEVICES', payload: boolean };

// Khởi tạo state mặc định
const initialState: AppState = {
  socket: {
    connected: false,
    lastMessage: null,
  },
  sensorData: {
    temperature: null,
    humidity: null,
    light: null,
    soilMoisture: null,
    pump: null,
    led: null,
  },
  user: {
    user: null,
    gardens: [],
    selectedGarden: null,
    devices: [],
    isLoadingDevices: false,
  },
};

// Reducer để xử lý các actions
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SOCKET_CONNECT':
      if (!state.socket.connected) {
        socket.connect();
        console.log('Socket connection initiated via reducer');
      }
      return {
        ...state,
        socket: {
          ...state.socket,
          connected: true,
        },
      };
    case 'SOCKET_DISCONNECT':
      if (state.socket.connected) {
        socket.disconnect();
        console.log('Socket disconnected via reducer');
      }
      return {
        ...state,
        socket: {
          ...state.socket,
          connected: false,
        },
      };
    case 'SET_LAST_MESSAGE':
      return {
        ...state,
        socket: {
          ...state.socket,
          lastMessage: action.payload,
        },
      };
    case 'SET_TEMPERATURE_DATA':
      console.log('Context - Temperature data updated:', action.payload);
      return {
        ...state,
        sensorData: {
          ...state.sensorData,
          temperature: action.payload,
        },
      };
    case 'SET_HUMIDITY_DATA':
      console.log('Context - Humidity data updated:', action.payload);
      return {
        ...state,
        sensorData: {
          ...state.sensorData,
          humidity: action.payload,
        },
      };
    case 'SET_LIGHT_DATA':
      console.log('Context - Light data updated:', action.payload);
      return {
        ...state,
        sensorData: {
          ...state.sensorData,
          light: action.payload,
        },
      };
    case 'SET_SOIL_MOISTURE_DATA':
      console.log('Context - Soil moisture data updated:', action.payload);
      return {
        ...state,
        sensorData: {
          ...state.sensorData,
          soilMoisture: action.payload,
        },
      };
    case 'SET_PUMP_DATA':
      console.log('Context - Pump data updated:', action.payload);
      return {
        ...state,
        sensorData: {
          ...state.sensorData,
          pump: action.payload,
        },
      };
    case 'SET_LED_DATA':
      console.log('Context - LED data updated:', action.payload);
      return {
        ...state,
        sensorData: {
          ...state.sensorData,
          led: action.payload,
        },
      };
    case 'SET_USER':
      console.log('Context - User data updated:', action.payload);
      return {
        ...state,
        user: {
          ...state.user,
          user: action.payload,
          gardens: action.payload?.gardens || [],
        },
      };
    case 'SET_GARDENS':
      return {
        ...state,
        user: {
          ...state.user,
          gardens: action.payload,
        },
      };
    case 'SET_SELECTED_GARDEN':
      return {
        ...state,
        user: {
          ...state.user,
          selectedGarden: action.payload,
        },
      };
    case 'SET_DEVICES':
      return {
        ...state,
        user: {
          ...state.user,
          devices: action.payload,
        },
      };
    case 'SET_LOADING_DEVICES':
      return {
        ...state,
        user: {
          ...state.user,
          isLoadingDevices: action.payload,
        },
      };
    default:
      return state;
  }
}

// Tạo context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

// Hook tùy chỉnh để sử dụng context
export const useAppContext = () => useContext(AppContext);

// Provider component
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Thiết lập các socket event listener và kết nối
  useEffect(() => {
    console.log('Setting up socket connection in AppProvider...');
    
    // Kết nối socket ngay khi component được mount
    socket.connect();
    
    // Setup connect/disconnect listeners
    socket.on('connect', () => {
      console.log('Socket connected successfully');
      dispatch({ type: 'SOCKET_CONNECT' });
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      dispatch({ type: 'SOCKET_DISCONNECT' });
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    // Lắng nghe các dữ liệu cảm biến từ backend Adafruit
    // Các loại cảm biến
    socket.on('temperature sensor', (data) => {
      console.log('Socket - Temperature sensor data received:', data);
      dispatch({ type: 'SET_TEMPERATURE_DATA', payload: data });
    });

    socket.on('soil moisture sensor', (data) => {
      console.log('Socket - Soil moisture data received:', data);
      dispatch({ type: 'SET_SOIL_MOISTURE_DATA', payload: data });
    });

    socket.on('light sensor', (data) => {
      console.log('Socket - Light sensor data received:', data);
      dispatch({ type: 'SET_LIGHT_DATA', payload: data });
    });

    // Legacy event names - Tên sự kiện cũ
    socket.on('temp', (data) => {
      console.log('Socket - Legacy temperature data received:', data);
      dispatch({ type: 'SET_TEMPERATURE_DATA', payload: data });
    });

    socket.on('humidity', (data) => {
      console.log('Socket - Legacy humidity data received:', data);
      dispatch({ type: 'SET_HUMIDITY_DATA', payload: data });
    });

    socket.on('light', (data) => {
      console.log('Socket - Legacy light data received:', data);
      dispatch({ type: 'SET_LIGHT_DATA', payload: data });
    });

    // Control device listeners - Các thiết bị điều khiển
    socket.on('pump', (data) => {
      console.log('Socket - Pump data received:', data);
      dispatch({ type: 'SET_PUMP_DATA', payload: data });
    });

    socket.on('led', (data) => {
      console.log('Socket - LED data received:', data);
      dispatch({ type: 'SET_LED_DATA', payload: data });
    });

    // Xác nhận điều khiển thiết bị
    socket.on('control_ack', (data) => {
      console.log('Socket - Control acknowledgment received:', data);
      if (data.feed === 'V10') {
        dispatch({ type: 'SET_PUMP_DATA', payload: { value: parseFloat(data.value) } });
      } else if (data.feed === 'V11') {
        dispatch({ type: 'SET_LED_DATA', payload: { value: parseFloat(data.value) } });
      }
    });

    // Kiểm tra kết nối ngay khi khởi tạo
    if (socket.connected) {
      dispatch({ type: 'SOCKET_CONNECT' });
    }

    // Clean up các listeners khi component unmount
    return () => {
      console.log('Cleaning up socket listeners...');
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
      socket.off('temperature sensor');
      socket.off('soil moisture sensor');
      socket.off('light sensor');
      socket.off('temp');
      socket.off('humidity');
      socket.off('light');
      socket.off('pump');
      socket.off('led');
      socket.off('control_ack');
      
      // Ngắt kết nối socket khi unmount
      socket.disconnect();
    };
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}; 