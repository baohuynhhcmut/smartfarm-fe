import { useState } from "react";
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

type Value = Date | null | [Date | null, Date | null];

const HomePage2 = () => {
  const [selectedDate, setSelectedDate] = useState<Value>(new Date());
  const [selectedType, setSelectedType] = useState<
    "temperature" | "light" | "humidity"
  >("temperature");

  const temperatureData = Array.from({ length: 24 }, (_, i) => ({
    day: `${i + 1}`,
    temp: Math.floor(Math.random() * 400) + 50,
  }));

  const lightData = Array.from({ length: 24 }, (_, i) => ({
    day: `${i + 1}`,
    light: Math.floor(Math.random() * 1000) + 100,
  }));

  const humidityData = Array.from({ length: 24 }, (_, i) => ({
    day: `${i + 1}`,
    humidity: Math.floor(Math.random() * 50) + 30,
  }));

  const getChartData = () => {
    switch (selectedType) {
      case "temperature":
        return temperatureData;
      case "light":
        return lightData;
      case "humidity":
        return humidityData;
      default:
        return temperatureData;
    }
  };

  const getChartTitle = () => {
    switch (selectedType) {
      case "temperature":
        return "Temperature";
      case "light":
        return "Light Intensity";
      case "humidity":
        return "Humidity";
      default:
        return "Temperature";
    }
  };

  const getDataKey = () => {
    switch (selectedType) {
      case "temperature":
        return "temp";
      case "light":
        return "light";
      case "humidity":
        return "humidity";
      default:
        return "temp";
    }
  };

  const getUnit = () => {
    switch (selectedType) {
      case "temperature":
        return "°C";
      case "light":
        return "lux";
      case "humidity":
        return "%";
      default:
        return "°C";
    }
  };

  return (
    <div className="bg-container">
      <div className="grid-container">
        <div className="info-cards">
          <div
            className={`info-card gray ${
              selectedType === "temperature" ? "selected" : ""
            }`}
            onClick={() => setSelectedType("temperature")}
          >
            <FaTemperatureHigh className="icon" />
            <div>
              <p className="info-text">
                Temperature <strong>30°C</strong>
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
                Light Intensity <strong>15 lux</strong>
              </p>
              <p className="info-subtext">Today</p>
            </div>
          </div>

          <div
            className={`info-card green ${
              selectedType === "humidity" ? "selected" : ""
            }`}
            onClick={() => setSelectedType("humidity")}
          >
            <FaTint className="icon" />
            <div>
              <p className="info-text">
                Humidity <strong>75%</strong>
              </p>
              <p className="info-subtext">Today</p>
            </div>
          </div>
        </div>

        <div className="calendar-container">
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            className="custom-calendar"
            locale="en-US"
          />
        </div>
      </div>

      <div className="chart-container">
        <h3 className="chart-title">{getChartTitle()}</h3>
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
      </div>
    </div>
  );
};

export default HomePage2;
