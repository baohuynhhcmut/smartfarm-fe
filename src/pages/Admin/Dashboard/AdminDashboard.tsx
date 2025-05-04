import { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "antd";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import {
  FaUsers,
  FaDev,
  FaChartLine,
  FaExclamationTriangle,
} from "react-icons/fa";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { MdInsertChart } from "react-icons/md";

const API_URL = "http://localhost:8081/api/v1"; // Thay bằng BASE_URL thực tế

interface Device {
  _id: string;
  device_id: string;
  device_name: string;
  feed: string;
  type: string;
  category: string;
  user: string;
  time_on: string | null;
  time_off: string | null;
  is_active: boolean;
  location: {
    garden_name: string;
    latitude: number;
    longitude: number;
  };
  createdAt: string;
  updatedAt: string;
}

const DashboardAdmin = () => {
  const [users, setUsers] = useState([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const token =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2QxOTZmNzQyNzUxZGUzM2UzZjVlN2IiLCJlbWFpbCI6ImFkbWluMSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc0NjI3NTM5OCwiZXhwIjoxNzQ2ODgwMTk4fQ.X02c3cZBHg9W4vaBo0_eqjh8AYpW-1JmFbJvpndLfL4";
        const [userRes, deviceRes] = await Promise.all([
          axios.get(`${API_URL}/user`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_URL}/device/getAllDevice`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setUsers(userRes.data.data || []);
        setDevices(deviceRes.data.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Lỗi khi tải dữ liệu");
        setUsers([]);
        setDevices([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Nếu user không có trường is_active, mặc định tất cả là active
  const totalUsers = {
    active: users.length,
    inactive: 0,
  };

  // Device có trường is_active
  const totalDevices = {
    active: devices.filter((d) => d.is_active).length,
    inactive: devices.filter((d) => !d.is_active).length,
  };

  // Pie chart data
  const userPieData = [
    { name: "Active", value: totalUsers.active },
    { name: "Inactive", value: totalUsers.inactive },
  ];
  const devicePieData = [
    { name: "Active", value: totalDevices.active },
    { name: "Inactive", value: totalDevices.inactive },
  ];

  // Thống kê mẫu cho các card (có thể sửa lại nếu muốn lấy số liệu thực tế)
  const stats = [
    {
      title: "Total Users",
      value: totalUsers.active.toString(),
      icon: <FaUsers className="h-6 w-6 text-blue-500" />,
      change: "+0%",
      changeType: "increase",
      link: "/admin/user",
    },
    {
      title: "Active Devices",
      value: totalDevices.active.toString(),
      icon: <FaDev className="h-6 w-6 text-green-500" />,
      change: "+0%",
      changeType: "increase",
      link: "/admin/device",
    },
    {
      title: "System Health",
      value: "98%",
      icon: <FaChartLine className="h-6 w-6 text-purple-500" />,
      change: "+2%",
      changeType: "increase",
      link: "/admin/analytics",
    },
    {
      title: "Alerts",
      value: "3",
      icon: <FaExclamationTriangle className="h-6 w-6 text-red-500" />,
      change: "-1",
      changeType: "decrease",
      link: "/admin/alerts",
    },
  ];

  // Recent activities mẫu (có thể fetch từ API nếu backend có)
  const recentActivities = [
    {
      user: "John Doe",
      action: "added a new device",
      time: "5 minutes ago",
      type: "device",
    },
    {
      user: "Jane Smith",
      action: "updated user permissions",
      time: "1 hour ago",
      type: "user",
    },
    {
      user: "Mike Johnson",
      action: "configured new sensor",
      time: "2 hours ago",
      type: "device",
    },
    {
      user: "Sarah Williams",
      action: "created new user account",
      time: "3 hours ago",
      type: "user",
    },
  ];

  // Dữ liệu mẫu để hiển thị trục khi chưa có dữ liệu thực
  const emptyChartData = [{ time: "", value: 0 }];

  if (loading) return <div>Đang tải dữ liệu...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => navigate("/admin/user")}>
            Manage Users
          </Button>
          <Button variant="outline" onClick={() => navigate("/admin/device")}>
            Manage Devices
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p
                className={`text-xs ${
                  stat.changeType === "increase"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center text-muted-foreground relative rounded-lg shadow-inner bg-gradient-to-br from-gray-50 to-white border border-dashed border-gray-200">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={emptyChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="time" tick={{ fill: "#b0b0b0" }} />
                  <YAxis tick={{ fill: "#b0b0b0" }} />
                </LineChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 rounded-lg animate-fade-in">
                <MdInsertChart className="text-5xl text-gray-300 mb-2" />
                <span className="text-base font-medium text-gray-500">
                  Chưa có dữ liệu thống kê theo thời gian
                </span>
                <span className="text-xs text-gray-400 mt-1">
                  Dữ liệu sẽ hiển thị khi có hoạt động mới
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Device Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center text-muted-foreground relative rounded-lg shadow-inner bg-gradient-to-br from-gray-50 to-white border border-dashed border-gray-200">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={emptyChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="time" tick={{ fill: "#b0b0b0" }} />
                  <YAxis tick={{ fill: "#b0b0b0" }} />
                </LineChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 rounded-lg animate-fade-in">
                <MdInsertChart className="text-5xl text-gray-300 mb-2" />
                <span className="text-base font-medium text-gray-500">
                  Chưa có dữ liệu thống kê theo thời gian
                </span>
                <span className="text-xs text-gray-400 mt-1">
                  Dữ liệu sẽ hiển thị khi có hoạt động mới
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userPieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {userPieData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === 0 ? "#52c41a" : "#ff4d4f"}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Device Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={devicePieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {devicePieData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === 0 ? "#13c2c2" : "#ff4d4f"}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div
                    className={`p-2 rounded-full ${
                      activity.type === "user" ? "bg-blue-100" : "bg-green-100"
                    }`}
                  >
                    {activity.type === "user" ? (
                      <FaUsers className="h-4 w-4 text-blue-500" />
                    ) : (
                      <FaDev className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      <span className="font-semibold">{activity.user}</span>{" "}
                      {activity.action}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center justify-center gap-2"
                onClick={() => navigate("/admin/user")}
              >
                <FaUsers className="h-6 w-6" />
                <span>Add New User</span>
              </Button>
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center justify-center gap-2"
                onClick={() => navigate("/admin/device")}
              >
                <FaDev className="h-6 w-6" />
                <span>Add New Device</span>
              </Button>
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center justify-center gap-2"
                onClick={() => navigate("/admin/analytics")}
              >
                <FaChartLine className="h-6 w-6" />
                <span>View Analytics</span>
              </Button>
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center justify-center gap-2"
                onClick={() => navigate("/admin/alerts")}
              >
                <FaExclamationTriangle className="h-6 w-6" />
                <span>Check Alerts</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardAdmin;
