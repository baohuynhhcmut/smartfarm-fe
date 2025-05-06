import { useEffect, useState } from "react";
import { useAppContext, Garden, Device } from "../../../context/AppContext";
import { useDeviceControl } from "../../../hooks/useDeviceControl";
import useSocketConnection from "../../../hooks/useSocketConnection";
import DeviceControls from "../../../components/DeviceControls";
import SocketStatus from "../../../components/SocketStatus";
import "./Home.css";
import { FaLocationDot } from "react-icons/fa6";
import Map from "../../../components/Map";
import bg1 from "../../../assets/image 7.png";
import bg2 from "../../../assets/image 8.png";
import bg3 from "../../../assets/image 9.png";
import bg4 from "../../../assets/twemoji_sun-behind-cloud.png";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import socket from "../../../services/socket";

// Interface for sensor readings
interface SensorReading {
  value: number;
  timestamp?: string;
  device_name?: string;
}

const Home = () => {
  // Sử dụng Context API
  const { state, dispatch } = useAppContext();
  const { isConnected } = useSocketConnection();
  const deviceControl = useDeviceControl();
  
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loadingDeviceIds, setLoadingDeviceIds] = useState<string[]>([]);
  const [connectedFeeds, setConnectedFeeds] = useState<string[]>([]);
  
  // Sensor readings state
  const [sensorReadings, setSensorReadings] = useState<{
    temperature: SensorReading | null;
    light: SensorReading | null;
    humidity: SensorReading | null;
    soilMoisture: SensorReading | null;
  }>({
    temperature: null,
    light: null,
    humidity: null,
    soilMoisture: null
  });
  
  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Lấy dữ liệu từ state
  const gardens = state.user.gardens;
  const selectedGarden = state.user.selectedGarden;
  const devices = state.user.devices;
  const isLoadingDevices = state.user.isLoadingDevices;
  const user = state.user.user;
  
  // Check if we have any devices
  const hasDevices = devices.length > 0;

  // Connect to device sockets when devices change
  useEffect(() => {
    if (devices.length > 0) {
      // Clear previous connected feeds
      setConnectedFeeds([]);
      
      // Track which devices we are connecting to
      const deviceIdsToConnect = devices
        .filter(d => d.is_active)
        .map(d => d.device_id);
      
      setLoadingDeviceIds(deviceIdsToConnect);
      
      // Reset sensor readings when changing gardens
      setSensorReadings({
        temperature: null,
        light: null,
        humidity: null,
        soilMoisture: null
      });
      
      // For each active device, set up socket listeners
      devices.forEach(device => {
        if (device.is_active) {
          // Map feed to appropriate event name
          let eventName = '';
          
          switch (device.feed) {
            case 'V1':
              eventName = 'temperature sensor';
              break;
            case 'V4':
              eventName = 'light sensor';
              break;
            case 'V10':
              eventName = 'pump';
              break;
            case 'V11':
              eventName = 'led';
              break;
            default:
              eventName = device.type;
          }
          
          // Set up listener based on the mapped event name
          if (eventName) {
            console.log(`Setting up listener for ${eventName}`);
            
            socket.on(eventName, (data) => {
              console.log(`Received ${eventName} data:`, data);
              setConnectedFeeds(prev => 
                prev.includes(device.feed) ? prev : [...prev, device.feed]
              );
              setLoadingDeviceIds(prev => 
                prev.filter(id => id !== device.device_id)
              );
              
              // Update sensor readings based on device type
              if (device.type.includes('temperature')) {
                setSensorReadings(prev => ({
                  ...prev,
                  temperature: {
                    value: data.value,
                    timestamp: data.timestamp,
                    device_name: device.device_name
                  }
                }));
              } else if (device.type.includes('light')) {
                setSensorReadings(prev => ({
                  ...prev,
                  light: {
                    value: data.value,
                    timestamp: data.timestamp,
                    device_name: device.device_name
                  }
                }));
              } else if (device.type.includes('soilMoisture')) {
                setSensorReadings(prev => ({
                  ...prev,
                  soilMoisture: {
                    value: data.value,
                    timestamp: data.timestamp,
                    device_name: device.device_name
                  }
                }));
              } else if (device.type.includes('soil')) {
                setSensorReadings(prev => ({
                  ...prev,
                  soilMoisture: {
                    value: data.value,
                    timestamp: data.timestamp,
                    device_name: device.device_name
                  }
                }));
              }
            });
          }
          
          // Also listen for legacy event names
          if (device.type.includes('temperature')) {
            socket.on('temp', (data) => {
              console.log('Received legacy temp data:', data);
              setConnectedFeeds(prev => 
                prev.includes(device.feed) ? prev : [...prev, device.feed]
              );
              setLoadingDeviceIds(prev => 
                prev.filter(id => id !== device.device_id)
              );
              
              setSensorReadings(prev => ({
                ...prev,
                temperature: {
                  value: data.value,
                  timestamp: data.timestamp,
                  device_name: device.device_name
                }
              }));
            });
          }
          
          // Listen for humidity legacy events
          if (device.type.includes('soilMoisture')) {
            socket.on('humidity', (data) => {
              console.log('Received legacy humidity data:', data);
              setConnectedFeeds(prev => 
                prev.includes(device.feed) ? prev : [...prev, device.feed]
              );
              setLoadingDeviceIds(prev => 
                prev.filter(id => id !== device.device_id)
              );
              
              setSensorReadings(prev => ({
                ...prev,
                soilMoisture: {
                  value: data.value,
                  timestamp: data.timestamp,
                  device_name: device.device_name
                }
              }));
            });
          }
          
          // Listen for light legacy events
          if (device.type.includes('light')) {
            socket.on('light', (data) => {
              console.log('Received legacy light data:', data);
              setConnectedFeeds(prev => 
                prev.includes(device.feed) ? prev : [...prev, device.feed]
              );
              setLoadingDeviceIds(prev => 
                prev.filter(id => id !== device.device_id)
              );
              
              setSensorReadings(prev => ({
                ...prev,
                light: {
                  value: data.value,
                  timestamp: data.timestamp,
                  device_name: device.device_name
                }
              }));
            });
          }
          
          // Listen for control_ack for all devices
          socket.on('control_ack', (data) => {
            if (data.feed === device.feed) {
              console.log(`Received control_ack for ${device.device_name}:`, data);
              setConnectedFeeds(prev => 
                prev.includes(device.feed) ? prev : [...prev, device.feed]
              );
              setLoadingDeviceIds(prev => 
                prev.filter(id => id !== device.device_id)
              );
            }
          });
        }
      });
      
      // Set a timeout to clear loading state for any devices that didn't connect
      const timeout = setTimeout(() => {
        setLoadingDeviceIds([]);
      }, 5000);
      
      return () => {
        // Clean up listeners
        devices.forEach(device => {
          if (device.is_active) {
            // Clean up all possible event listeners
            socket.off('temperature sensor');
            socket.off('light sensor');
            socket.off('soil moisture sensor');
            socket.off('temp');
            socket.off('humidity');
            socket.off('light');
            socket.off('pump');
            socket.off('led');
            socket.off(device.type);
          }
        });
        socket.off('control_ack');
        clearTimeout(timeout);
      };
    }
  }, [devices]);

  // Hàm xử lý khi click vào marker trên bản đồ
  const handleGardenSelect = async (garden: Garden) => {
    try {
      // Set the selected garden
      dispatch({ type: 'SET_SELECTED_GARDEN', payload: garden });
      
      // Reset sensor readings when changing gardens
      setSensorReadings({
        temperature: null,
        light: null,
        humidity: null,
        soilMoisture: null
      });
      
      // Set loading state
      dispatch({ type: 'SET_LOADING_DEVICES', payload: true });
      
      // Get JWT token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in localStorage');
        return;
      }
      
      // Fetch devices for the selected garden
      const response = await fetch(`http://localhost:8081/api/v1/device/getDeviceByGardenName?garden_name=${garden.name}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch devices: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.status === 200 && data.data) {
        // Update devices in context
        dispatch({ type: 'SET_DEVICES', payload: data.data });
      } else {
        // If no devices found, set empty array
        dispatch({ type: 'SET_DEVICES', payload: [] });
      }
    } catch (error) {
      console.error('Error fetching devices:', error);
      // Set empty array on error
      dispatch({ type: 'SET_DEVICES', payload: [] });
    } finally {
      // Clear loading state
      dispatch({ type: 'SET_LOADING_DEVICES', payload: false });
    }
  };

  // Format current date and time
  const currentMonth = format(currentTime, 'MMM', { locale: vi });
  const currentDay = format(currentTime, 'd');
  const dayOfWeek = format(currentTime, 'EEEE', { locale: vi });
  const timeString = format(currentTime, 'HH:mm');

  console.log("aaa: ",sensorReadings.soilMoisture )

  return (
    <>
      <div className="flex items-center! justify-between">
        <div className="">
          <p>
            HELLO, <span className="font-bold">{user?.name || 'USER'}</span>
          </p>
          <p className="font-bold text-3xl">Tưới cây gì chưa người đẹp?</p>
        </div>

        <div className="flex items-center gap-x-10">
          <div className="info-1 flex items-center  justify-center divide-x-2 divide-gray-400 gap-x-2">
            <div className="flex flex-col text-base items-center font-bold pr-2!">
              <span>{currentMonth}</span>
              <span className=" text-[#F3569B]">{currentDay}</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-base font-bold">{dayOfWeek}</span>
              <span className=" text-[#78858F]">{timeString}</span>
            </div>
          </div>
          <div className="info-2 flex items-center justify-between">
            <div className="flex flex-col ">
              <span className="text-lg font-bold">{user?.address?.city || 'Thu Duc'}</span>
              <span className="text-base">Cloudy</span>
            </div>
            <p className="text-3xl font-bold">{sensorReadings.temperature ? `${Math.round(sensorReadings.temperature.value)}°` : '32°'}</p>
            <img src={bg4} alt="Weather icon" />
          </div>
        </div>
      </div>

      <div className="mt-[50px]! flex flex-col">
        <h2 className="text-[#374151] font-semibold flex text-2xl items-center mb-4">
          <span className="text-pink-500">
            <FaLocationDot />
          </span>
          {selectedGarden ? `Vườn hiện tại: ${selectedGarden.name}` : 'Chọn vườn bạn muốn xem'}
        </h2>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-2/3 h-[300px] bg-blue-500 rounded-xl relative">
            {isLoadingDevices && (
              <div className="flex items-center justify-center bg-white bg-opacity-75 rounded-xl z-10">
                <div className="loader"></div>
                <p className="ml-2 font-semibold">Đang tải thiết bị...</p>
              </div>
            )}
            <Map gardens={gardens} onGardenSelect={handleGardenSelect} selectedGarden={selectedGarden} />

          </div>

          <div className="flex flex-col lg:w-1/3 gap-4">
            <div className="info-3 flex items-center justify-center gap-x-2 p-3">
              {selectedGarden && !sensorReadings.temperature && loadingDeviceIds.some(id => 
                devices.find(d => d.device_id === id && d.type.includes('temperature'))
              ) ? (
                <div className="flex items-center justify-center bg-white bg-opacity-75 rounded-xl ">
                  <div className="loader"></div>
                  <p className="ml-2 text-sm">Đang kết nối...</p>
                </div>
              ) : null}
              <img src={bg1} className="w-10 h-10 object-contain" alt="Temperature icon" />
              <div className="flex flex-col">
                <p className="text-lg font-bold">Nhiệt độ</p>
                <p className="text-lg font-bold">
                  {sensorReadings.temperature 
                    ? `${sensorReadings.temperature.value}℃` 
                    : selectedGarden && hasDevices ? 'Đang chờ...' : 'N/A'
                  }
                </p>
                {sensorReadings.temperature?.device_name && (
                  <p className="text-xs text-gray-500">{sensorReadings.temperature.device_name}</p>
                )}
              </div>
            </div>
            
            <div className="info-4 flex items-center justify-center gap-x-2  p-3">
              {selectedGarden && !sensorReadings.light && loadingDeviceIds.some(id => 
                devices.find(d => d.device_id === id && d.type.includes('light'))
              ) ? (
                <div className="flex items-center justify-center bg-white bg-opacity-75 rounded-xl z-10">
                  <div className="loader"></div>
                  <p className="ml-2 text-sm">Đang kết nối...</p>
                </div>
              ) : null}
              <img src={bg2} className="w-10 h-10 object-contain" alt="Light icon" />
              <div className="flex flex-col">
                <p className="text-lg font-bold">Ánh sáng</p>
                <p className="text-lg font-bold">
                  {sensorReadings.light 
                    ? `${sensorReadings.light.value} lux` 
                    : selectedGarden && hasDevices ? 'Đang chờ...' : 'N/A'
                  }
                </p>
                {sensorReadings.light?.device_name && (
                  <p className="text-xs text-gray-500">{sensorReadings.light.device_name}</p>
                )}
              </div>
            </div>
            
            <div className="info-5 flex items-center justify-center gap-x-2  p-3">
              {selectedGarden && !sensorReadings.soilMoisture && loadingDeviceIds.some(id => 
                devices.find(d => d.device_id === id && d.type.includes('soilMoisture'))
              ) ? (
                <div className="flex items-center justify-center bg-white bg-opacity-75 rounded-xl z-10">
                  <div className="loader"></div>
                  <p className="ml-2 text-sm">Đang kết nối...</p>
                </div>
              ) : null}
              <img src={bg3} className="w-10 h-10 object-contain" alt="Humidity icon" />
              <div className="flex flex-col">
                <p className="text-lg font-bold">Độ ẩm</p>
                <p className="text-lg font-bold">
                  {sensorReadings.soilMoisture 
                    ? `${sensorReadings.soilMoisture.value}%` 
                    : selectedGarden && hasDevices ? 'Đang chờ...' : 'N/A'
                  }
                </p>
                {sensorReadings.soilMoisture?.device_name && (
                  <p className="text-xs text-gray-500">{sensorReadings.soilMoisture.device_name}</p>
                )}
              </div>
            </div>
            
          </div>

        </div>
      </div>

      {selectedGarden && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-3">Thiết bị trong vườn</h2>
          {devices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[300px] overflow-y-auto pr-2">
              {devices.map((device) => (
                <div key={device._id} className="device-card bg-white rounded-lg shadow-md p-3 relative">
                  {loadingDeviceIds.includes(device.device_id) && (
                    <div className="flex items-center justify-center bg-white bg-opacity-75 rounded-lg z-10">
                      <div className="loader"></div>
                      <p className="ml-2 font-semibold">Đang kết nối...</p>
                    </div>
                  )}
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="text-base font-semibold">{device.device_name}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      device.is_active 
                        ? connectedFeeds.includes(device.feed)
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {device.is_active 
                        ? connectedFeeds.includes(device.feed)
                          ? 'Đã kết nối'
                          : 'Đang chờ kết nối'
                        : 'Không hoạt động'
                      }
                    </span>
                  </div>
                  <p className="text-gray-600 text-xs mb-1">ID: {device.device_id}</p>
                  <p className="text-gray-600 text-xs mb-1">Loại: {device.type}</p>
                  <p className="text-gray-600 text-xs mb-1">Feed: {device.feed}</p>
                  {device.category === 'device' && (
                    <p className="text-gray-600 text-xs mb-1">Trạng thái: {device.status === 'on' ? 'Bật' : 'Tắt'}</p>
                  )}
                  <div className="mt-1">
                    <p className="text-xs font-semibold">Ngưỡng:</p>
                    <p className="text-gray-600 text-xs">Min: {device.threshold.min}</p>
                    <p className="text-gray-600 text-xs">Max: {device.threshold.max}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-3 text-center">
              <p className="text-gray-600">Không có thiết bị nào trong vườn này</p>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Home;
