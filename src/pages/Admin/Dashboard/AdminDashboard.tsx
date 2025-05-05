import { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "antd";
import {
  ResponsiveContainer,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
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

const API_URL = "http://localhost:8081/api/v1";

interface User {
  _id: string;
  email: string;
  name: string;
  role: string;
  phone_number?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
  };
  gardens?: Array<{
    _id: string;
    name: string;
    latitude: number;
    longitude: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

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

interface DeviceStats {
  total: number;
  active: number;
  inactive: number;
  byCategory: {
    sensor: number;
    device: number;
  };
  byType: {
    [key: string]: number;
  };
}

interface UserActivity {
  user: string;
  action: "created" | "deleted";
  time: string;
  role: string;
}

// Add type definition for window object
declare global {
  interface Window {
    handleUserDeletion: (user: { name: string; role: string }) => void;
  }
}

const DashboardAdmin = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deviceCategoryData, setDeviceCategoryData] = useState<
    Array<{ name: string; value: number }>
  >([]);
  const [userRoleData, setUserRoleData] = useState<
    Array<{ name: string; value: number }>
  >([]);
  const [deviceStats, setDeviceStats] = useState<DeviceStats>({
    total: 0,
    active: 0,
    inactive: 0,
    byCategory: {
      sensor: 0,
      device: 0,
    },
    byType: {},
  });
  const [recentActivities, setRecentActivities] = useState<UserActivity[]>([]);
  const navigate = useNavigate();

  const addActivity = (activity: UserActivity) => {
    setRecentActivities((prev) => {
      const newActivities = [activity, ...prev];
      // Sort activities by timestamp in descending order (newest first)
      return newActivities
        .sort((a, b) => {
          const timeA = new Date(a.time).getTime();
          const timeB = new Date(b.time).getTime();
          return timeB - timeA;
        })
        .slice(0, 5); // Keep only the 5 most recent activities
    });
  };

  // Function to handle user deletion activity
  const handleUserDeletion = (user: { name: string; role: string }) => {
    addActivity({
      user: user.name,
      action: "deleted",
      time: new Date().toLocaleString(),
      role: user.role,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const token =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2QxOTZmNzQyNzUxZGUzM2UzZjVlN2IiLCJlbWFpbCI6ImFkbWluMSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc0NjI3NTM5OCwiZXhwIjoxNzQ2ODgwMTk4fQ.X02c3cZBHg9W4vaBo0_eqjh8AYpW-1JmFbJvpndLfL4";
        const [userRes, deviceRes, deviceActiveRes, deviceInactiveRes] =
          await Promise.all([
            axios.get(`${API_URL}/user`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`${API_URL}/device/getAllDevice`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`${API_URL}/device/getDeviceByIsActive?is_active=true`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`${API_URL}/device/getDeviceByIsActive?is_active=false`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);
        setUsers(userRes.data.data || []);

        // Thống kê user theo role
        const roleStats: { [role: string]: number } = {};
        (userRes.data.data || []).forEach((u: User) => {
          const role = u.role || "unknown";
          roleStats[role] = (roleStats[role] || 0) + 1;
        });

        // Cập nhật dữ liệu cho biểu đồ user role
        const userRoleData = Object.entries(roleStats).map(([role, value]) => ({
          name: role,
          value,
        }));
        setUserRoleData(userRoleData);

        // Thống kê device
        const deviceStats: DeviceStats = {
          total: deviceRes.data.data?.length || 0,
          active: deviceActiveRes.data.data?.length || 0,
          inactive: deviceInactiveRes.data.data?.length || 0,
          byCategory: {
            sensor: 0,
            device: 0,
          },
          byType: {},
        };

        // Thống kê theo category và type
        (deviceRes.data.data || []).forEach((d: Device) => {
          // Thống kê theo category
          if (d.category === "sensor") {
            deviceStats.byCategory.sensor++;
          } else if (d.category === "device") {
            deviceStats.byCategory.device++;
          }

          // Thống kê theo type
          const type = d.type || "unknown";
          deviceStats.byType[type] = (deviceStats.byType[type] || 0) + 1;
        });

        setDeviceStats(deviceStats);

        // Cập nhật dữ liệu cho biểu đồ device category
        const deviceCategoryData = [
          { name: "Sensors", value: deviceStats.byCategory.sensor },
          { name: "Devices", value: deviceStats.byCategory.device },
        ];
        setDeviceCategoryData(deviceCategoryData);

        // Tạo recent activities từ danh sách users
        const activities: UserActivity[] = (userRes.data.data || [])
          .sort(
            (a: User, b: User) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 5)
          .map((user: User) => ({
            user: user.name || user.email,
            action: "created",
            time: new Date(user.createdAt).toLocaleString(),
            role: user.role,
          }));

        // Thêm các activities vào state
        activities.forEach((activity) => addActivity(activity));
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Lỗi khi tải dữ liệu");
        setUsers([]);
        setUserRoleData([]);
        setDeviceCategoryData([]);
        setDeviceStats({
          total: 0,
          active: 0,
          inactive: 0,
          byCategory: {
            sensor: 0,
            device: 0,
          },
          byType: {},
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Add useEffect to monitor recentActivities changes
  useEffect(() => {
    console.log("Recent activities updated:", recentActivities);
  }, [recentActivities]);

  // Export handleUserDeletion function
  window.handleUserDeletion = handleUserDeletion;

  // Tổng user
  const totalUsers = users.length;

  // Thống kê mẫu cho các card
  const stats = [
    {
      title: "Total Users",
      value: totalUsers.toString(),
      icon: <FaUsers className="h-6 w-6 text-blue-500" />,
      change: "+0%",
      changeType: "increase",
      link: "/admin/user",
    },
    {
      title: "Total Devices",
      value: deviceStats.total.toString(),
      icon: <FaDev className="h-6 w-6 text-green-500" />,
      change: "+0%",
      changeType: "increase",
      link: "/admin/device",
    },
    {
      title: "Active Devices",
      value: deviceStats.active.toString(),
      icon: <FaChartLine className="h-6 w-6 text-purple-500" />,
      change: "+0%",
      changeType: "increase",
      link: "/admin/device",
    },
    {
      title: "Inactive Devices",
      value: deviceStats.inactive.toString(),
      icon: <FaExclamationTriangle className="h-6 w-6 text-red-500" />,
      change: "+0%",
      changeType: "decrease",
      link: "/admin/device",
    },
  ];

  if (loading) return <div>Đang tải dữ liệu...</div>;
  if (error) return <div>{error}</div>;
  if (deviceStats.total === 0) {
    return (
      <div
        className="flex items-center justify-center min-h-[60vh]"
        style={{ backgroundColor: "#FEF4FF" }}
      >
        <div className="text-center">
          <p className="text-xl font-semibold text-gray-500">
            Hiện tại chưa có thiết bị nào.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="space-y-8 p-8 min-h-screen"
      style={{ backgroundColor: "#FEF4FF" }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-extrabold text-green-700 tracking-wide uppercase">
          Dashboard Overview
        </h1>
        <div className="flex gap-4">
          <Button
            variant="outline"
            className="border-green-600 text-green-700 hover:bg-green-50"
            onClick={() => navigate("/admin/users")}
          >
            Manage Users
          </Button>
          <Button
            variant="outline"
            className="border-green-600 text-green-700 hover:bg-green-50"
            onClick={() => navigate("/admin/devices")}
          >
            Manage Devices
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold text-gray-500 uppercase tracking-wide">
                {stat.title}
              </CardTitle>
              <div className="rounded-full bg-green-50 p-2">{stat.icon}</div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-green-700 mb-1">
                {stat.value}
              </div>
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

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-8">
        <Card className="rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-green-700 uppercase tracking-wide">
              User Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userRoleData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={90}
                    fill="#34d399"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {userRoleData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          ["#34d399", "#10b981", "#22d3ee", "#60a5fa"][
                            index % 4
                          ]
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "0.5rem",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-green-700 uppercase tracking-wide">
              Device Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceCategoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={90}
                    fill="#60a5fa"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {deviceCategoryData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          ["#60a5fa", "#22d3ee", "#34d399", "#10b981"][
                            index % 4
                          ]
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "0.5rem",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card className="rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 mb-8">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-green-700 uppercase tracking-wide">
            Recent Activities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 rounded-xl hover:bg-green-50 transition-colors duration-200 border border-gray-100"
              >
                <div
                  className={`p-2 rounded-full ${
                    activity.action === "created"
                      ? "bg-green-100"
                      : "bg-red-100"
                  }`}
                >
                  {activity.action === "created" ? (
                    <FaUsers className="h-5 w-5 text-green-500" />
                  ) : (
                    <FaUsers className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-base font-semibold text-gray-800">
                    <span className="font-bold text-green-700">
                      {activity.user}
                    </span>{" "}
                    {activity.action === "created"
                      ? "was created"
                      : "was deleted"}
                  </p>
                  <p className="text-xs text-gray-500">
                    Role: {activity.role} | {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Device Type Distribution */}
      <Card className="rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 mt-12">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-green-700 uppercase tracking-wide">
            Device Type Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {Object.entries(deviceStats.byType).map(([type, count], index) => (
              <div
                key={index}
                className="p-8 rounded-xl hover:bg-green-100 transition-colors duration-200 border border-green-100 flex flex-col items-center text-center"
              >
                <h3 className="text-base font-semibold text-green-700 capitalize mb-2">
                  {type.replace(/_/g, " ")}
                </h3>
                <p className="text-3xl font-extrabold text-green-700 mt-2">
                  {count}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {((count / deviceStats.total) * 100).toFixed(1)}% of total
                  devices
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardAdmin;
