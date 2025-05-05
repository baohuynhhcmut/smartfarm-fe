import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

interface SensorDataState {
  temperature: SensorData | null;
  humidity: SensorData | null;
  light: SensorData | null;
  soilMoisture: SensorData | null;
  pump: SensorData | null;
  led: SensorData | null;
}

const initialState: SensorDataState = {
  temperature: null,
  humidity: null,
  light: null,
  soilMoisture: null,
  pump: null,
  led: null,
};

const sensorDataSlice = createSlice({
  name: 'sensorData',
  initialState,
  reducers: {
    setTemperatureData: (state, action: PayloadAction<SensorData>) => {
      state.temperature = action.payload;
      console.log('Redux - Temperature data updated:', action.payload);
    },
    setHumidityData: (state, action: PayloadAction<SensorData>) => {
      state.humidity = action.payload;
      console.log('Redux - Humidity data updated:', action.payload);
    },
    setLightData: (state, action: PayloadAction<SensorData>) => {
      state.light = action.payload;
      console.log('Redux - Light data updated:', action.payload);
    },
    setSoilMoistureData: (state, action: PayloadAction<SensorData>) => {
      state.soilMoisture = action.payload;
      console.log('Redux - Soil moisture data updated:', action.payload);
    },
    setPumpData: (state, action: PayloadAction<SensorData>) => {
      state.pump = action.payload;
      console.log('Redux - Pump data updated:', action.payload);
    },
    setLedData: (state, action: PayloadAction<SensorData>) => {
      state.led = action.payload;
      console.log('Redux - LED data updated:', action.payload);
    },
  },
});

export const {
  setTemperatureData,
  setHumidityData,
  setLightData,
  setSoilMoistureData,
  setPumpData,
  setLedData,
} = sensorDataSlice.actions;

export default sensorDataSlice.reducer; 