import { useState, useEffect, useMemo } from "react";
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
import { userApi, User } from "@/api/userApi";

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
  const [sortField, setSortField] = useState<
    "name" | "role" | "status" | "deviceCount" | "gardenCount"
  >("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [newUser, setNewUser] = useState<Partial<User>>({
    name: "",
    email: "",
    role: "user",
    status: "active",
    address: "",
    phone: "",
    deviceCount: 0,
    gardenCount: 0,
  });

  const initialUsers = useMemo<User[]>(
    () => [
      {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        role: "admin" as const,
        status: "active" as const,
        createdAt: "2024-01-01",
        lastLogin: "2024-02-25",
        address: "123 Main St, City A",
        phone: "+1234567890",
        deviceCount: 5,
        gardenCount: 3,
      },
      {
        id: "2",
        name: "Jane Smith",
        email: "jane@example.com",
        role: "user" as const,
        status: "active" as const,
        createdAt: "2024-01-05",
        lastLogin: "2024-02-24",
        address: "456 Oak St, City B",
        phone: "+1234567891",
        deviceCount: 2,
        gardenCount: 1,
      },
      {
        id: "3",
        name: "Bob Johnson",
        email: "bob@example.com",
        role: "user" as const,
        status: "inactive" as const,
        createdAt: "2024-01-10",
        lastLogin: "2024-02-15",
        address: "789 Pine St, City C",
        phone: "+1234567892",
        deviceCount: 0,
        gardenCount: 0,
      },
      {
        id: "4",
        name: "Alice Brown",
        email: "alice@example.com",
        role: "user" as const,
        status: "pending" as const,
        createdAt: "2024-01-15",
        lastLogin: "2024-02-10",
        address: "321 Elm St, City D",
        phone: "+1234567893",
        deviceCount: 1,
        gardenCount: 1,
      },
      {
        id: "5",
        name: "Charlie Wilson",
        email: "charlie@example.com",
        role: "user" as const,
        status: "active" as const,
        createdAt: "2024-01-20",
        lastLogin: "2024-02-05",
        address: "654 Maple St, City E",
        phone: "+1234567894",
        deviceCount: 3,
        gardenCount: 2,
      },
      {
        id: "6",
        name: "Diana Miller",
        email: "diana@example.com",
        role: "user" as const,
        status: "inactive" as const,
        createdAt: "2024-01-25",
        lastLogin: "2024-01-30",
        address: "987 Cedar St, City F",
        phone: "+1234567895",
        deviceCount: 0,
        gardenCount: 0,
      },
      {
        id: "7",
        name: "Edward Davis",
        email: "edward@example.com",
        role: "user" as const,
        status: "active" as const,
        createdAt: "2024-01-30",
        lastLogin: "2024-02-01",
        address: "147 Birch St, City G",
        phone: "+1234567896",
        deviceCount: 2,
        gardenCount: 1,
      },
      {
        id: "8",
        name: "Fiona Clark",
        email: "fiona@example.com",
        role: "user" as const,
        status: "pending" as const,
        createdAt: "2024-02-01",
        lastLogin: "2024-02-15",
        address: "258 Spruce St, City H",
        phone: "+1234567897",
        deviceCount: 1,
        gardenCount: 0,
      },
      {
        id: "9",
        name: "George White",
        email: "george@example.com",
        role: "user" as const,
        status: "active" as const,
        createdAt: "2024-02-05",
        lastLogin: "2024-02-20",
        address: "369 Aspen St, City I",
        phone: "+1234567898",
        deviceCount: 4,
        gardenCount: 2,
      },
      {
        id: "10",
        name: "Hannah Lee",
        email: "hannah@example.com",
        role: "user" as const,
        status: "inactive" as const,
        createdAt: "2024-02-10",
        lastLogin: "2024-02-18",
        address: "741 Willow St, City J",
        phone: "+1234567899",
        deviceCount: 0,
        gardenCount: 0,
      },
      {
        id: "11",
        name: "Ian Taylor",
        email: "ian@example.com",
        role: "user" as const,
        status: "active" as const,
        createdAt: "2024-02-15",
        lastLogin: "2024-02-22",
        address: "852 Redwood St, City K",
        phone: "+1234567900",
        deviceCount: 2,
        gardenCount: 1,
      },
      {
        id: "12",
        name: "Anna Wilson",
        email: "anna@example.com",
        role: "user" as const,
        status: "inactive" as const,
        createdAt: "2024-01-12",
        lastLogin: "2024-02-20",
        address: "963 Poplar St, City L",
        phone: "+1234567901",
        deviceCount: 3,
        gardenCount: 2,
      },
    ],
    []
  );

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await userApi.getAllUsers();
      setUsers(data);
    } catch (err) {
      setError("Failed to fetch users");
      toast.error("Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (user: Partial<User>) => {
    const errors: Record<string, string> = {};
    if (!user.name) errors.name = "Name is required";
    if (!user.email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(user.email))
      errors.email = "Invalid email format";
    if (!user.role) errors.role = "Role is required";
    if (!user.status) errors.status = "Status is required";
    if (user.phone) {
      const phoneNumber = user.phone.replace(/\D/g, "");
      if (phoneNumber.length !== 10) {
        errors.phone = "Phone number must be exactly 10 digits";
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
      const createdUser = await userApi.createUser(
        newUser as Omit<User, "id" | "createdAt">
      );
      setUsers([...users, createdUser]);
      setIsAddDialogOpen(false);
      setNewUser({
        name: "",
        email: "",
        role: "user",
        status: "active",
        address: "",
        phone: "",
        deviceCount: 0,
        gardenCount: 0,
      });
      setFormErrors({});
      toast.success("User added successfully");
    } catch (err) {
      toast.error("Failed to add user");
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
      const updatedUser = await userApi.updateUser(
        selectedUser.id,
        selectedUser
      );
      setUsers(
        users.map((user) => (user.id === selectedUser.id ? updatedUser : user))
      );
      setIsEditDialogOpen(false);
      setSelectedUser(null);
      setFormErrors({});
      toast.success("User updated successfully");
    } catch (err) {
      toast.error("Failed to update user");
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      await userApi.deleteUser(selectedUser.id);
      setUsers(users.filter((user) => user.id !== selectedUser.id));
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
      toast.success("User deleted successfully");
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  const handleSort = (
    field: "name" | "role" | "status" | "deviceCount" | "gardenCount"
  ) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredUsers = users
    .filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.address?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = filterRole === "all" || user.role === filterRole;
      const matchesStatus =
        filterStatus === "all" || user.status === filterStatus;
      return matchesSearch && matchesRole && matchesStatus;
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      if (aValue === undefined && bValue === undefined) return 0;
      if (aValue === undefined) return 1;
      if (bValue === undefined) return -1;
      if (aValue === bValue) return 0;
      const comparison = aValue < bValue ? -1 : 1;
      return sortDirection === "asc" ? comparison : -comparison;
    });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

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
                    onValueChange={(value: string) =>
                      setNewUser({ ...newUser, role: value as User["role"] })
                    }
                  >
                    <SelectTrigger
                      className={formErrors.role ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select user role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.role && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.role}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <div className="col-span-3">
                  <Select
                    value={newUser.status}
                    onValueChange={(value: string) =>
                      setNewUser({
                        ...newUser,
                        status: value as User["status"],
                      })
                    }
                  >
                    <SelectTrigger
                      className={formErrors.status ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select user status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.status && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.status}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">
                  Address
                </Label>
                <div className="col-span-3">
                  <Input
                    id="address"
                    value={newUser.address}
                    onChange={(e) =>
                      setNewUser({ ...newUser, address: e.target.value })
                    }
                    placeholder="Enter user's address"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <div className="col-span-3">
                  <Input
                    id="phone"
                    value={newUser.phone}
                    onChange={(e) =>
                      setNewUser({ ...newUser, phone: e.target.value })
                    }
                    className={formErrors.phone ? "border-red-500" : ""}
                    placeholder="Enter user's phone number"
                  />
                  {formErrors.phone && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.phone}
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
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
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
                  <SelectItem value="pending">Pending</SelectItem>
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
                <TableHead>Email</TableHead>
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
                  onClick={() => handleSort("status")}
                >
                  Status{" "}
                  {sortField === "status" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead>Address</TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("deviceCount")}
                >
                  Devices{" "}
                  {sortField === "deviceCount" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("gardenCount")}
                >
                  Gardens{" "}
                  {sortField === "gardenCount" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        user.role === "admin"
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
                        user.status === "active"
                          ? "bg-green-100 text-green-800"
                          : user.status === "inactive"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {user.status}
                    </span>
                  </TableCell>
                  <TableCell>{user.address}</TableCell>
                  <TableCell>{user.deviceCount}</TableCell>
                  <TableCell>{user.gardenCount}</TableCell>
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
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
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
            <DialogDescription>
              Update user information and permissions
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name
                </Label>
                <div className="col-span-3">
                  <Input
                    id="edit-name"
                    value={selectedUser.name}
                    onChange={(e) =>
                      setSelectedUser({ ...selectedUser, name: e.target.value })
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
                <Label htmlFor="edit-email" className="text-right">
                  Email
                </Label>
                <div className="col-span-3">
                  <Input
                    id="edit-email"
                    type="email"
                    value={selectedUser.email}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        email: e.target.value,
                      })
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
                <Label htmlFor="edit-role" className="text-right">
                  Role
                </Label>
                <div className="col-span-3">
                  <Select
                    value={selectedUser.role}
                    onValueChange={(value: string) =>
                      setSelectedUser({
                        ...selectedUser,
                        role: value as User["role"],
                      })
                    }
                  >
                    <SelectTrigger
                      className={formErrors.role ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select user role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.role && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.role}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-status" className="text-right">
                  Status
                </Label>
                <div className="col-span-3">
                  <Select
                    value={selectedUser.status}
                    onValueChange={(value: string) =>
                      setSelectedUser({
                        ...selectedUser,
                        status: value as User["status"],
                      })
                    }
                  >
                    <SelectTrigger
                      className={formErrors.status ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select user status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.status && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.status}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-address" className="text-right">
                  Address
                </Label>
                <div className="col-span-3">
                  <Input
                    id="edit-address"
                    value={selectedUser.address}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        address: e.target.value,
                      })
                    }
                    placeholder="Enter user's address"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-phone" className="text-right">
                  Phone
                </Label>
                <div className="col-span-3">
                  <Input
                    id="edit-phone"
                    value={selectedUser.phone}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        phone: e.target.value,
                      })
                    }
                    className={formErrors.phone ? "border-red-500" : ""}
                    placeholder="Enter user's phone number"
                  />
                  {formErrors.phone && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEditUser}>Save Changes</Button>
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
