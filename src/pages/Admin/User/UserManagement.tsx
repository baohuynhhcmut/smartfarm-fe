import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { FaUserPlus, FaEdit, FaTrash, FaEye, FaTree } from "react-icons/fa";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getAllUser } from "@/api/admin/user";

// API URL của backend
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
  threshold: {
    min: number;
    max: number;
  };
}

interface Garden {
  _id: string;
  name: string;
  latitude: number;
  longitude: number;
}

interface UserData {
  status: number;
  message: string;
  data: User[];
}

const UserPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [filterRole, setFilterRole] = useState<string>("all");
  const [sortField, setSortField] = useState<keyof User>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [newUser, setNewUser] = useState<Partial<User>>({
    name: "",
    email: "",
    role: "USER",
    phone_number: "",
    address: {
      street: "",
      city: "",
      state: "",
    },
  });
  const [isViewDevicesDialogOpen, setIsViewDevicesDialogOpen] = useState(false);
  const [userDevices, setUserDevices] = useState<Device[]>([]);
  const [inlineMessage, setInlineMessage] = useState<string | null>(null);
  const [inlineMessageType, setInlineMessageType] = useState<
    "info" | "error" | null
  >(null);
  const [isNoDeviceDialogOpen, setIsNoDeviceDialogOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [isViewGardensDialogOpen, setIsViewGardensDialogOpen] = useState(false);
  const [userGardens, setUserGardens] = useState<Garden[]>([]);
  const [isNoGardenDialogOpen, setIsNoGardenDialogOpen] = useState(false);
  const [isEditGardenDialogOpen, setIsEditGardenDialogOpen] = useState(false);
  const [isDeleteGardenDialogOpen, setIsDeleteGardenDialogOpen] =
    useState(false);
  const [selectedGarden, setSelectedGarden] = useState<Garden | null>(null);
  const [editedGarden, setEditedGarden] = useState<Partial<Garden>>({});
  const [userData, setUserData] = useState<UserData | null>(null);

  const handleTokenError = () => {
    // Xóa token khi hết hạn hoặc không hợp lệ
    localStorage.removeItem("token");
    // Chuyển về trang login
    window.location.href = "/login";
  };

  const handleApiError = useCallback((err: unknown) => {
    if (axios.isAxiosError(err)) {
      if (err.response?.status === 401) {
        // Token hết hạn hoặc không hợp lệ
        toast.error("Session expired. Please login again");
        handleTokenError();
      } else if (err.response?.status === 403) {
        // Token không có quyền thực hiện hành động
        toast.error("You don't have permission to perform this action");
      } else {
        toast.error(err.response?.data?.message || "Operation failed");
      }
    } else {
      toast.error("An unexpected error occurred");
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2QxOTZmNzQyNzUxZGUzM2UzZjVlN2IiLCJlbWFpbCI6ImFkbWluMSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc0NjI3NTM5OCwiZXhwIjoxNzQ2ODgwMTk4fQ.X02c3cZBHg9W4vaBo0_eqjh8AYpW-1JmFbJvpndLfL4";

      const response = await axios.get(`${API_URL}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Raw API Response:", response);

      const usersData = response.data.data || [];
      console.log("Users data:", usersData);

      setUsers(usersData);
    } catch (err) {
      console.error("Error fetching users:", err);
      handleApiError(err);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [handleApiError]);

  useEffect(() => {
    console.log("Current users state:", users);
  }, [users]);

  useEffect(() => {
    console.log("Component mounted, fetching users...");
    fetchUsers();
  }, [fetchUsers]);

  const validateForm = (user: Partial<User>, isEdit = false) => {
    const errors: Record<string, string> = {};
    if (!user.name) errors.name = "Name is required";
    if (!user.email) errors.email = "Email is required";
    else if (!isEdit && !/\S+@\S+\.\S+/.test(user.email))
      errors.email = "Invalid email format";
    if (!user.role && !isEdit) errors.role = "Role is required";
    if (user.phone_number) {
      const phoneNumber = user.phone_number.replace(/\D/g, "");
      if (phoneNumber.length !== 10) {
        errors.phone_number = "Phone number must be exactly 10 digits";
      }
    }
    if (!user.address?.street) errors.street = "Street is required";
    if (!user.address?.city) errors.city = "City is required";
    if (!user.address?.state) errors.state = "State is required";
    return errors;
  };

  const handleAddUser = async () => {
    const errors = validateForm(newUser, false);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2QxOTZmNzQyNzUxZGUzM2UzZjVlN2IiLCJlbWFpbCI6ImFkbWluMSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc0NjI3NTM5OCwiZXhwIjoxNzQ2ODgwMTk4fQ.X02c3cZBHg9W4vaBo0_eqjh8AYpW-1JmFbJvpndLfL4";

      const userData = {
        email: newUser.email,
        password: "123456",
        name: newUser.name,
        phone_number: newUser.phone_number,
        street: newUser.address?.street || "",
        city: newUser.address?.city || "",
        state: newUser.address?.state || "",
        latitude: 10.862624, // Giá trị mặc định
        longitude: 106.795492, // Giá trị mặc định
      };

      console.log("Sending user data:", userData);

      const response = await axios.post(`${API_URL}/user/register`, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Add user response:", response.data);

      if (response.data && response.data.data) {
        const newUserData = {
          ...response.data.data,
          gardens: [],
        };
        setUsers([...users, newUserData]);
        setIsAddDialogOpen(false);
        setNewUser({
          name: "",
          email: "",
          role: "USER",
          phone_number: "",
          address: {
            street: "",
            city: "",
            state: "",
          },
        });
        setFormErrors({});
        toast.success("User added successfully");
      } else {
        console.error("Invalid response format:", response.data);
        toast.error("Failed to add user: Invalid response format");
      }
    } catch (err) {
      console.error("Error adding user:", err);
      if (axios.isAxiosError(err)) {
        console.error("Error response:", err.response?.data);
        console.error("Error status:", err.response?.status);
        console.error("Error headers:", err.response?.headers);

        if (err.response?.status === 400) {
          toast.error(err.response?.data?.message || "Invalid user data");
        } else if (err.response?.status === 404) {
          toast.error("Endpoint does not exist");
        } else {
          toast.error(err.response?.data?.message || "Failed to add user");
        }
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  const handleEditUser = async () => {
    console.log("handleEditUser called", selectedUser);
    if (!selectedUser) {
      toast.error("No user selected for editing!");
      return;
    }

    const errors = validateForm(selectedUser, true);
    if (Object.keys(errors).length > 0) {
      console.log("Edit user validate errors:", errors);
      setFormErrors(errors);
      return;
    }

    try {
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2QxOTZmNzQyNzUxZGUzM2UzZjVlN2IiLCJlbWFpbCI6ImFkbWluMSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc0NjI3NTM5OCwiZXhwIjoxNzQ2ODgwMTk4fQ.X02c3cZBHg9W4vaBo0_eqjh8AYpW-1JmFbJvpndLfL4";

      const userData = {
        email: selectedUser.email,
        name: selectedUser.name,
        phone_number: selectedUser.phone_number,
        street: selectedUser.address?.street || "",
        city: selectedUser.address?.city || "",
        state: selectedUser.address?.state || "",
      };

      // Show success dialog immediately
      setIsSuccessDialogOpen(true);

      console.log("PATCH updateUserInfo body:", userData);
      const response = await axios.patch(
        `${API_URL}/user/updateUserInfo`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("PATCH updateUserInfo response:", response.data);

      if (
        response.data &&
        (response.data.status === 200 || response.data.status === "success")
      ) {
        // Update the users list with the new data
        setUsers(
          users.map((user) =>
            user.email === selectedUser.email
              ? {
                  ...user,
                  name: selectedUser.name,
                  phone_number: selectedUser.phone_number,
                  address: {
                    ...user.address,
                    street: selectedUser.address?.street || "",
                    city: selectedUser.address?.city || "",
                    state: selectedUser.address?.state || "",
                  },
                }
              : user
          )
        );

        // Close the edit dialog and reset states
        setIsEditDialogOpen(false);
        setSelectedUser(null);
        setFormErrors({});
      } else {
        toast.error(response.data?.message || "Failed to update user");
        console.error("Update user failed, response:", response.data);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Failed to update user");
        console.error("Axios error updating user:", err.response?.data);
      } else {
        toast.error("An unexpected error occurred");
        console.error("Unexpected error updating user:", err);
      }
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2QxOTZmNzQyNzUxZGUzM2UzZjVlN2IiLCJlbWFpbCI6ImFkbWluMSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc0NjI3NTM5OCwiZXhwIjoxNzQ2ODgwMTk4fQ.X02c3cZBHg9W4vaBo0_eqjh8AYpW-1JmFbJvpndLfL4";

      console.log("Deleting user with email:", selectedUser.email);

      const response = await axios.delete(`${API_URL}/user/deleteUser`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: {
          email: selectedUser.email,
        },
      });

      console.log("Delete response:", response.data);

      if (response.data && response.data.status === 200) {
        setUsers(users.filter((user) => user.email !== selectedUser.email));
        setIsDeleteDialogOpen(false);
        setSelectedUser(null);
        toast.success(response.data.message || "User deleted successfully");
      } else {
        console.error("Invalid response format:", response.data);
        toast.error("Failed to delete user: Invalid response format");
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      if (axios.isAxiosError(err)) {
        console.error("Error response:", err.response?.data);
        console.error("Error status:", err.response?.status);
        console.error("Error headers:", err.response?.headers);

        if (err.response?.status === 400) {
          toast.error(err.response?.data?.message || "User not found");
        } else if (err.response?.status === 404) {
          toast.error("Endpoint does not exist");
        } else {
          toast.error(err.response?.data?.message || "Failed to delete user");
        }
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  const handleSort = (field: keyof User) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredUsers = users
    .filter((user) => {
      const searchTermLower = searchTerm.toLowerCase();
      const matchesSearch =
        (user.name?.toLowerCase() || "").includes(searchTermLower) ||
        (user.email?.toLowerCase() || "").includes(searchTermLower) ||
        (user.address?.street?.toLowerCase() || "").includes(searchTermLower) ||
        (user.role?.toLowerCase() || "").includes(searchTermLower) ||
        (user.phone_number?.toLowerCase() || "").includes(searchTermLower);

      const matchesRole = filterRole === "all" || user.role === filterRole;

      return matchesSearch && matchesRole;
    })
    .sort((a, b) => {
      let aValue: string | number = "";
      let bValue: string | number = "";

      if (sortField === "address") {
        aValue = a.address?.street || "";
        bValue = b.address?.street || "";
      } else if (sortField === "role") {
        aValue = a.role || "";
        bValue = b.role || "";
      } else {
        const value = a[sortField as keyof User];
        aValue =
          typeof value === "string" || typeof value === "number" ? value : "";
        const value2 = b[sortField as keyof User];
        bValue =
          typeof value2 === "string" || typeof value2 === "number"
            ? value2
            : "";
      }

      if (aValue === bValue) return 0;
      const comparison = aValue < bValue ? -1 : 1;
      return sortDirection === "asc" ? comparison : -comparison;
    });

  console.log("Filtered Users:", filteredUsers);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  console.log("Current Items:", currentItems);
  console.log("Current Page:", currentPage);
  console.log("Total Pages:", Math.ceil(filteredUsers.length / itemsPerPage));

  const handleViewDevices = async (user: User) => {
    try {
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2QxOTZmNzQyNzUxZGUzM2UzZjVlN2IiLCJlbWFpbCI6ImFkbWluMSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc0NjI3NTM5OCwiZXhwIjoxNzQ2ODgwMTk4fQ.X02c3cZBHg9W4vaBo0_eqjh8AYpW-1JmFbJvpndLfL4";
      const response = await axios.get(`${API_URL}/device/getDeviceByUser`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { email: user.email },
      });

      if (
        response.data &&
        response.data.status === 200 &&
        response.data.message === "Find devices successfully" &&
        Array.isArray(response.data.data) &&
        response.data.data.length > 0
      ) {
        setUserDevices(response.data.data);
        setSelectedUser(user);
        setIsViewDevicesDialogOpen(true);
        setInlineMessage(null);
        setInlineMessageType(null);
      } else {
        setIsNoDeviceDialogOpen(true);
        setSelectedUser(user);
      }
    } catch (err) {
      if (
        axios.isAxiosError(err) &&
        (err.response?.status === 404 ||
          err.response?.data?.message === "No devices found for this user")
      ) {
        setIsNoDeviceDialogOpen(true);
        setSelectedUser(user);
      } else {
        setInlineMessage(
          `Failed to fetch devices for user ${user.name}. Please try again later.`
        );
        setInlineMessageType("error");
      }
    }
  };

  const handleViewGardens = async (user: User) => {
    try {
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2QxOTZmNzQyNzUxZGUzM2UzZjVlN2IiLCJlbWFpbCI6ImFkbWluMSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc0NjI3NTM5OCwiZXhwIjoxNzQ2ODgwMTk4fQ.X02c3cZBHg9W4vaBo0_eqjh8AYpW-1JmFbJvpndLfL4";
      const response = await axios.get(`${API_URL}/user/getGarden`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { email: user.email },
      });

      if (
        response.data &&
        response.data.status === 200 &&
        Array.isArray(response.data.data) &&
        response.data.data.length > 0
      ) {
        setUserGardens(response.data.data);
        setSelectedUser(user);
        setIsViewGardensDialogOpen(true);
      } else {
        setIsNoGardenDialogOpen(true);
        setSelectedUser(user);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Failed to fetch gardens");
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  const handleEditGarden = async () => {
    if (!selectedGarden || !selectedUser) return;

    try {
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2QxOTZmNzQyNzUxZGUzM2UzZjVlN2IiLCJlbWFpbCI6ImFkbWluMSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc0NjI3NTM5OCwiZXhwIjoxNzQ2ODgwMTk4fQ.X02c3cZBHg9W4vaBo0_eqjh8AYpW-1JmFbJvpndLfL4";

      const response = await axios.patch(
        `${API_URL}/user/updateGarden`,
        {
          email: selectedUser.email,
          name: selectedGarden.name,
          newName: editedGarden.name,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.status === 200) {
        setUserGardens(response.data.data);
        setIsEditGardenDialogOpen(false);
        setSelectedGarden(null);
        setEditedGarden({});
        toast.success("Garden name updated successfully");
      } else {
        toast.error(response.data?.message || "Failed to update garden name");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(
          err.response?.data?.message || "Failed to update garden name"
        );
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  const handleDeleteGarden = async () => {
    if (!selectedGarden || !selectedUser) return;

    try {
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2QxOTZmNzQyNzUxZGUzM2UzZjVlN2IiLCJlbWFpbCI6ImFkbWluMSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc0NjI3NTM5OCwiZXhwIjoxNzQ2ODgwMTk4fQ.X02c3cZBHg9W4vaBo0_eqjh8AYpW-1JmFbJvpndLfL4";

      const response = await axios.delete(`${API_URL}/user/deleteGarden`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: {
          email: selectedUser.email,
          name: selectedGarden.name,
        },
      });

      if (response.data && response.data.status === 200) {
        setUserGardens(userGardens.filter((g) => g._id !== selectedGarden._id));
        setIsDeleteGardenDialogOpen(false);
        setSelectedGarden(null);
        toast.success("Garden deleted successfully");
      } else {
        toast.error(response.data?.message || "Failed to delete garden");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Failed to delete garden");
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  // Fetching API
  useEffect(() => {
    const fetchAPI = async () => {
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2QxOTZmNzQyNzUxZGUzM2UzZjVlN2IiLCJlbWFpbCI6ImFkbWluMSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc0NjExNzA0OCwiZXhwIjoxNzQ2MjAzNDQ4fQ.Eyh1x_gH5aNOkWhyOQvLy_-ldlerwWlpel6VOs_wVlk";
      const response = await getAllUser(token);
      setUserData(response.data);
    };
    fetchAPI();
  }, []);

  console.log(userData);

  return (
    <div className="space-y-6">
      {isLoading && (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {!isLoading && !error && users.length === 0 && (
        <div className="text-center py-4">
          <p>No users found</p>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            Manage your system users and their permissions
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <FaUserPlus className="h-4 w-4" />
              Add New User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new user account with specific permissions
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <div className="col-span-3">
                  <Input
                    id="name"
                    value={newUser.name}
                    onChange={(e) =>
                      setNewUser({ ...newUser, name: e.target.value })
                    }
                    className={formErrors.name ? "border-red-500" : ""}
                    placeholder="Enter user's full name"
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.name}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <div className="col-span-3">
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                    className={formErrors.email ? "border-red-500" : ""}
                    placeholder="Enter user's email address"
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.email}
                    </p>
                  )}
                </div>
              </div>
              {/* Role is always USER, no dropdown */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Role
                </Label>
                <div className="col-span-3 flex items-center h-10">
                  <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                    USER
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="street" className="text-right">
                  Street
                </Label>
                <div className="col-span-3">
                  <Input
                    id="street"
                    value={newUser.address?.street || ""}
                    onChange={(e) =>
                      setNewUser({
                        ...newUser,
                        address: {
                          ...newUser.address,
                          street: e.target.value,
                        },
                      })
                    }
                    className={formErrors.street ? "border-red-500" : ""}
                    placeholder="Enter street address"
                  />
                  {formErrors.street && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.street}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="city" className="text-right">
                  City
                </Label>
                <div className="col-span-3">
                  <Input
                    id="city"
                    value={newUser.address?.city || ""}
                    onChange={(e) =>
                      setNewUser({
                        ...newUser,
                        address: {
                          ...newUser.address,
                          city: e.target.value,
                        },
                      })
                    }
                    className={formErrors.city ? "border-red-500" : ""}
                    placeholder="Enter city"
                  />
                  {formErrors.city && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.city}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="state" className="text-right">
                  State
                </Label>
                <div className="col-span-3">
                  <Input
                    id="state"
                    value={newUser.address?.state || ""}
                    onChange={(e) =>
                      setNewUser({
                        ...newUser,
                        address: {
                          ...newUser.address,
                          state: e.target.value,
                        },
                      })
                    }
                    className={formErrors.state ? "border-red-500" : ""}
                    placeholder="Enter state"
                  />
                  {formErrors.state && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.state}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone_number" className="text-right">
                  Phone
                </Label>
                <div className="col-span-3">
                  <Input
                    id="phone_number"
                    value={newUser.phone_number || ""}
                    onChange={(e) =>
                      setNewUser({ ...newUser, phone_number: e.target.value })
                    }
                    className={formErrors.phone_number ? "border-red-500" : ""}
                    placeholder="Enter user's phone number"
                  />
                  {formErrors.phone_number && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.phone_number}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddUser}>Add User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {inlineMessage && (
        <div
          style={{
            background: inlineMessageType === "info" ? "#f0f9ff" : "#fef2f2",
            color: inlineMessageType === "info" ? "#0369a1" : "#b91c1c",
            border: `1px solid ${
              inlineMessageType === "info" ? "#bae6fd" : "#fecaca"
            }`,
            padding: "16px",
            borderRadius: "8px",
            marginBottom: "16px",
            textAlign: "center",
          }}
        >
          {inlineMessage}
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>User List</CardTitle>
            <div className="flex gap-4 items-center">
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="USER">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  Name{" "}
                  {sortField === "name" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("email")}
                >
                  Email{" "}
                  {sortField === "email" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("role")}
                >
                  Role{" "}
                  {sortField === "role" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("address")}
                >
                  Address{" "}
                  {sortField === "address" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("phone_number")}
                >
                  Phone{" "}
                  {sortField === "phone_number" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.map((user) => (
                <TableRow key={user._id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        user.role === "ADMIN"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell>
                    {user.address
                      ? `${user.address.street || ""}, ${
                          user.address.city || ""
                        }, ${user.address.state || ""}`
                      : "N/A"}
                  </TableCell>
                  <TableCell>{user.phone_number || "N/A"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDevices(user)}
                      >
                        <FaEye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewGardens(user)}
                      >
                        <FaTree className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <FaEdit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <FaTrash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex justify-center mt-4 gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="py-2">
              Page {currentPage} of{" "}
              {Math.ceil(filteredUsers.length / itemsPerPage)}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={
                currentPage === Math.ceil(filteredUsers.length / itemsPerPage)
              }
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Name
              </Label>
              <div className="col-span-3">
                <Input
                  id="edit-name"
                  value={selectedUser?.name || ""}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser!,
                      name: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-email" className="text-right">
                Email
              </Label>
              <div className="col-span-3">
                <Input
                  id="edit-email"
                  value={selectedUser?.email || ""}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser!,
                      email: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-role" className="text-right">
                Role
              </Label>
              <div className="col-span-3 flex items-center h-10">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    selectedUser?.role === "ADMIN"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {selectedUser?.role}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-address" className="text-right">
                Street
              </Label>
              <div className="col-span-3">
                <Input
                  id="edit-street"
                  value={selectedUser?.address?.street || ""}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser!,
                      address: {
                        ...selectedUser?.address,
                        street: e.target.value,
                      },
                    })
                  }
                  className={formErrors.street ? "border-red-500" : ""}
                  placeholder="Enter street address"
                />
                {formErrors.street && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.street}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-city" className="text-right">
                City
              </Label>
              <div className="col-span-3">
                <Input
                  id="edit-city"
                  value={selectedUser?.address?.city || ""}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser!,
                      address: {
                        ...selectedUser?.address,
                        city: e.target.value,
                      },
                    })
                  }
                  className={formErrors.city ? "border-red-500" : ""}
                  placeholder="Enter city"
                />
                {formErrors.city && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.city}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-state" className="text-right">
                State
              </Label>
              <div className="col-span-3">
                <Input
                  id="edit-state"
                  value={selectedUser?.address?.state || ""}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser!,
                      address: {
                        ...selectedUser?.address,
                        state: e.target.value,
                      },
                    })
                  }
                  className={formErrors.state ? "border-red-500" : ""}
                  placeholder="Enter state"
                />
                {formErrors.state && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.state}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-phone_number" className="text-right">
                Phone
              </Label>
              <div className="col-span-3">
                <Input
                  id="edit-phone_number"
                  value={selectedUser?.phone_number || ""}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser!,
                      phone_number: e.target.value,
                    })
                  }
                  placeholder="Enter user's phone number"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleEditUser}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Devices Dialog */}
      <Dialog
        open={isViewDevicesDialogOpen}
        onOpenChange={setIsViewDevicesDialogOpen}
      >
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>
              Devices and Sensors of {selectedUser?.name}
            </DialogTitle>
            <DialogDescription>
              View all devices and sensors associated with this user
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {userDevices.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 min-h-[200px]">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-700 mb-2">
                    This user currently has no devices.
                  </p>
                  <p className="text-base text-gray-500">
                    Please add devices to this user for monitoring and
                    management.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Devices Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Devices</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Device Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Garden</TableHead>
                        <TableHead>Feed</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Threshold</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userDevices
                        .filter((device) => device.category === "device")
                        .map((device) => (
                          <TableRow key={device._id}>
                            <TableCell>{device.device_name}</TableCell>
                            <TableCell>{device.type}</TableCell>
                            <TableCell>{device.location.garden_name}</TableCell>
                            <TableCell>{device.feed}</TableCell>
                            <TableCell>
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  device.is_active
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {device.is_active ? "Active" : "Inactive"}
                              </span>
                            </TableCell>
                            <TableCell>
                              {device.threshold.min} - {device.threshold.max}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Sensors Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Sensors</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Sensor Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Garden</TableHead>
                        <TableHead>Feed</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Threshold</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userDevices
                        .filter((device) => device.category === "sensor")
                        .map((device) => (
                          <TableRow key={device._id}>
                            <TableCell>{device.device_name}</TableCell>
                            <TableCell>{device.type}</TableCell>
                            <TableCell>{device.location.garden_name}</TableCell>
                            <TableCell>{device.feed}</TableCell>
                            <TableCell>
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  device.is_active
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {device.is_active ? "Active" : "Inactive"}
                              </span>
                            </TableCell>
                            <TableCell>
                              {device.threshold.min} - {device.threshold.max}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsViewDevicesDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* No Device Dialog */}
      <Dialog
        open={isNoDeviceDialogOpen}
        onOpenChange={setIsNoDeviceDialogOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Notice</DialogTitle>
          </DialogHeader>
          <div className="py-6 text-center">
            <p className="text-lg font-semibold text-green-700 mb-2">
              This user currently has no devices.
            </p>
            <p className="text-base text-gray-500">
              Please add devices to this user for monitoring and management.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsNoDeviceDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-green-600">Success!</DialogTitle>
            <DialogDescription>
              User information has been updated successfully.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsSuccessDialogOpen(false);
                setIsEditDialogOpen(false);
              }}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Gardens Dialog */}
      <Dialog
        open={isViewGardensDialogOpen}
        onOpenChange={setIsViewGardensDialogOpen}
      >
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Gardens of {selectedUser?.name}</DialogTitle>
            <DialogDescription>
              View all gardens associated with this user
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {userGardens.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 min-h-[200px]">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-700 mb-2">
                    This user currently has no gardens.
                  </p>
                  <p className="text-base text-gray-500">
                    Please add gardens to this user for monitoring and
                    management.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Garden Name</TableHead>
                      <TableHead>Latitude</TableHead>
                      <TableHead>Longitude</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userGardens.map((garden) => (
                      <TableRow key={garden._id}>
                        <TableCell>{garden.name}</TableCell>
                        <TableCell>{garden.latitude}</TableCell>
                        <TableCell>{garden.longitude}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedGarden(garden);
                                setEditedGarden(garden);
                                setIsEditGardenDialogOpen(true);
                              }}
                            >
                              <FaEdit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                setSelectedGarden(garden);
                                setIsDeleteGardenDialogOpen(true);
                              }}
                            >
                              <FaTrash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsViewGardensDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* No Garden Dialog */}
      <Dialog
        open={isNoGardenDialogOpen}
        onOpenChange={setIsNoGardenDialogOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Notice</DialogTitle>
          </DialogHeader>
          <div className="py-6 text-center">
            <p className="text-lg font-semibold text-green-700 mb-2">
              This user currently has no gardens.
            </p>
            <p className="text-base text-gray-500">
              Please add gardens to this user for monitoring and management.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsNoGardenDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Garden Dialog */}
      <Dialog
        open={isEditGardenDialogOpen}
        onOpenChange={setIsEditGardenDialogOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Garden Name</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-garden-name" className="text-right">
                Garden Name
              </Label>
              <div className="col-span-3">
                <Input
                  id="edit-garden-name"
                  value={editedGarden.name || ""}
                  onChange={(e) =>
                    setEditedGarden({
                      ...editedGarden,
                      name: e.target.value,
                    })
                  }
                  placeholder="Enter new garden name"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditGardenDialogOpen(false);
                setEditedGarden({});
              }}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleEditGarden}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Garden Dialog */}
      <Dialog
        open={isDeleteGardenDialogOpen}
        onOpenChange={setIsDeleteGardenDialogOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this garden? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteGardenDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteGarden}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserPage;
