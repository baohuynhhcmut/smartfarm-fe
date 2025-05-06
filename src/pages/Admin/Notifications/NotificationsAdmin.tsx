import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import { useAppContext } from "../../../context/AppContext";

// Import Shadcn UI components
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog";
import { Badge } from "../../../components/ui/badge";

// API base URL hardcoded
const BASE_URL = 'http://localhost:8081/api/v1';

interface User {
  _id: string;
  email: string;
  name: string;
  role: string;
}

interface NotificationHistory {
  _id: string;
  senderId: string;
  receiverId: string;
  message: string;
  createdAt: string;
  read: boolean;
}

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Form validation schema
const notificationFormSchema = z.object({
  message: z.string().min(5, {
    message: "Thông báo phải có ít nhất 5 ký tự.",
  }),
});

const NotificationsAdmin = () => {
  const { state, dispatch } = useAppContext();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [notificationHistory, setNotificationHistory] = useState<NotificationHistory[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  
  // Admin email state - we'll fetch this from the API
  const [adminEmail, setAdminEmail] = useState<string>("");

  // Initialize form with react-hook-form
  const form = useForm<z.infer<typeof notificationFormSchema>>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: {
      message: "",
    },
  });

  // Fetch admin user info from API
  useEffect(() => {
    const fetchAdminInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found");
          return;
        }

        const response = await axios.get(`${BASE_URL}/user/getByToken`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && response.data.user && response.data.user.email) {
          setAdminEmail(response.data.user.email);
          console.log("Admin email fetched:", response.data.user.email);
        } else {
          setError("Admin email not found in response");
        }
      } catch (err: any) {
        console.error("Error fetching admin info:", err);
        setError("Failed to fetch admin information");
      }
    };

    fetchAdminInfo();
  }, []);

  // Fetch users and set up socket listeners
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await axios.get(`${BASE_URL}/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Filter to get only USER role accounts
        const userAccounts = response.data.data.filter(
          (user: User) => user.role === "USER"
        );
        setUsers(userAccounts);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching users:", err);
        setError(err.message || "Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    // Fetch users and notification history
    fetchUsers();
    fetchNotificationHistory(currentPage);
    
    // Ensure socket is connected via AppContext
    if (!state.socket.connected) {
      dispatch({ type: 'SOCKET_CONNECT' });
    }

    // Setup socket event listeners when component mounts
    const setupSocketListeners = () => {
      if (window.socketInstance && adminEmail) {
        console.log("Setting up admin socket listeners for:", adminEmail);
        
        // Register admin with socket when component mounts
        window.socketInstance.emit("register", { 
          email: adminEmail, 
          role: "ADMIN" 
        });
        
        // Listen for active users updates
        window.socketInstance.on("active_users", (users) => {
          setActiveUsers(users);
          console.log("Active users updated:", users);
        });
  
        // Listen for notification read status updates from users
        window.socketInstance.on("notification_read_admin", ({ id, userEmail }) => {
          console.log(`Notification ${id} marked as read by ${userEmail}`);
          
          setNotificationHistory(prev => 
            prev.map(notif => 
              notif._id === id ? { ...notif, read: true } : notif
            )
          );
          
          toast.success(`Thông báo đã được đọc bởi ${userEmail}`, {
            duration: 3000,
            position: "bottom-right",
            icon: '✅',
          });
        });
        
        // Listen for new notifications from other admin instances
        window.socketInstance.on("notification_sent_update", (notification) => {
          console.log("Received notification_sent_update:", notification);
          
          if (currentPage === 1) {
            setNotificationHistory(prev => {
              const exists = prev.some(n => n._id === notification._id);
              if (!exists) {
                return [notification, ...prev.slice(0, pagination.limit - 1)];
              }
              return prev;
            });
            
            setPagination(prev => ({
              ...prev,
              total: prev.total + 1,
              totalPages: Math.ceil((prev.total + 1) / prev.limit)
            }));
          }
        });
  
        // Listen for notification sent confirmations
        window.socketInstance.on("notification_sent", ({ success, notificationId, receiverId }) => {
          if (success) {
            console.log(`Notification ${notificationId} successfully sent to ${receiverId}`);
          }
        });
        
        // Listen for socket errors
        window.socketInstance.on("error", (errorMessage) => {
          console.error("Socket error:", errorMessage);
          toast.error(errorMessage || "Lỗi kết nối socket", {
            duration: 5000,
          });
        });
      }
    };
    
    // Only set up listeners when adminEmail is available
    if (adminEmail) {
      setupSocketListeners();
    }

    // Clean up socket listeners on unmount
    return () => {
      if (window.socketInstance) {
        window.socketInstance.off("active_users");
        window.socketInstance.off("notification_read_admin");
        window.socketInstance.off("notification_sent_update");
        window.socketInstance.off("notification_sent");
        window.socketInstance.off("error");
      }
    };
  }, [currentPage, adminEmail, state.socket.connected, dispatch, pagination.limit]);

  // Fetch notification history with pagination
  const fetchNotificationHistory = async (page: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(
        `${BASE_URL}/noti?page=${page}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Notification history response:", response.data);

      if (Array.isArray(response.data)) {
        // Handle array response without pagination
        setNotificationHistory(response.data);
        setPagination({
          total: response.data.length,
          page: 1,
          limit: 10,
          totalPages: 1
        });
      } else {
        // Handle response with pagination
        setNotificationHistory(response.data.notifications || []);
        if (response.data.pagination) {
          setPagination(response.data.pagination);
        }
      }
    } catch (err) {
      console.error("Error fetching notification history:", err);
    }
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setCurrentPage(newPage);
      fetchNotificationHistory(newPage);
    }
  };

  // Handle user selection
  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  // Handle select all
  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    setSelectedUsers(selectAll ? [] : users.map((user) => user._id));
  };

  // Send notification to selected users
  const onSubmit = async (values: z.infer<typeof notificationFormSchema>) => {
    if (selectedUsers.length === 0) {
      setError("Vui lòng chọn ít nhất một người dùng để gửi thông báo");
      return;
    }

    setSending(true);
    setError(null);
    setSuccess(null);

    try {
      // Make sure we have an admin email
      if (!adminEmail) {
        throw new Error("Không tìm thấy thông tin người gửi");
      }
      
      // Make sure we have a socket connection
      if (!window.socketInstance || !state.socket.connected) {
        dispatch({ type: 'SOCKET_CONNECT' });
        if (!window.socketInstance) {
          throw new Error("Socket connection not available");
        }
      }
      
      console.log("Preparing to send notifications to", selectedUsers.length, "users");
      
      // Send notification to each selected user
      const sendPromises = selectedUsers.map(async (userId) => {
        const userInfo = users.find(user => user._id === userId);
        if (!userInfo || !userInfo.email) return null;
        
        console.log(`Sending notification to ${userInfo.email} from ${adminEmail}`);
        
        // Emit socket event to send notification
        window.socketInstance.emit("send_notification", {
          senderId: adminEmail,
          receiverId: userInfo.email,
          message: values.message
        });
        
        // We don't need to wait for confirmation, but return info for tracking
        return { userId, userEmail: userInfo.email };
      });
      
      // Wait for all notifications to be sent
      await Promise.all(sendPromises.filter(Boolean));
      
      const successMessage = `Thông báo đã được gửi thành công đến ${selectedUsers.length} người dùng`;
      setSuccess(successMessage);
      
      // Show success toast
      toast.success(successMessage, {
        duration: 5000,
        position: "top-center",
        icon: '🔔',
      });
      
      // Reset form
      form.reset();
      
      // Refresh notification history after sending
      setTimeout(() => {
        fetchNotificationHistory(1);
        setCurrentPage(1);
      }, 1000);
    } catch (err: any) {
      console.error("Error sending notifications:", err);
      setError(err.message || "Failed to send notifications");
      
      // Show error toast
      toast.error("Không thể gửi thông báo. Vui lòng thử lại sau.", {
        duration: 5000,
      });
    } finally {
      setSending(false);
      setDialogOpen(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN");
  };

  // Check if user is online
  const isUserOnline = (email: string) => {
    return activeUsers.includes(email);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Quản lý thông báo</h1>

      {/* Admin Info */}
      {adminEmail ? (
        <div className="mb-4 text-sm bg-blue-50 p-3 rounded">
          Đăng nhập với tài khoản admin: <strong>{adminEmail}</strong>
          {state.socket.connected ? (
            <span className="ml-2 text-green-600">(Đã kết nối)</span>
          ) : (
            <span className="ml-2 text-red-600">(Chưa kết nối)</span>
          )}
        </div>
      ) : (
        <div className="mb-4 text-sm bg-yellow-50 p-3 rounded">
          Đang tải thông tin admin...
        </div>
      )}

      {/* Notification Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Gửi thông báo mới</CardTitle>
          <CardDescription>
            Gửi thông báo đến một hoặc nhiều người dùng.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nội dung thông báo</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Nhập nội dung thông báo" 
                        rows={10}
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Nội dung thông báo sẽ được gửi tới tất cả người dùng đã chọn.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                  {success}
                </div>
              )}

              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    type="button" 
                    disabled={sending || loading || !adminEmail || form.getValues().message.length < 5}
                  >
                    {sending ? "Đang gửi..." : "Gửi thông báo"}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Xác nhận gửi thông báo</DialogTitle>
                    <DialogDescription>
                      Bạn có chắc chắn muốn gửi thông báo này đến {selectedUsers.length} người dùng đã chọn?
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <p className="font-semibold">Nội dung thông báo:</p>
                    <p className="mt-2 p-3 bg-gray-100 rounded">{form.getValues().message}</p>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>Hủy</Button>
                    <Button 
                      onClick={form.handleSubmit(onSubmit)}
                      disabled={sending}
                    >
                      {sending ? "Đang gửi..." : "Xác nhận gửi"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* User Selection */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Chọn người nhận</CardTitle>
          <CardDescription>
            Chọn một hoặc nhiều người dùng để gửi thông báo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Đang tải danh sách người dùng...</div>
          ) : (
            <>
              <div className="mb-4 flex items-center">
                <input
                  type="checkbox"
                  id="select-all"
                  checked={selectAll}
                  onChange={toggleSelectAll}
                  className="mr-2"
                />
                <label htmlFor="select-all">Chọn tất cả người dùng ({users.length})</label>
              </div>

              <div className="max-h-60 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Chọn</TableHead>
                      <TableHead>Tên</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Trạng thái</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user._id)}
                            onChange={() => toggleUserSelection(user._id)}
                          />
                        </TableCell>
                        <TableCell>{user.name || 'Không có tên'}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          {isUserOnline(user.email) ? 
                            <Badge className="bg-green-500">Trực tuyến</Badge> : 
                            <Badge variant="outline" className="text-gray-500">Ngoại tuyến</Badge>
                          }
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="mt-4">
                <p>Đã chọn: {selectedUsers.length} / {users.length} người dùng</p>
                <p className="text-sm text-gray-500 mt-1">
                  Người dùng trực tuyến: {activeUsers.filter(email => !email.includes('admin')).length}
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Notification History */}
      <Card>
        <CardHeader>
          <CardTitle>Lịch sử thông báo</CardTitle>
          <CardDescription>
            Danh sách các thông báo đã gửi gần đây.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {notificationHistory.length === 0 ? (
            <div className="text-center py-4">Chưa có thông báo nào được gửi.</div>
          ) : (
            <>
              <div className="max-h-96 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Người gửi</TableHead>
                      <TableHead>Người nhận</TableHead>
                      <TableHead>Nội dung</TableHead>
                      <TableHead>Thời gian</TableHead>
                      <TableHead>Trạng thái</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {notificationHistory.map((notification) => (
                      <TableRow key={notification._id}>
                        <TableCell>{notification.senderId}</TableCell>
                        <TableCell>
                          {notification.receiverId}
                          {isUserOnline(notification.receiverId) && (
                            <Badge className="ml-2 bg-green-500 text-xs">Online</Badge>
                          )}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {notification.message.length > 50 
                            ? `${notification.message.substring(0, 50)}...` 
                            : notification.message}
                        </TableCell>
                        <TableCell>{formatDate(notification.createdAt)}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${notification.read 
                            ? "bg-green-100 text-green-800" 
                            : "bg-yellow-100 text-yellow-800"}`}
                          >
                            {notification.read ? "Đã đọc" : "Chưa đọc"}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {/* Pagination Controls */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center mt-4 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    Trước
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                      .filter(page => 
                        page === 1 || 
                        page === pagination.totalPages || 
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      )
                      .map((page, index, array) => (
                        <React.Fragment key={page}>
                          {index > 0 && array[index - 1] !== page - 1 && (
                            <span className="px-2">...</span>
                          )}
                          <Button
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className="w-8 h-8 p-0"
                          >
                            {page}
                          </Button>
                        </React.Fragment>
                      ))
                    }
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={currentPage === pagination.totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    Sau
                  </Button>
                </div>
              )}
              
              <div className="text-center text-sm text-gray-500 mt-4">
                Hiển thị {notificationHistory.length} trên tổng số {pagination.total} thông báo
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsAdmin; 