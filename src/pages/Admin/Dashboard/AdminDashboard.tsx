import { useState } from "react";
import { Card } from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { userData, deviceData } from "./data/sampleData";
import {
  FaUsers,
  FaDev,
  FaChartLine,
  FaExclamationTriangle,
} from "react-icons/fa";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const DashboardAdmin = () => {
  const [filteredUserData] = useState(userData);
  const [filteredDeviceData] = useState(deviceData);
  const navigate = useNavigate();

  const totalUsers = {
    active: filteredUserData.reduce((sum, item) => sum + item.active, 0),
    inactive: filteredUserData.reduce((sum, item) => sum + item.inactive, 0),
  };

  const totalDevices = {
    active: filteredDeviceData.reduce((sum, item) => sum + item.active, 0),
    inactive: filteredDeviceData.reduce((sum, item) => sum + item.inactive, 0),
  };

  const userPieData = [
    { name: "Active", value: totalUsers.active },
    { name: "Inactive", value: totalUsers.inactive },
  ];

  const devicePieData = [
    { name: "Active", value: totalDevices.active },
    { name: "Inactive", value: totalDevices.inactive },
  ];

  const stats = [
    {
      title: "Total Users",
      value: "1,234",
      icon: <FaUsers className="h-6 w-6 text-blue-500" />,
      change: "+12%",
      changeType: "increase",
      link: "/admin/user",
    },
    {
      title: "Active Devices",
      value: "567",
      icon: <FaDev className="h-6 w-6 text-green-500" />,
      change: "+8%",
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
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredUserData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => {
                      const [year, month] = value.split("-");
                      return `${month}/${year}`;
                    }}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="active"
                    stroke="#52c41a"
                    name="Active Users"
                  />
                  <Line
                    type="monotone"
                    dataKey="inactive"
                    stroke="#ff4d4f"
                    name="Inactive Users"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Device Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredDeviceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => {
                      const [year, month] = value.split("-");
                      return `${month}/${year}`;
                    }}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="active"
                    stroke="#13c2c2"
                    name="Active Devices"
                  />
                  <Line
                    type="monotone"
                    dataKey="inactive"
                    stroke="#ff4d4f"
                    name="Inactive Devices"
                  />
                </LineChart>
              </ResponsiveContainer>
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
