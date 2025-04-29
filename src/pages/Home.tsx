import { useEffect, useState } from "react";
import socket from "../services/socket";

const Home = () => {
  const [mqttData, setMqttData] = useState<any>([]);

  useEffect(() => {
    socket.connect(); // Connect on component mount

    socket.on("mqttData", (data) => {
      setMqttData((prevData: any) => [data, ...prevData]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleLed = (data: any) => {
    if (data == "1") {
      socket.emit("openLed", "1");
    } else {
      socket.emit("closeLed", "2");
    }
  };

  return (
    <div>
      <h2>Real-Time MQTT Data</h2>
      {/* <ul>
              {mqttData.map((item:any, index:any) => (
                  <li key={index}>
                      <strong>Feed:</strong> {item.feed} | <strong>Value:</strong> {item.value}
                  </li>
              ))}
          </ul> */}
    </div>
  );
};

export default Home;
