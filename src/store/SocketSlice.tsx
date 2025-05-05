import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import socket from '../services/socket';

interface SocketState {
  connected: boolean;
  lastMessage: any;
}

const initialState: SocketState = {
  connected: false,
  lastMessage: null,
};

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    connect: (state) => {
      if (!state.connected) {
        socket.connect();
        state.connected = true;
      }
    },
    disconnect: (state) => {
      if (state.connected) {
        socket.disconnect();
        state.connected = false;
      }
    },
    setLastMessage: (state, action: PayloadAction<any>) => {
      state.lastMessage = action.payload;
    },
  },
});

export const { connect, disconnect, setLastMessage } = socketSlice.actions;
export default socketSlice.reducer; 