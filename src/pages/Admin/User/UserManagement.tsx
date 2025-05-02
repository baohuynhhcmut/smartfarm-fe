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
import { FaUserPlus, FaEdit, FaTrash } from "react-icons/fa";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

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
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortField, setSortField] = useState<keyof User | "gardens.length">(
    "name"
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [newUser, setNewUser] = useState<Partial<User>>({
    name: "",
    email: "",
    role: "USER",
    phone_number: "",
    address: {
      street: "",
      country: "",
    },
  });

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
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2QxOTZmNzQyNzUxZGUzM2UzZjVlN2IiLCJlbWFpbCI6ImFkbWluMSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc0NjE3NDgyNywiZXhwIjoxNzQ2MjYxMjI3fQ.x16pY0x70_bDwm0mONZYM3EKljbbK0emQPgsP5uMwhY";

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

  const validateForm = (user: Partial<User>) => {
    const errors: Record<string, string> = {};
    if (!user.name) errors.name = "Name is required";
    if (!user.email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(user.email))
      errors.email = "Invalid email format";
    if (!user.role) errors.role = "Role is required";
    if (user.phone_number) {
      const phoneNumber = user.phone_number.replace(/\D/g, "");
      if (phoneNumber.length !== 10) {
        errors.phone_number = "Phone number must be exactly 10 digits";
      }
    }
    return errors;
  };

  const handleAddUser = async () => {
    const errors = validateForm(newUser);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2QxOTZmNzQyNzUxZGUzM2UzZjVlN2IiLCJlbWFpbCI6ImFkbWluMSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc0NjE3NDgyNywiZXhwIjoxNzQ2MjYxMjI3fQ.x16pY0x70_bDwm0mONZYM3EKljbbK0emQPgsP5uMwhY";

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
    if (!selectedUser) return;

    const errors = validateForm(selectedUser);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2QxOTZmNzQyNzUxZGUzM2UzZjVlN2IiLCJlbWFpbCI6ImFkbWluMSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc0NjE3NDgyNywiZXhwIjoxNzQ2MjYxMjI3fQ.x16pY0x70_bDwm0mONZYM3EKljbbK0emQPgsP5uMwhY";

      const userData = {
        email: selectedUser.email,
        name: selectedUser.name,
        role: selectedUser.role,
        phone_number: selectedUser.phone_number,
        address: {
          street: selectedUser.address?.street || "",
        },
      };

      console.log("Updating user data:", userData);

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

      console.log("Update response:", response.data);

      if (response.data && response.data.status === 200) {
        // Cập nhật thông tin user trong danh sách
        setUsers(
          users.map((user) =>
            user.email === selectedUser.email
              ? {
                  ...user,
                  name: selectedUser.name,
                  role: selectedUser.role,
                  phone_number: selectedUser.phone_number,
                  address: {
                    ...user.address,
                    street: selectedUser.address?.street || "",
                  },
                }
              : user
          )
        );
        setIsEditDialogOpen(false);
        setSelectedUser(null);
        setFormErrors({});
        toast.success(response.data.message || "User updated successfully");
      } else {
        console.error("Invalid response format:", response.data);
        toast.error("Failed to update user: Invalid response format");
      }
    } catch (err) {
      console.error("Error updating user:", err);
      if (axios.isAxiosError(err)) {
        console.error("Error response:", err.response?.data);
        console.error("Error status:", err.response?.status);
        console.error("Error headers:", err.response?.headers);

        if (err.response?.status === 400) {
          if (err.response?.data?.message === "User not found!") {
            toast.error("User not found. Please check the email address.");
          } else {
            toast.error(err.response?.data?.message || "Invalid user data");
          }
        } else if (err.response?.status === 404) {
          toast.error("Endpoint does not exist");
        } else {
          toast.error(err.response?.data?.message || "Failed to update user");
        }
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2QxOTZmNzQyNzUxZGUzM2UzZjVlN2IiLCJlbWFpbCI6ImFkbWluMSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc0NjE3NDgyNywiZXhwIjoxNzQ2MjYxMjI3fQ.x16pY0x70_bDwm0mONZYM3EKljbbK0emQPgsP5uMwhY";

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

  const handleSort = (field: keyof User | "gardens.length") => {
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
      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "active" && (user.gardens?.length ?? 0) > 0) ||
        (filterStatus === "inactive" && (user.gardens?.length ?? 0) === 0);

      return matchesSearch && matchesRole && matchesStatus;
    })
    .sort((a, b) => {
      let aValue: string | number = "";
      let bValue: string | number = "";

      if (sortField === "gardens.length") {
        aValue = a.gardens?.length ?? 0;
        bValue = b.gardens?.length ?? 0;
      } else if (sortField === "address") {
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Role
                </Label>
                <div className="col-span-3">
                  <Select
                    value={newUser.role}
                    onValueChange={(value) =>
                      setNewUser({ ...newUser, role: value as User["role"] })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select user role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="USER">User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">
                  Address
                </Label>
                <div className="col-span-3">
                  <Input
                    id="address"
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
                    placeholder="Enter user's address"
                  />
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

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>User List</CardTitle>
            <div className="flex gap-4">
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
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
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
                  onClick={() => handleSort("gardens.length")}
                >
                  Status{" "}
                  {sortField === "gardens.length" &&
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
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        (user.gardens?.length ?? 0) > 0
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {(user.gardens?.length ?? 0) > 0 ? "Active" : "Inactive"}
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
              <div className="col-span-3">
                <Select
                  value={selectedUser?.role || "USER"}
                  onValueChange={(value) =>
                    setSelectedUser({
                      ...selectedUser!,
                      role: value as User["role"],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select user role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="USER">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-address" className="text-right">
                Address
              </Label>
              <div className="col-span-3">
                <Input
                  id="edit-address"
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
                  placeholder="Enter user's address"
                />
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
            <Button onClick={handleEditUser}>Save changes</Button>
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
    </div>
  );
};

export default UserPage;
