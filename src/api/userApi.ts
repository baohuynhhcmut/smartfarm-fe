import axios from "axios";

// Tạo instance axios với base URL
const api = axios.create({
  baseURL: "http://your-api-url/api", // Thay đổi URL này thành URL của API của bạn
  headers: {
    "Content-Type": "application/json",
  },
});

// Interface cho User
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  status: "active" | "inactive" | "pending";
  createdAt: string;
  lastLogin?: string;
  address: string;
  phone?: string;
  deviceCount: number;
  gardenCount: number;
}

// Các hàm gọi API
export const userApi = {
  // Lấy danh sách users
  getAllUsers: async () => {
    const response = await api.get<User[]>("/users");
    return response.data;
  },

  // Tạo user mới
  createUser: async (user: Omit<User, "id" | "createdAt">) => {
    const response = await api.post<User>("/users", user);
    return response.data;
  },

  // Cập nhật user
  updateUser: async (id: string, user: Partial<User>) => {
    const response = await api.put<User>(`/users/${id}`, user);
    return response.data;
  },

  // Xóa user
  deleteUser: async (id: string) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};
