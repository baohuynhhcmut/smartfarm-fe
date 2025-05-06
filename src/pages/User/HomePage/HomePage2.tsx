import { useState, useEffect, useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FaTemperatureHigh, FaSun, FaTint } from "react-icons/fa";
import "./HomePage2.css";
import socket from "../../../services/socket";
import { format, startOfDay, endOfDay, setHours, setMinutes, setSeconds, setMilliseconds, isWithinInterval } from "date-fns";

type Value = Date | null | [Date | null, Date | null];

interface SensorData {
  timestamp: string;
  value: number;
  day?: string;
}

interface TimeSelection {
  hour: number;
  minute: number;
}

const HomePage2 = () => {
  const [selectedDate, setSelectedDate] = useState<Value>(new Date());
  const [selectedType, setSelectedType] = useState<
    "temperature" | "light" | "soilMoisture"
  >("temperature");
  const [allTemperatureData, setAllTemperatureData] = useState<SensorData[]>([]);
  const [allLightData, setAllLightData] = useState<SensorData[]>([]);
  const [allSoilMoistureData, setAllSoilMoistureData] = useState<SensorData[]>([]);
  const [currentTemp, setCurrentTemp] = useState<number>(0);
  const [currentLight, setCurrentLight] = useState<number>(0);
  const [currentSoilMoisture, setCurrentSoilMoisture] = useState<number>(0);
  const [startTime, setStartTime] = useState<TimeSelection>({ hour: 0, minute: 0 });
  const [endTime, setEndTime] = useState<TimeSelection>({ hour: 23, minute: 59 });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Generate hours and minutes for selects
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  // Reset time range when date changes
  const handleDateChange = (value: Value) => {
    setSelectedDate(value);
    setStartTime({ hour: 0, minute: 0 });
    setEndTime({ hour: 23, minute: 59 });
  };

  // Fetch all data for the selected date once
  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        // Make sure we have a valid date
        if (!selectedDate) return;
        
        // Set loading state to true
        setIsLoading(true);
        
        const dateToUse = selectedDate instanceof Date ? selectedDate : new Date();
        
        // Get start and end of the selected day
        let dayStart = startOfDay(dateToUse);
        let dayEnd = endOfDay(dateToUse);
        
        // Format with timezone offset +07:00
        const startTimeStr = dayStart.toISOString().replace("Z", "+07:00");
        const endTimeStr = dayEnd.toISOString().replace("Z", "+07:00");
        
        // Encode timestamps for URL
        const startTimeEncoded = encodeURIComponent(startTimeStr);
        const endTimeEncoded = encodeURIComponent(endTimeStr);
        
        // Fetch temperature data
        const temperatureResponse = await fetch(
          `http://localhost:8081/api/v1/data/getDataByTimestamp?user=ngnhan2609@gmail.com&garden_name=Garden1_Nhannt&device_name=Temp Sensor - Garden1_User2&start_time=${startTimeEncoded}&end_time=${endTimeEncoded}`
        );
        const temperatureData = await temperatureResponse.json();
        
        // Format temperature data for the chart
        const formattedTempData = temperatureData.map((item: SensorData) => ({
          ...item,
          day: format(new Date(item.timestamp), "dd/MM HH:mm:ss")
        }));
        
        setAllTemperatureData(formattedTempData);
        
        // Set current temperature from most recent data point
        if (formattedTempData.length > 0) {
          setCurrentTemp(formattedTempData[formattedTempData.length - 1].value);
        }
        
        // Fetch light data
        const lightResponse = await fetch(
          `http://localhost:8081/api/v1/data/getDataByTimestamp?user=user2&garden_name=Garden1_User2&device_name=Light Sensor - Garden1_User2&start_time=${startTimeEncoded}&end_time=${endTimeEncoded}`
        );
        const lightData = await lightResponse.json();
        
        // Format light data for the chart
        const formattedLightData = lightData.map((item: SensorData) => ({
          ...item,
          day: format(new Date(item.timestamp), "dd/MM HH:mm:ss")
        }));
        
        setAllLightData(formattedLightData);
        
        // Set current light from most recent data point
        if (formattedLightData.length > 0) {
          setCurrentLight(formattedLightData[formattedLightData.length - 1].value);
        }
      } catch (error) {
        console.error("Error fetching sensor data:", error);
      } finally {
        // Always set loading to false when done
        setIsLoading(false);
      }
    };
    
    fetchSensorData();
  }, [selectedDate]); // Only re-fetch when date changes

  // Filter data based on selected time range
  const filteredTemperatureData = useMemo(() => {
    if (!selectedDate) return [];
    
    const dateToUse = selectedDate instanceof Date ? selectedDate : new Date();
    
    // Create start and end time boundaries for filtering
    let startDateTime = startOfDay(dateToUse);
    startDateTime = setHours(startDateTime, startTime.hour);
    startDateTime = setMinutes(startDateTime, startTime.minute);
    startDateTime = setSeconds(startDateTime, 0);
    startDateTime = setMilliseconds(startDateTime, 0);
    
    let endDateTime = startOfDay(dateToUse);
    endDateTime = setHours(endDateTime, endTime.hour);
    endDateTime = setMinutes(endDateTime, endTime.minute);
    endDateTime = setSeconds(endDateTime, 59);
    endDateTime = setMilliseconds(endDateTime, 999);
    
    // Filter the data based on time range
    return allTemperatureData.filter(item => {
      const itemDate = new Date(item.timestamp);
      return isWithinInterval(itemDate, { start: startDateTime, end: endDateTime });
    });
  }, [allTemperatureData, selectedDate, startTime, endTime]);

  // Filter light data similarly
  const filteredLightData = useMemo(() => {
    if (!selectedDate) return [];
    
    const dateToUse = selectedDate instanceof Date ? selectedDate : new Date();
    
    // Create start and end time boundaries for filtering
    let startDateTime = startOfDay(dateToUse);
    startDateTime = setHours(startDateTime, startTime.hour);
    startDateTime = setMinutes(startDateTime, startTime.minute);
    startDateTime = setSeconds(startDateTime, 0);
    startDateTime = setMilliseconds(startDateTime, 0);
    
    let endDateTime = startOfDay(dateToUse);
    endDateTime = setHours(endDateTime, endTime.hour);
    endDateTime = setMinutes(endDateTime, endTime.minute);
    endDateTime = setSeconds(endDateTime, 59);
    endDateTime = setMilliseconds(endDateTime, 999);
    
    // Filter the data based on time range
    return allLightData.filter(item => {
      const itemDate = new Date(item.timestamp);
      return isWithinInterval(itemDate, { start: startDateTime, end: endDateTime });
    });
  }, [allLightData, selectedDate, startTime, endTime]);

  // Filter soil moisture data similarly
  const filteredSoilMoistureData = useMemo(() => {
    // Similar implementation for soil moisture data
    return allSoilMoistureData;
  }, [allSoilMoistureData, selectedDate, startTime, endTime]);

  // Setup socket connection
  useEffect(() => {
    socket.connect();
    
    // Listen for temperature updates
    socket.on("temperature sensor", (data) => {
      console.log("Received temperature data:", data);
      
      // Only process if it's from the correct device
      if (data.device_name === "Temp Sensor - Garden1_User2") {
        // Format the new data for the chart
        const newData = {
          timestamp: data.timestamp,
          value: data.value,
          day: format(new Date(data.timestamp), "dd/MM HH:mm:ss"),
        };
        
        // Add to all data
        setAllTemperatureData(prevData => [...prevData, newData]);
        
        // Update current temperature regardless of time filter
        setCurrentTemp(data.value);
      }
    });
    
    // Listen for light updates
    socket.on("light sensor", (data) => {
      console.log("Received light data:", data);
      
      // Only process if it's from the correct device
      if (data.device_name === "Light Sensor - Garden1_User2") {
        // Format the new data for the chart
        const newData = {
          timestamp: data.timestamp,
          value: data.value,
          day: format(new Date(data.timestamp), "dd/MM HH:mm:ss"),
        };
        
        // Add to all data
        setAllLightData(prevData => [...prevData, newData]);
        
        // Update current light value regardless of time filter
        setCurrentLight(data.value);
      }
    });
    
    // Listen for soil moisture updates
    socket.on("soil moisture sensor", (data) => {
      console.log("Received soil moisture data:", data);
      
      // Only process if it's from the correct device
      if (data.device_name === "Soil moisture Sensor - Garden1_User2") {
        // Format the new data for the chart
        const newData = {
          timestamp: data.timestamp,
          value: data.value,
          day: format(new Date(data.timestamp), "dd/MM HH:mm:ss"),
        };
        
        // Add to all data
        setAllSoilMoistureData(prevData => [...prevData, newData]);
        
        // Update current soil moisture value regardless of time filter
        setCurrentSoilMoisture(data.value);
      }
    });
    
    return () => {
      socket.disconnect();
      socket.off("temperature sensor");
      socket.off("light sensor");
      socket.off("soil moisture sensor");
    };
  }, []);

  const getChartData = () => {
    switch (selectedType) {
      case "temperature":
        return filteredTemperatureData;
      case "light":
        return filteredLightData;
      case "soilMoisture":
        return filteredSoilMoistureData;
      default:
        return filteredTemperatureData;
    }
  };

  const getChartTitle = () => {
    switch (selectedType) {
      case "temperature":
        return "Temperature";
      case "light":
        return "Light Intensity";
      case "soilMoisture":
        return "Soil Moisture";
      default:
        return "Temperature";
    }
  };

  const getDataKey = () => {
    switch (selectedType) {
      case "temperature":
        return "value";
      case "light":
        return "value";
      case "soilMoisture":
        return "value";
      default:
        return "value";
    }
  };

  const getUnit = () => {
    switch (selectedType) {
      case "temperature":
        return "°C";
      case "light":
        return "lux";
      case "soilMoisture":
        return "%";
      default:
        return "°C";
    }
  };

  const getCurrentValue = () => {
    switch (selectedType) {
      case "temperature":
        return currentTemp;
      case "light":
        return currentLight;
      case "soilMoisture":
        return currentSoilMoisture;
      default:
        return 0;
    }
  };

  const handleStartHourChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStartTime(prev => ({ ...prev, hour: parseInt(e.target.value) }));
  };

  const handleStartMinuteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStartTime(prev => ({ ...prev, minute: parseInt(e.target.value) }));
  };

  const handleEndHourChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEndTime(prev => ({ ...prev, hour: parseInt(e.target.value) }));
  };

  const handleEndMinuteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEndTime(prev => ({ ...prev, minute: parseInt(e.target.value) }));
  };

  return (
    <div className="bg-container">
      <div className="grid-container">
        <div className="info-cards">
          <div
            className={`info-card ${
              selectedType === "temperature" ? "selected" : ""
            }`}
            style={{
              background:"linear-gradient(270deg, #FFFFFF 0%, rgba(240, 170, 109, 0.5) 50%, #FFFFFF 100%)"
            }}
            onClick={() => setSelectedType("temperature")}
          >
            <FaTemperatureHigh className="icon" />
            <div>
              <p className="info-text">
                Temperature <strong>{currentTemp}°C</strong>
              </p>
              <p className="info-subtext">Today</p>
            </div>
          </div>

          <div
            className={`info-card blue ${
              selectedType === "light" ? "selected" : ""
            }`}
            onClick={() => setSelectedType("light")}
          >
            <FaSun className="icon" />
            <div>
              <p className="info-text">
                Light Intensity <strong>{currentLight} lux</strong>
              </p>
              <p className="info-subtext">Today</p>
            </div>
          </div>

          <div
            className={`info-card green ${
              selectedType === "soilMoisture" ? "selected" : ""
            }`}
            onClick={() => setSelectedType("soilMoisture")}
          >
            <FaTint className="icon" />
            <div>
              <p className="info-text">
                Soil Moisture <strong>{currentSoilMoisture}%</strong>
              </p>
              <p className="info-subtext">Today</p>
            </div>
          </div>
        </div>

        <div className="calendar-container">
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            className="custom-calendar"
            locale="en-US"
          />
        </div>
      </div>
      
      {/* Time selection inputs */}
      <div className="time-selection-container">
        <div className="time-selection">
          <div className="time-group">
            <label>Start Time:</label>
            <div className="time-inputs">
              <select value={startTime.hour} onChange={handleStartHourChange} className="time-select">
                {hours.map(hour => (
                  <option key={`start-hour-${hour}`} value={hour}>
                    {hour.toString().padStart(2, '0')}
                  </option>
                ))}
              </select>
              <span>:</span>
              <select value={startTime.minute} onChange={handleStartMinuteChange} className="time-select">
                {minutes.map(minute => (
                  <option key={`start-minute-${minute}`} value={minute}>
                    {minute.toString().padStart(2, '0')}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="time-group">
            <label>End Time:</label>
            <div className="time-inputs">
              <select value={endTime.hour} onChange={handleEndHourChange} className="time-select">
                {hours.map(hour => (
                  <option key={`end-hour-${hour}`} value={hour}>
                    {hour.toString().padStart(2, '0')}
                  </option>
                ))}
              </select>
              <span>:</span>
              <select value={endTime.minute} onChange={handleEndMinuteChange} className="time-select">
                {minutes.map(minute => (
                  <option key={`end-minute-${minute}`} value={minute}>
                    {minute.toString().padStart(2, '0')}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="chart-container">
        <h3 className="chart-title">{getChartTitle()}</h3>
        {isLoading ? (
          <div className="loading-indicator">
            <div className="spinner"></div>
            <p>Loading data...</p>
          </div>
        ) : getChartData().length === 0 ? (
          <div className="no-data-message">
            <p>No data available for the selected time period</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={getChartData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="day"
                tick={{ fill: "#666", fontSize: 12 }}
                axisLine={{ stroke: "#ddd" }}
              />
              <YAxis
                tick={{ fill: "#666", fontSize: 12 }}
                axisLine={{ stroke: "#ddd" }}
                unit={getUnit()}
              />
              <Tooltip
                cursor={{ stroke: "rgba(243, 86, 155, 0.1)", strokeWidth: 2 }}
                contentStyle={{
                  backgroundColor: "white",
                  border: "none",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
                formatter={(value) => [`${value} ${getUnit()}`, getChartTitle()]}
              />
              <Line
                type="monotone"
                dataKey={getDataKey()}
                stroke="#F3569B"
                strokeWidth={3}
                dot={{ fill: "#F3569B", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: "#F3569B" }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default HomePage2;
