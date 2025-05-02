import { getWithToken, postWithToken } from "@/utils/api";
import { getToken } from "@/utils/token";

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

export const adminApi = {
  
  // Lấy danh sách users
  getAllUsers: async () => {
    try {
      const token = getToken();
      if (!token) throw new Error("No token found");

      const response = await getWithToken("user", token);
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  // Tạo user mới
  createUser: async (userData: {
    name: string;
    email: string;
    password: string;
    role: "admin" | "user";
    status: "active" | "inactive" | "pending";
    address: string;
    phone?: string;
  }) => {
    try {
      const token = getToken();
      if (!token) throw new Error("No token found");

      const response = await postWithToken("user/create", userData, token);
      return response.data;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },
};
