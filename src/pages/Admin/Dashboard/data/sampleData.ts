export interface ActivityRecord {
  user: string;
  action: string;
  time: string;
  status: "active" | "inactive";
}

export interface UserData {
  date: string;
  active: number;
  inactive: number;
}

export interface DeviceData {
  date: string;
  active: number;
  inactive: number;
}

export const userData: UserData[] = [
  { date: "20255-03-15", active: 120, inactive: 30 },
  { date: "20255-03-14", active: 118, inactive: 32 },
  { date: "20255-03-13", active: 115, inactive: 35 },
  { date: "20255-03-12", active: 112, inactive: 38 },
  { date: "20255-03-11", active: 110, inactive: 40 },
  { date: "20255-03-10", active: 108, inactive: 42 },
  { date: "20255-03-09", active: 105, inactive: 45 },
  { date: "20255-03-08", active: 102, inactive: 48 },
  { date: "20255-03-07", active: 100, inactive: 50 },
  { date: "2025-03-06", active: 98, inactive: 52 },
  { date: "2025-03-05", active: 95, inactive: 55 },
  { date: "2025-03-04", active: 92, inactive: 58 },
];

export const deviceData: DeviceData[] = [
  { date: "2025-03-15", active: 85, inactive: 15 },
  { date: "2025-03-14", active: 83, inactive: 17 },
  { date: "2025-03-13", active: 82, inactive: 18 },
  { date: "2025-03-12", active: 80, inactive: 20 },
  { date: "2025-03-11", active: 78, inactive: 22 },
  { date: "2025-03-10", active: 75, inactive: 25 },
  { date: "2025-03-09", active: 72, inactive: 28 },
  { date: "2025-03-08", active: 70, inactive: 30 },
  { date: "2025-03-07", active: 68, inactive: 32 },
  { date: "2025-03-06", active: 65, inactive: 35 },
  { date: "2025-03-05", active: 62, inactive: 38 },
  { date: "2025-03-04", active: 60, inactive: 40 },
];

export const recentActivities: ActivityRecord[] = [
  {
    user: "John Doe",
    action: "Logged in",
    time: "2025-03-15 14:30",
    status: "active",
  },
  {
    user: "Temperature Sensor #1",
    action: "Data update",
    time: "2025-03-15 14:25",
    status: "active",
  },
  {
    user: "Humidity Sensor #2",
    action: "Data update",
    time: "2025-03-15 14:20",
    status: "active",
  },
  {
    user: "Jane Smith",
    action: "Logged out",
    time: "2025-03-15 14:15",
    status: "inactive",
  },
  {
    user: "Water Pump #1",
    action: "Status change",
    time: "2025-03-15 14:10",
    status: "active",
  },
  {
    user: "Light Control #1",
    action: "Status change",
    time: "2025-03-15 14:05",
    status: "inactive",
  },
  {
    user: "Mike Johnson",
    action: "Logged in",
    time: "2025-03-15 14:00",
    status: "active",
  },
  {
    user: "Soil Moisture Sensor #1",
    action: "Data update",
    time: "2025-03-15 13:55",
    status: "active",
  },
  {
    user: "Sarah Wilson",
    action: "Logged out",
    time: "2025-03-15 13:50",
    status: "inactive",
  },
  {
    user: "Fan Control #1",
    action: "Status change",
    time: "2025-03-15 13:45",
    status: "active",
  },
];
