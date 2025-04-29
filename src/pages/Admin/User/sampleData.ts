export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "manager";
  status: "active" | "inactive" | "pending";
  createdAt: string;
  lastLogin?: string;
  department?: string;
  phone?: string;
}

export const sampleUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "admin",
    status: "active",
    createdAt: "2024-01-01",
    lastLogin: "2024-03-15",
    department: "IT",
    phone: "+1234567890",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "user",
    status: "active",
    createdAt: "2024-01-02",
    lastLogin: "2024-03-14",
    department: "HR",
    phone: "+1234567891",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@example.com",
    role: "manager",
    status: "active",
    createdAt: "2024-01-03",
    lastLogin: "2024-03-13",
    department: "Sales",
    phone: "+1234567892",
  },
  {
    id: "4",
    name: "Sarah Williams",
    email: "sarah@example.com",
    role: "user",
    status: "inactive",
    createdAt: "2024-01-04",
    lastLogin: "2024-02-15",
    department: "Marketing",
    phone: "+1234567893",
  },
  {
    id: "5",
    name: "David Brown",
    email: "david@example.com",
    role: "user",
    status: "pending",
    createdAt: "2024-01-05",
    department: "Finance",
    phone: "+1234567894",
  },
  {
    id: "6",
    name: "Emily Davis",
    email: "emily@example.com",
    role: "manager",
    status: "active",
    createdAt: "2024-01-06",
    lastLogin: "2024-03-12",
    department: "Operations",
    phone: "+1234567895",
  },
  {
    id: "7",
    name: "Robert Wilson",
    email: "robert@example.com",
    role: "user",
    status: "active",
    createdAt: "2024-01-07",
    lastLogin: "2024-03-11",
    department: "IT",
    phone: "+1234567896",
  },
  {
    id: "8",
    name: "Lisa Anderson",
    email: "lisa@example.com",
    role: "user",
    status: "inactive",
    createdAt: "2024-01-08",
    lastLogin: "2024-02-10",
    department: "HR",
    phone: "+1234567897",
  },
  {
    id: "9",
    name: "James Taylor",
    email: "james@example.com",
    role: "manager",
    status: "active",
    createdAt: "2024-01-09",
    lastLogin: "2024-03-10",
    department: "Sales",
    phone: "+1234567898",
  },
  {
    id: "10",
    name: "Mary Martinez",
    email: "mary@example.com",
    role: "user",
    status: "pending",
    createdAt: "2024-01-10",
    department: "Marketing",
    phone: "+1234567899",
  },
];
