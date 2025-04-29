import { useEffect, useState } from "react";
import socket from "../../services/socket";
import "./Home.css"
import { FaLocationDot } from "react-icons/fa6";
import Map from "../../components/Map";
import bg1 from "../../assets/image 7.png"
import bg2 from "../../assets/image 8.png"
import bg3 from "../../assets/image 9.png"
import bg4 from "../../assets/twemoji_sun-behind-cloud.png"

const Home = () => {

  const [temp,setTemp] = useState<any>(null)
  const [light,setLight] = useState<any>(null)
  const [hudmid,setHumid] = useState<any>(null)

  console.log(socket)
  
  useEffect(() => {
    // Ensure socket is connected before listening for events
    if (!socket.connected) {
      socket.connect();
    }

    const handleTemp = (data: any) => {
      console.log("Received temp:", data);
      setTemp(data);
    };

    const handleHumidity = (data: any) => {
      console.log("Received humidity:", data);
      setHumid(data);
    };

    const handleLight = (data: any) => {
      console.log("Received light:", data);
      setLight(data);
    };

    // Attach event listeners
    socket.on("temp", handleTemp);
    socket.on("humidity", handleHumidity);
    socket.on("light", handleLight);

    // Cleanup function to remove listeners when component unmounts
    return () => {
      socket.off("temp", handleTemp);
      socket.off("humidity", handleHumidity);
      socket.off("light", handleLight);
    };
    
  }, []);


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
            <img src={bg4} />
        </div>
      </div>
    </div>
     <div
      className="mt-[50px]! flex flex-col">
      <h2 className="text-[#374151] font-semibold flex text-2xl items-center"><span className="text-pink-500"><FaLocationDot /></span>
      Choose the garden you wanna VIEW</h2>

      <div className="flex gap-x-10 h-full">
          <div className="w-full h-[350px] bg-blue-500 rounded-xl">
              <Map />
          </div>

          <div className="flex-col flex w-1/3 gap-y-4">
              <div className="info-3 h-1/3 flex items-center justify-center gap-x-2">
                  <img src={bg1} className="w-10! h-10! object-contain "/>
                  <div className="flex flex-col">
                    <p className="text-xl font-bold">Temperature</p>
                    <p className="text-xl font-bold">{temp && temp.value}℃</p>
                  </div>
              </div>  
              <div className="info-4 h-1/3 flex items-center justify-center gap-x-2">
                  <img src={bg2} className="w-10! h-10! object-contain"/>
                  <div className="flex flex-col">
                    <p className="text-xl font-bold">Light Level</p>
                    <p className="text-xl font-bold">{light && light.value}%</p>
                  </div>
            </div>
            <div className="info-5 h-1/3 flex items-center justify-center gap-x-2">
                  <img src={bg3} className="w-10! h-10! object-contain" />
                  <div className="flex flex-col">
                    <p className="text-xl font-bold">Humidity </p>
                    <p className="text-xl font-bold">{hudmid && hudmid.value}%</p>
                  </div>
            </div>
          </div>
      </div>

    </div>
    </>
  );
};

export default Home;
