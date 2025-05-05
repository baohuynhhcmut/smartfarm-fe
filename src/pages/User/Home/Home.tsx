import { useEffect } from "react";
import { useAppContext } from "../../../context/AppContext";
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

const Home = () => {
  // Sử dụng Context API thay cho Redux
  const { state } = useAppContext();
  const { isConnected } = useSocketConnection();
  const deviceControl = useDeviceControl();
  
  // Lấy dữ liệu từ state
  const temperature = state.sensorData.temperature;
  const humidity = state.sensorData.humidity;
  const light = state.sensorData.light;
  const soilMoisture = state.sensorData.soilMoisture;

  // Ghi log khi dữ liệu cảm biến thay đổi
  useEffect(() => {
    if (temperature) {
      console.log('Home - Temperature value:', temperature.value);
    }
    if (humidity) {
      console.log('Home - Humidity value:', humidity.value);
    }
    if (light) {
      console.log('Home - Light value:', light.value);
    }
    if (soilMoisture) {
      console.log('Home - Soil moisture value:', soilMoisture.value);
    }
  }, [temperature, humidity, light, soilMoisture]);

  return (
    <>
      <div className="flex items-center! justify-between">
        <div className="">
          <p>
            HELLO, <span className="font-bold">PEIUTHANHLONG</span>
          </p>
          <p className="font-bold text-3xl">Tưới cây gì chưa người đẹp?</p>
        </div>

        <div className="flex items-center gap-x-10">
          <div className="info-1 flex items-center  justify-center divide-x-2 divide-gray-400 gap-x-2">
            <div className="flex flex-col text-base items-center font-bold pr-2!">
              <span>Jun</span>
              <span className=" text-[#F3569B]">23</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-base font-bold">Wednesday</span>
              <span className=" text-[#78858F]">08:00 AM </span>
            </div>
          </div>
          <div className="info-2 flex items-center justify-between">
            <div className="flex flex-col ">
              <span className="text-lg font-bold">Thu Duc</span>
              <span className="text-base">Cloudy</span>
            </div>
            <p className="text-3xl font-bold">32°</p>
            <img src={bg4} alt="Weather icon" />
          </div>
        </div>
      </div>
      <div className="mt-[50px]! flex flex-col">
        <h2 className="text-[#374151] font-semibold flex text-2xl items-center">
          <span className="text-pink-500">
            <FaLocationDot />
          </span>
          Choose the garden you wanna VIEW
        </h2>

        <div className="flex gap-x-10 h-full">
          <div className="w-full h-[350px] bg-blue-500 rounded-xl">
            <Map />
          </div>

          <div className="flex-col flex w-1/3 gap-y-4">
            <div className="info-3 h-1/3 flex items-center justify-center gap-x-2">
              <img src={bg1} className="w-10! h-10! object-contain " alt="Temperature icon" />
              <div className="flex flex-col">
                <p className="text-xl font-bold">Nhiệt độ</p>
                <p className="text-xl font-bold">{temperature ? temperature.value : 'N/A'}℃</p>
              </div>
            </div>
            <div className="info-4 h-1/3 flex items-center justify-center gap-x-2">
              <img src={bg2} className="w-10! h-10! object-contain" alt="Light icon" />
              <div className="flex flex-col">
                <p className="text-xl font-bold">Ánh sáng</p>
                <p className="text-xl font-bold">{light ? light.value : 'N/A'} lux</p>
              </div>
            </div>
            <div className="info-5 h-1/3 flex items-center justify-center gap-x-2">
              <img src={bg3} className="w-10! h-10! object-contain" alt="Humidity icon" />
              <div className="flex flex-col">
                <p className="text-xl font-bold">Độ ẩm</p>
                <p className="text-xl font-bold">{humidity ? humidity.value : '0.0'}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default Home;
