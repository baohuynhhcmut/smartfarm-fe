import { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FaTemperatureHigh, FaSun, FaTint } from "react-icons/fa";
import "./HomePage2.css";

type Value = Date | null | [Date | null, Date | null];

const HomePage2 = () => {
  const [selectedDate, setSelectedDate] = useState<Value>(new Date());

  const temperatureData = Array.from({ length: 24 }, (_, i) => ({
    day: `${i + 1}`,
    temp: Math.floor(Math.random() * 400) + 50,
  }));

  return (
    <div className="bg-[#FEF4FF] h-screen flex flex-col items-center justify-between">
      {/* Hàng chứa thông tin và lịch */}
      <div className="grid grid-cols-1 md:grid-cols-4 max-w-6xl w-full ">
        {/* Cột trái - Các thẻ thông tin */}
        <div className="flex flex-col gap-4 col-span-3">
          <div className="info-card gray">
            <FaTemperatureHigh className="icon" />
            <div>
              <p className="info-text">
                Temperature <strong>30°C</strong>
              </p>
              <p className="info-subtext">Today</p>
            </div>
          </div>

          <div className="info-card blue">
            <FaSun className="icon" />
            <div>
              <p className="info-text">
                Light Intensity <strong>15 lux</strong>
              </p>
              <p className="info-subtext">Today</p>
            </div>
          </div>

          <div className="info-card green">
            <FaTint className="icon" />
            <div>
              <p className="info-text">
                Humidity <strong>75%</strong>
              </p>
              <p className="info-subtext">Today</p>
            </div>
          </div>
        </div>

        {/* Cột phải - Lịch (dịch sang phải hơn) */}
        <div className="calendar-container flex items-center justify-end col-span-1">
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            className="custom-calendar"
            locale="en-US"
          />
        </div>
      </div>

      {/* Biểu đồ nhiệt độ */}
      <div className="chart-container max-w-6xl w-full h-1/2">
        <h3 className="chart-title">Temperature</h3>
        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={temperatureData}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip
              cursor={{ fill: "transparent" }}
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #ddd",
                borderRadius: "5px",
              }}
            />
            <Bar dataKey="temp" fill="#F3569B" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HomePage2;
