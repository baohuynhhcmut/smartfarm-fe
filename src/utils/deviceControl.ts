import socket from '../services/socket';
import { store } from '../store';
import { connect } from '../store/SocketSlice';

// Function to control devices through socket
export const controlDevice = (deviceType: string, state: string | number) => {
  try {
    const socketState = store.getState().socket;
    const connected = socketState?.connected || false;
    
    // If socket is not connected, connect it first
    if (!connected) {
      store.dispatch(connect());
      
      // Small delay to ensure connection is established before sending command
      setTimeout(() => {
        emitControlCommand(deviceType, state);
      }, 200);
    } else {
      emitControlCommand(deviceType, state);
    }
  } catch (error) {
    console.error("Error in controlDevice:", error);
    // Try to emit command anyway
    emitControlCommand(deviceType, state);
  }
};

// Helper function to emit the actual command
const emitControlCommand = (deviceType: string, state: string | number) => {
  try {
    console.log(`Sending control command to ${deviceType}: ${state}`);
    
    switch (deviceType.toLowerCase()) {
      case 'pump':
      case 'v10':
        socket.emit('control', { feed: 'V10', value: state.toString() });
        break;
      case 'led':
      case 'v11':
        socket.emit('control', { feed: 'V11', value: state.toString() });
        break;
      default:
        console.warn(`Unknown device type: ${deviceType}`);
    }
  } catch (error) {
    console.error("Error emitting control command:", error);
  }
}; 