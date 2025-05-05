import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import socket from '@/services/socket';

interface Device {
  id: string;
  name: string;
  lastUsed: string;
  status: string;
  timer: string;
  brand: string;
  type: string;
  isOn: boolean;
  timerSet: boolean;
  turnOffTime: string | null;
  automatic: boolean;
  isLoading: boolean;
  showTimerInput: boolean;
  upperThreshold: number;
  lowerThreshold: number;
}

interface ConfirmationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

// Styled components
const Container = styled.div`
  width: 100%;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const DropdownContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

const SelectContainer = styled.div`
  position: relative;
  flex: 1;
`;

const Select = styled.select`
  display: block;
  appearance: none;
  width: 100%;
  background-color: white;
  border: 1px solid #cbd5e0;
  padding: 0.5rem 1rem;
  padding-right: 2rem;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  transition: border-color 0.2s, box-shadow 0.2s;

  &:hover {
    border-color: #a0aec0;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
  }
`;

const SelectIcon = styled.div`
  pointer-events: none;
  position: absolute;
  top: 50%;
  right: 0.5rem;
  transform: translateY(-50%);
  color: #4a5568;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
`;

const Description = styled.p`
  margin-top: 0.5rem;
  color: #4a5568;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  padding: 0.75rem;
  text-align: left;
  border-bottom: 2px solid #e2e8f0;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f7fafc;
  }
`;

const TableCell = styled.td`
  padding: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
`;

const ToggleButton = styled.button<{ isOn: boolean }>`
  background-color: ${({ isOn }) => (isOn ? '#48bb78' : '#e53e3e')};
  border: none;
  border-radius: 1rem;
  width: 3rem;
  height: 1.5rem;
  position: relative;
  cursor: pointer;
  transition: background-color 0.2s;

  &::after {
    content: '';
    position: absolute;
    top: 0.125rem;
    left: ${({ isOn }) => (isOn ? '1.625rem' : '0.125rem')};
    width: 1.25rem;
    height: 1.25rem;
    background-color: white;
    border-radius: 50%;
    transition: left 0.2s;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #cbd5e0;
  border-radius: 0.375rem;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: #63b3ed;
    box-shadow: 0 0 0 3px rgba(99, 179, 237, 0.5);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TimerButton = styled.button<{ isSet: boolean }>`
  background-color: ${({ isSet }) => (isSet ? '#e53e3e' : '#48bb78')};
  border: none;
  border-radius: 0.375rem;
  padding: 0.5rem 1rem;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ isSet }) => (isSet ? '#c53030' : '#38a169')};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LoadingOverlay = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.7);
  z-index: 10;
  border-radius: 0.375rem;
  font-size: 0.875rem;
`;

const Spinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid #3498db;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
  margin-right: 10px;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Toast notification component
const Toast = styled.div<{ visible: boolean }>`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #48bb78;
  color: white;
  padding: 1rem;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  transform: translateY(${({ visible }) => (visible ? 0 : '20px')});
  transition: opacity 0.3s, transform 0.3s;
  z-index: 1000;
  display: flex;
  align-items: center;
  font-weight: 500;
  max-width: 350px;
  
  &:before {
    content: '✓';
    margin-right: 8px;
    font-size: 1.2rem;
    font-weight: bold;
  }
`;

// Buttons for timer control
const TimeControlButton = styled.button`
  background-color: #4299e1;
  color: white;
  border: none;
  border-radius: 0.25rem;
  padding: 0.25rem 0.5rem;
  margin: 0.25rem;
  font-size: 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #3182ce;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PauseButton = styled(TimeControlButton)`
  background-color: #ed8936;
  
  &:hover {
    background-color: #dd6b20;
  }
`;

const EditButton = styled(TimeControlButton)`
  background-color: #4299e1;
  
  &:hover {
    background-color: #3182ce;
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  margin-top: 0.5rem;
`;

// Popup styles
const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const PopupContent = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  width: 400px;
  max-width: 90%;
`;

const PopupTitle = styled.h3`
  font-size: 1.25rem;
  margin-top: 0;
  margin-bottom: 1rem;
  font-weight: 600;
`;

const PopupButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1.5rem;
`;

const PopupButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  font-weight: 500;
`;

const PopupCancelButton = styled(PopupButton)`
  background-color: #e2e8f0;
  color: #4a5568;
  
  &:hover {
    background-color: #cbd5e0;
  }
`;

const PopupConfirmButton = styled(PopupButton)`
  background-color: #ed8936;
  color: white;
  
  &:hover {
    background-color: #dd6b20;
  }
`;

// Confirmation popup component
const ConfirmationPopup = ({ isOpen, onClose, onConfirm, message }: ConfirmationPopupProps) => {
  if (!isOpen) return null;
  
  return (
    <PopupOverlay onClick={onClose}>
      <PopupContent onClick={(e) => e.stopPropagation()}>
        <PopupTitle>Xác nhận</PopupTitle>
        <p>{message}</p>
        <PopupButtonContainer>
          <PopupCancelButton onClick={onClose}>Không</PopupCancelButton>
          <PopupConfirmButton onClick={onConfirm}>Có</PopupConfirmButton>
        </PopupButtonContainer>
      </PopupContent>
    </PopupOverlay>
  );
};

// Component
const Devices = () => {
  const locations = [
    "Trường Đại học Bách Khoa, ĐHQGHCM",
    "Trường Đại học Quốc tế, ĐHQGHCM",
    "Bcons Suối Tiên",
    "Bcons Miền Đông",
  ];

  // State for toast
  const [toast, setToast] = useState({
    visible: false,
    message: ''
  });

  // Devices state - moved here before useEffect
  const [devices, setDevices] = useState<Device[]>([
    { 
      id: 'V10',
      name: 'Máy bơm', 
      lastUsed: 'Vừa xong', 
      status: 'Tắt', 
      timer: 'Chưa đặt', 
      brand: 'Xiaomi', 
      type: 'Watering', 
      isOn: false, 
      timerSet: false, 
      turnOffTime: null, 
      automatic: false,
      isLoading: false,
      showTimerInput: true,
      upperThreshold: 33, // Nếu nhiệt độ > 33 thì bật máy bơm
      lowerThreshold: 33  // Nếu nhiệt độ <= 33 thì tắt máy bơm (chỉ dùng ngưỡng trên)
    },
    { 
      id: 'V11',
      name: 'Đèn LED', 
      lastUsed: 'Vừa xong', 
      status: 'Tắt', 
      timer: 'Chưa đặt', 
      brand: 'Phillips', 
      type: 'Led', 
      isOn: false, 
      timerSet: false, 
      turnOffTime: null, 
      automatic: false,
      isLoading: false,
      showTimerInput: true,
      upperThreshold: 2000, // Nếu ánh sáng >= 2000 thì tắt đèn
      lowerThreshold: 2000  // Nếu ánh sáng < 2000 thì bật đèn (chỉ dùng ngưỡng trên)
    },
  ]);

  // Function to show toast
  const showToast = (message: string) => {
    setToast({ visible: true, message });
    // Hide toast after 3 seconds
    setTimeout(() => {
      setToast({ visible: false, message: '' });
    }, 3000);
  };

  // Helper to format date to Vietnamese format
  const formatDateToVN = (date: Date): string => {
    // Format as YYYY-MM-DDTHH:MM which is required by datetime-local input
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Function to get default time (now + 1 minute)
  const getDefaultTimerValue = (): string => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 1);
    return formatDateToVN(now);
  };

  // Move handlers outside the useEffect to prevent dependency issues
  const handleTemperatureData = useCallback((data: any) => {
    console.log("Received temperature data:", data);
    
    // Find the pump device (V10)
    const pumpIndex = devices.findIndex(device => device.id === 'V10');
    if (pumpIndex >= 0 && devices[pumpIndex].automatic) {
      const pump = devices[pumpIndex];
      const temperature = data.value;
      
      // If temperature > 33, turn ON pump
      if (temperature > pump.upperThreshold && !pump.isOn && !pump.isLoading) {
        console.log(`Temperature (${temperature}) > threshold (${pump.upperThreshold}). Turning ON pump automatically.`);
        socket.emit("openPump", "1");
      }
      // If temperature <= 33, turn OFF pump
      else if (temperature <= pump.upperThreshold && pump.isOn && !pump.isLoading) {
        console.log(`Temperature (${temperature}) <= threshold (${pump.upperThreshold}). Turning OFF pump automatically.`);
        socket.emit("closePump", "0");
      }
    }
  }, [devices]);
  
  const handleLightData = useCallback((data: any) => {
    console.log("Received light data:", data);
    
    // Find the LED device (V11)
    const ledIndex = devices.findIndex(device => device.id === 'V11');
    if (ledIndex >= 0 && devices[ledIndex].automatic) {
      const led = devices[ledIndex];
      const lightLevel = data.value;
      
      // If light level < 2000, turn ON LED
      if (lightLevel < led.upperThreshold && !led.isOn && !led.isLoading) {
        console.log(`Light level (${lightLevel}) < threshold (${led.upperThreshold}). Turning ON LED automatically.`);
        socket.emit("openLed", "1");
      }
      // If light level >= 2000, turn OFF LED
      else if (lightLevel >= led.upperThreshold && led.isOn && !led.isLoading) {
        console.log(`Light level (${lightLevel}) >= threshold (${led.upperThreshold}). Turning OFF LED automatically.`);
        socket.emit("closeLed", "0");
      }
    }
  }, [devices]);

  // Main socket setup effect
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }
    
    // Listen for temperature sensor data
    socket.on('temperature sensor', handleTemperatureData);
    
    // Listen for light sensor data
    socket.on('light sensor', handleLightData);
    
    // Listen for command receipt confirmation
    socket.on('command_received', (data) => {
      console.log("Command received by server:", data);
      // No state changes here as the device is still in loading state
    });
    
    // Listen for control acknowledgments from Adafruit
    socket.on('control_ack', (data) => {
      console.log("Received control acknowledgment:", data);
      
      if (data.feed === 'V10') {
        // Update pump state
        setDevices(prev => prev.map(device => 
          device.id === 'V10' 
            ? { 
                ...device, 
                isOn: data.value === "1", 
                status: data.value === "1" ? 'Bật' : 'Tắt', 
                lastUsed: new Date().toLocaleTimeString('vi-VN'),
                isLoading: false,
                // Reset timer if device is turned off
                ...(data.value === "0" ? { 
                  timerSet: false, 
                  timer: 'Chưa đặt', 
                  turnOffTime: null,
                  showTimerInput: true
                } : {})
              } 
            : device
        ));
        
        // Show a toast if device was turned off by timer
        if (data.value === "0" && data.byTimer) {
          showToast("Máy bơm đã được tắt tự động theo hẹn giờ");
        }
      } else if (data.feed === 'V11') {
        // Update LED state
        setDevices(prev => prev.map(device => 
          device.id === 'V11' 
            ? { 
                ...device, 
                isOn: data.value === "1", 
                status: data.value === "1" ? 'Bật' : 'Tắt', 
                lastUsed: new Date().toLocaleTimeString('vi-VN'),
                isLoading: false,
                // Reset timer if device is turned off
                ...(data.value === "0" ? { 
                  timerSet: false, 
                  timer: 'Chưa đặt', 
                  turnOffTime: null,
                  showTimerInput: true
                } : {})
              } 
            : device
        ));
        
        // Show a toast if device was turned off by timer
        if (data.value === "0" && data.byTimer) {
          showToast("Đèn LED đã được tắt tự động theo hẹn giờ");
        }
      }
    });
    
    // Listen for timer events
    socket.on('timer_set', (data) => {
      console.log("Timer set acknowledgment:", data);
      showToast(`Hẹn giờ tắt đã được cài đặt cho ${data.deviceId === 'V10' ? 'Máy bơm' : 'Đèn LED'}`);
      
      // Hide timer input for the device
      setDevices(prev => prev.map(device => 
        device.id === data.deviceId
          ? { ...device, showTimerInput: false }
          : device
      ));
    });
    
    socket.on('timer_executed', (data) => {
      console.log("Timer executed:", data);
      // The device state will be updated via control_ack event
    });
    
    socket.on('timer_cancelled', (data) => {
      console.log("Timer cancelled:", data);
      // Don't show a toast if this was part of automatic mode toggle
      // unless it actually cancelled an active timer
      if (!data.message) {
        showToast(`Đã hủy hẹn giờ tắt cho thiết bị ${data.deviceId === 'V10' ? 'Máy bơm' : 'Đèn LED'}`);
      }
    });
    
    socket.on('timer_error', (data) => {
      console.error("Timer error:", data);
      // Only show alert for important errors, not for "no active timer" type of messages
      if (data.error && !data.error.includes("No active timer")) {
        alert(`Lỗi cài đặt hẹn giờ: ${data.error}`);
      }
    });
    
    // Listen for control errors
    socket.on('control_error', (data) => {
      console.error("Control error:", data);
      
      // Update device state to remove loading and keep previous state
      if (data.feed === 'V10' || data.feed === 'V11') {
        setDevices(prev => prev.map(device => 
          device.id === data.feed 
            ? { ...device, isLoading: false } 
            : device
        ));
        
        // You could add a toast notification here to alert the user
        alert(`Error controlling ${data.feed === 'V10' ? 'pump' : 'LED'}: ${data.error}`);
      }
    });
    
    // Listen for automatic mode acknowledgment
    socket.on('automatic_mode_set', (data) => {
      console.log("Automatic mode acknowledgment:", data);
      showToast(`Chế độ tự động đã được ${data.mode === 'automatic' ? 'bật' : 'tắt'} cho thiết bị ${data.deviceId === 'V10' ? 'Máy bơm' : 'Đèn LED'}`);
    });
    
    return () => {
      socket.off('temperature sensor', handleTemperatureData);
      socket.off('light sensor', handleLightData);
      socket.off('command_received');
      socket.off('control_ack');
      socket.off('control_error');
      socket.off('timer_set');
      socket.off('timer_executed');
      socket.off('timer_cancelled');
      socket.off('timer_error');
      socket.off('automatic_mode_set');
    };
  }, [handleTemperatureData, handleLightData]); // Proper dependencies

  const [selectedLocation, setSelectedLocation] = useState('');

  const toggleDevice = (index: number) => {
    const device = devices[index];
    const updatedDevices = [...devices];
    
    // Set loading state
    updatedDevices[index].isLoading = true;
    setDevices(updatedDevices);
    
    // Send command to server
    const newState = !device.isOn ? "1" : "0";
    
    if (device.id === 'V10') {
      if (newState === "1") {
        socket.emit("openPump", newState);
      } else {
        socket.emit("closePump", newState);
        // Timer will be cancelled server-side
      }
    } else if (device.id === 'V11') {
      if (newState === "1") {
        socket.emit("openLed", newState);
      } else {
        socket.emit("closeLed", newState);
        // Timer will be cancelled server-side
      }
    }
    
    // Note: The actual state update will happen when we receive the acknowledgment from the server
  };

  const handleTimer = (index: number) => {
    const device = devices[index];
    
    // Only allow timer setting when device is ON
    if (!device.isOn) {
      alert('Vui lòng bật thiết bị trước khi cài đặt hẹn giờ');
      return;
    }
    
    const updatedDevices = [...devices];
    const newTimerState = !device.timerSet;
    updatedDevices[index].timerSet = newTimerState;
    updatedDevices[index].timer = newTimerState ? 'Đã đặt' : 'Chưa đặt';
    updatedDevices[index].showTimerInput = newTimerState;
    
    // If enabling timer, set default turn off time (now + 1 minute)
    if (newTimerState) {
      const defaultTime = getDefaultTimerValue();
      updatedDevices[index].turnOffTime = defaultTime;
      
      // Send timer information to server
      socket.emit('setTimer', {
        deviceId: device.id,
        turnOffTime: defaultTime
      });
      
      showToast(`Đã đặt hẹn giờ tắt ${device.name} sau 1 phút`);
    } 
    // If disabling timer, clear the turn off time and cancel server timer
    else {
      updatedDevices[index].turnOffTime = null;
      
      // Notify server to cancel timer
      socket.emit('cancelTimer', {
        deviceId: device.id
      });
      
      showToast(`Đã hủy hẹn giờ tắt ${device.name}. Thiết bị vẫn đang hoạt động.`);
    }
    
    setDevices(updatedDevices);
  };

  const handleTurnOffTimeChange = (index: number, value: string) => {
    const device = devices[index];
    
    // Validate that selected time is in the future
    const selectedTime = new Date(value).getTime();
    const currentTime = new Date().getTime();
    
    if (selectedTime <= currentTime) {
      alert('Thời gian hẹn giờ phải là thời gian trong tương lai');
      return;
    }
    
    const updatedDevices = [...devices];
    updatedDevices[index].turnOffTime = value;
    updatedDevices[index].showTimerInput = false; // Hide the input after setting time
    setDevices(updatedDevices);
    
    // Format date to display in toast
    const selectedDate = new Date(value);
    const timeString = selectedDate.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
    const dateString = selectedDate.toLocaleDateString('vi-VN');
    
    // Only send to server if timer is actively set
    if (device.timerSet) {
      // Send timer information to server
      socket.emit('setTimer', {
        deviceId: device.id,
        turnOffTime: value
      });
      
      showToast(`Đã đặt hẹn giờ tắt ${device.name} lúc ${timeString} ngày ${dateString}`);
    }
  };

  const toggleAutomatic = (index: number) => {
    const device = devices[index];
    const updatedDevices = [...devices];
    const newAutomaticState = !device.automatic;
    
    updatedDevices[index].automatic = newAutomaticState;
    
    // If turning on automatic mode, reset timer settings
    if (newAutomaticState) {
      // Always reset timer settings regardless of whether a timer was set
      updatedDevices[index].timerSet = false;
      updatedDevices[index].timer = 'Chưa đặt';
      updatedDevices[index].turnOffTime = null;
      updatedDevices[index].showTimerInput = true;
      
      // Always attempt to cancel any timer (backend handles case when no timer exists)
      socket.emit('cancelTimer', {
        deviceId: device.id
      });
      
      // Notify the server to enter automatic mode with current thresholds
      socket.emit('setAutomaticMode', {
        deviceId: device.id,
        mode: 'automatic',
        upperThreshold: device.upperThreshold,
        lowerThreshold: device.lowerThreshold
      });
      
      showToast(`Đã bật chế độ tự động cho ${device.name}, hẹn giờ đã được hủy`);
    } else {
      // Notify the server to exit automatic mode
      socket.emit('setAutomaticMode', {
        deviceId: device.id,
        mode: 'manual'
      });
      
      showToast(`Đã tắt chế độ tự động cho ${device.name}`);
    }
    
    setDevices(updatedDevices);
  };

  // Function to toggle timer input visibility
  const toggleTimerInput = (index: number) => {
    const updatedDevices = [...devices];
    updatedDevices[index].showTimerInput = !updatedDevices[index].showTimerInput;
    setDevices(updatedDevices);
  };

  // State for confirmation popup
  const [confirmPopup, setConfirmPopup] = useState({
    isOpen: false,
    message: '',
    deviceIndex: -1
  });
  
  // Function to open confirmation popup
  const openConfirmationPopup = (index: number) => {
    setConfirmPopup({
      isOpen: true,
      message: 'Tạm ngừng sẽ xóa cài đặt hẹn giờ tắt của thiết bị. Thiết bị vẫn sẽ tiếp tục hoạt động.',
      deviceIndex: index
    });
  };
  
  // Function to close confirmation popup
  const closeConfirmationPopup = () => {
    setConfirmPopup(prev => ({ ...prev, isOpen: false }));
  };
  
  // Function to handle pause confirmation
  const handlePauseConfirm = () => {
    const index = confirmPopup.deviceIndex;
    if (index >= 0) {
      const device = devices[index];
      
      // Cancel the timer but keep device on
      socket.emit('cancelTimer', {
        deviceId: device.id
      });
      
      // Update local state - reset timer to default state
      const updatedDevices = [...devices];
      updatedDevices[index].timerSet = false;
      updatedDevices[index].timer = 'Chưa đặt';
      updatedDevices[index].turnOffTime = null;
      updatedDevices[index].showTimerInput = true;
      setDevices(updatedDevices);
      
      showToast(`Đã tạm ngừng hẹn giờ tắt cho ${device.name}. Thiết bị vẫn đang hoạt động.`);
    }
    
    // Close the popup
    closeConfirmationPopup();
  };

  // Add a new function to handle threshold changes
  const handleThresholdChange = (index: number, type: 'upper' | 'lower', value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;
    
    const updatedDevices = [...devices];
    if (type === 'upper') {
      updatedDevices[index].upperThreshold = numValue;
    } else {
      updatedDevices[index].lowerThreshold = numValue;
    }
    
    // If in automatic mode, send updated thresholds to server
    if (updatedDevices[index].automatic) {
      socket.emit('updateThresholds', {
        deviceId: updatedDevices[index].id,
        upperThreshold: updatedDevices[index].upperThreshold,
        lowerThreshold: updatedDevices[index].lowerThreshold
      });
    }
    
    setDevices(updatedDevices);
  };

  return (
    <Container>
      <DropdownContainer>
        <SelectContainer>
          <Select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
            <option value="">Chọn khu vườn</option>
            {locations.map((location, index) => (
              <option key={index} value={location}>
                {location}
              </option>
            ))}
          </Select>
          <SelectIcon>
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </SelectIcon>
        </SelectContainer>
      </DropdownContainer>
      <div>
        <Title>DANH SÁCH THIẾT BỊ</Title>
        <Description>
          Nhấn vào nút bật/tắt để điều khiển thiết bị
        </Description>
      </div>
      <Table>
        <thead>
          <TableRow>
            <TableHeader>Thiết bị</TableHeader>
            <TableHeader>Thời gian sử dụng cuối</TableHeader>
            <TableHeader>Trạng thái</TableHeader>
            <TableHeader>Ngưỡng trên</TableHeader>
            <TableHeader>Ngưỡng dưới</TableHeader>
            <TableHeader>Hẹn giờ</TableHeader>
            <TableHeader>Thời gian tắt</TableHeader>
            <TableHeader>Bật/Tắt</TableHeader>
            <TableHeader>Tự động</TableHeader>
          </TableRow>
        </thead>
        <tbody>
          {devices.map((device, index) => (
            <TableRow key={index}>
              <TableCell>{device.name}</TableCell>
              <TableCell>{device.lastUsed}</TableCell>
              <TableCell>{device.status}</TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={device.upperThreshold}
                  onChange={(e) => handleThresholdChange(index, 'upper', e.target.value)}
                  style={{ width: '70px' }}
                />
                {device.id === 'V10' ? '°C' : 'lux'}
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={device.lowerThreshold}
                  onChange={(e) => handleThresholdChange(index, 'lower', e.target.value)}
                  style={{ width: '70px' }}
                />
                {device.id === 'V10' ? '°C' : 'lux'}
              </TableCell>
              <TableCell>
                <TimerButton
                  isSet={device.timerSet}
                  onClick={() => handleTimer(index)}
                  disabled={device.automatic || !device.isOn || device.isLoading}
                >
                  {device.timer}
                </TimerButton>
              </TableCell>
              <TableCell>
                {device.timerSet && device.isOn && (
                  <>
                    {device.showTimerInput ? (
                      <>
                        <Input
                          type="datetime-local"
                          value={device.turnOffTime || getDefaultTimerValue()}
                          onChange={(e) => handleTurnOffTimeChange(index, e.target.value)}
                          disabled={device.automatic || device.isLoading}
                        />
                      </>
                    ) : (
                      <>
                        <div>
                          {device.turnOffTime ? new Date(device.turnOffTime).toLocaleString('vi-VN') : 'Chọn thời gian'}
                        </div>
                        <ButtonsContainer>
                          <EditButton 
                            onClick={() => toggleTimerInput(index)}
                            disabled={device.isLoading}
                          >
                            Chỉnh sửa
                          </EditButton>
                          <PauseButton 
                            onClick={() => openConfirmationPopup(index)}
                            disabled={device.isLoading}
                          >
                            Tạm ngừng
                          </PauseButton>
                        </ButtonsContainer>
                      </>
                    )}
                  </>
                )}
              </TableCell>
              <TableCell>
                <div style={{ position: 'relative' }}>
                  {device.isLoading && (
                    <LoadingOverlay>
                      <Spinner />
                      <span>Đang xử lý...</span>
                    </LoadingOverlay>
                  )}
                  <ToggleButton
                    isOn={device.isOn}
                    onClick={() => toggleDevice(index)}
                    disabled={device.automatic || device.isLoading}
                  />
                </div>
              </TableCell>
              <TableCell>
                <div style={{ position: 'relative' }}>
                  <ToggleButton
                    isOn={device.automatic}
                    onClick={() => toggleAutomatic(index)}
                    disabled={device.isLoading}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
      
      <Toast visible={toast.visible}>
        {toast.message}
      </Toast>
      
      <ConfirmationPopup 
        isOpen={confirmPopup.isOpen}
        onClose={closeConfirmationPopup}
        onConfirm={handlePauseConfirm}
        message={confirmPopup.message}
      />
    </Container>
  );
};

export default Devices;
