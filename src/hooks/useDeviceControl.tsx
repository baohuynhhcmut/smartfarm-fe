import { useAppContext } from '../context/AppContext';
import useSocketConnection from './useSocketConnection';

export const useDeviceControl = () => {
  const { state } = useAppContext();
  const { emit, isConnected } = useSocketConnection();
  
  // Hàm điều khiển thiết bị
  const controlDevice = (deviceType: string, value: string | number) => {
    try {
      console.log(`Gửi lệnh điều khiển tới ${deviceType}: ${value}`);
      
      let feed = '';
      switch (deviceType.toLowerCase()) {
        case 'pump':
        case 'v10':
          feed = 'V10';
          break;
        case 'led':
        case 'v11':
          feed = 'V11';
          break;
        default:
          console.warn(`Loại thiết bị không xác định: ${deviceType}`);
          return;
      }
      
      // Sử dụng hook useSocketConnection để gửi lệnh
      emit('control', { feed, value: value.toString() }, (response: any) => {
        if (response && response.success) {
          console.log(`Điều khiển thành công: ${deviceType} -> ${value}`);
        } else {
          console.error(`Lỗi điều khiển thiết bị: ${deviceType}`, response);
        }
      });
    } catch (error) {
      console.error('Lỗi khi điều khiển thiết bị:', error);
    }
  };
  
  // Hàm bật/tắt máy bơm
  const togglePump = () => {
    const currentValue = state.sensorData.pump?.value || 0;
    const newValue = currentValue === 0 ? 1 : 0;
    controlDevice('pump', newValue);
  };
  
  // Hàm bật/tắt đèn LED
  const toggleLed = () => {
    const currentValue = state.sensorData.led?.value || 0;
    const newValue = currentValue === 0 ? 1 : 0;
    controlDevice('led', newValue);
  };
  
  return {
    controlDevice,
    togglePump,
    toggleLed,
    pumpState: state.sensorData.pump?.value || 0,
    ledState: state.sensorData.led?.value || 0,
    isConnected,
  };
}; 