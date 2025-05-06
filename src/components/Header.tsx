import React, { useState, useEffect } from "react";
import { FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useNotifications } from "../context/NotificationContext";

// Import shadcn components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState("User Name");
  const [loading, setLoading] = useState(true);
  
  // Use notification context instead of local state
  const { 
    recentNotifications, 
    unreadCount, 
    loading: notificationsLoading, 
    markAsRead, 
    setSelectedNotification
  } = useNotifications();
  
  const BASE_URL = 'http://localhost:8081/api/v1';

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await fetch(`${BASE_URL}/user/getByToken`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        console.log('User data from API:', data); // Debug log
        
        // Đảm bảo role được chuẩn hóa thành chữ hoa
        const role = data.user.role?.toUpperCase();
        setUserRole(role);
        setUserName(data.user.name || "User Name");
      } catch (error) {
        console.error('Error fetching user role:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserRole();
  }, []);

  const handleBellClick = () => {
    navigate("/user/messages");
  };

  const handleUserClick = () => {
    if (loading) return; // Chờ dữ liệu load xong
    
    console.log('Navigating with role:', userRole); // Debug log
    
    // Kiểm tra role sau khi đã chuẩn hóa
    if (userRole === 'ADMIN') {
      navigate("/admin/profile");
    } else {
      navigate("/user/profile");
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit'
    });
  };
  
  // Truncate message for preview
  const truncateMessage = (message: string, maxLength: number = 40) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  };

  // Handle notification click to view details
  const handleNotificationClick = async (notification: any) => {
    setSelectedNotification(notification);
    
    // If notification is not read, mark it as read
    if (!notification.read) {
      await markAsRead(notification._id);
    }
    
    // Navigate to messages page
    navigate("/user/messages");
  };

  return (
    <header style={styles.header}>
      <div style={styles.title}>Smart Fruitiez</div>
      <div style={styles.icons}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div style={styles.bellIconContainer}>
              <div style={styles.bellIcon}>
                <FaBell />
              </div>
              {unreadCount > 0 && (
                <div style={styles.notificationBadge}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </div>
              )}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80">
            <DropdownMenuLabel>Thông báo mới</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notificationsLoading ? (
              <div className="p-4 text-center text-sm text-gray-500">
                Đang tải thông báo...
              </div>
            ) : recentNotifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">
                Không có thông báo mới
              </div>
            ) : (
              <>
                {recentNotifications.map((notification) => (
                  <DropdownMenuItem key={notification._id} onClick={() => handleNotificationClick(notification)}>
                    <div className="flex flex-col w-full">
                      <div className="flex justify-between w-full">
                        <span className="font-medium">{notification.senderId}</span>
                        <span className="text-xs text-gray-500">{formatDate(notification.createdAt)}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {truncateMessage(notification.message)}
                      </p>
                      <div className="flex justify-end w-full mt-1">
                        <span className={`text-xs rounded-full px-2 py-0.5 ${notification.read ? 'bg-gray-200 text-gray-600' : 'bg-blue-100 text-blue-600'}`}>
                          {notification.read ? 'Đã đọc' : 'Chưa đọc'}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/user/messages")} className="justify-center">
                  <span className="text-blue-600 font-medium">Xem tất cả thông báo</span>
                </DropdownMenuItem>
              </>
          )}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <div style={styles.user} onClick={handleUserClick}>
          <img
            src="https://i.pravatar.cc/30"
            alt="User Avatar"
            style={styles.avatar}
          />
          <div style={styles.userInfo}>
            <span style={styles.username}>{userName}</span>
            <span style={styles.userLabel}>{userRole || 'User'}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#fff",
  },
  title: {
    color: "#F3569B",
    fontSize: "24px",
    fontWeight: "bold",
  },
  icons: {
    display: "flex",
    alignItems: "center",
  },
  bellIconContainer: {
    position: "relative" as "relative",
    marginRight: "20px",
    cursor: "pointer",
  },
  bellIcon: {
    fontSize: "24px",
    color: "#808191",
    display: "flex",
    alignItems: "center",
  },
  notificationBadge: {
    position: "absolute" as "absolute",
    top: "-5px",
    right: "-5px",
    backgroundColor: "#F3569B",
    color: "white",
    fontSize: "10px",
    fontWeight: "bold",
    width: "16px",
    height: "16px",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  user: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },
  avatar: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    marginRight: "10px",
  },
  userInfo: {
    display: "flex",
    flexDirection: "column" as "column",
  },
  username: {
    fontSize: "16px",
    fontWeight: "bold",
  },
  userLabel: {
    fontSize: "12px",
    color: "#808191",
  },
};

export default Header;