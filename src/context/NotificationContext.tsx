import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface Notification {
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

interface NotificationContextType {
  // Recent notifications for Header (5)
  recentNotifications: Notification[];
  // All notifications with pagination for Messages page
  allNotifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  markAsRead: (id: string) => Promise<void>;
  selectedNotification: Notification | null;
  setSelectedNotification: (notification: Notification | null) => void;
  fetchNotifications: () => Promise<void>;
  // Pagination for Messages page
  pagination: PaginationInfo;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  fetchPaginatedNotifications: (page: number) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  // Recent notifications for Header (5 most recent)
  const [recentNotifications, setRecentNotifications] = useState<Notification[]>([]);
  // All notifications with pagination for Messages page
  const [allNotifications, setAllNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  
  // Pagination state
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });
  const [currentPage, setCurrentPage] = useState(1);
  
  // Hardcoded BASE_URL to avoid process.env issues
  const BASE_URL = 'http://localhost:8081/api/v1';

  // Get user info when component mounts
  useEffect(() => {
    const fetchUserInfo = async () => {
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
        const role = data.user.role?.toUpperCase();
        setUserRole(role);
        setUserEmail(data.user.email || null);
        
        // Fetch notifications if user email is available
        if (data.user.email) {
          fetchNotifications();
          fetchPaginatedNotifications(1);
          setupSocketConnection(data.user.email, role);
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
        setError('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  // Function to fetch recent notifications (5) for Header
  const fetchNotifications = async () => {
    if (!userEmail) return;
    
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/noti/user?user=${userEmail}`);
      
      // Get only the 5 most recent notifications for the header
      const recentNotes = response.data.slice(0, 5);
      setRecentNotifications(recentNotes);
      
      // Count unread notifications from all notifications
      const unread = response.data.filter((n: Notification) => !n.read).length;
      setUnreadCount(unread);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching notifications:", err);
      setError("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };
  
  // Function to fetch paginated notifications (10 per page) for Messages page
  const fetchPaginatedNotifications = async (page: number) => {
    if (!userEmail) return;
    
    setLoading(true);
    try {
      // For now, we'll use the same API but manually paginate
      // In the future, you might want to implement server-side pagination
      const response = await axios.get(`${BASE_URL}/noti/user?user=${userEmail}`);
      
      const allNotifs = response.data;
      const limit = 10;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      
      // Paginate notifications manually
      const paginatedNotifs = allNotifs.slice(startIndex, endIndex);
      setAllNotifications(paginatedNotifs);
      
      // Update pagination info
      setPagination({
        total: allNotifs.length,
        page: page,
        limit: limit,
        totalPages: Math.ceil(allNotifs.length / limit)
      });
      
      // Update current page
      setCurrentPage(page);
      
      setError(null);
    } catch (err: any) {
      console.error("Error fetching paginated notifications:", err);
      setError("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };
  
  // Set up socket connection for real-time notifications
  const setupSocketConnection = (email: string, role: string) => {
    if (window.socketInstance && !window.socketInstance.connected) {
      window.socketInstance.connect();
    }
    
    // Register user with socket
    if (window.socketInstance) {
      window.socketInstance.emit("register", { email, role });
    
      // Listen for new notifications
      window.socketInstance.on("new_notification", (newNotification: Notification) => {
        console.log("Received new notification:", newNotification);
        
        // Only process notifications intended for this user
        if (newNotification.receiverId === email) {
          // Show toast notification
          toast.custom((t) => (
            <div
              className={`${
                t.visible ? 'animate-enter' : 'animate-leave'
              } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
            >
              <div className="flex-1 w-0 p-4">
                <div className="flex items-start">
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      Thông báo mới từ {newNotification.senderId}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {newNotification.message.length > 60
                        ? `${newNotification.message.substring(0, 60)}...`
                        : newNotification.message}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex border-l border-gray-200">
                <button
                  onClick={() => {
                    toast.dismiss(t.id);
                    window.location.href = "/user/message";
                  }}
                  className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Xem
                </button>
              </div>
            </div>
          ), {
            duration: 5000,
          });
          
          // Add to recent notifications for header with read = false
          setRecentNotifications(prev => {
            const newRecent = [{
              ...newNotification,
              read: false
            }, ...prev];
            // Keep only the 5 most recent
            return newRecent.slice(0, 5);
          });
          
          // Add to all notifications if on the first page
          if (currentPage === 1) {
            setAllNotifications(prev => {
              const newAll = [{
                ...newNotification,
                read: false
              }, ...prev];
              // Keep only up to the limit
              return newAll.slice(0, pagination.limit);
            });
          }
          
          // Update pagination total count
          setPagination(prev => ({
            ...prev,
            total: prev.total + 1,
            totalPages: Math.ceil((prev.total + 1) / prev.limit)
          }));
          
          // Increment unread count
          setUnreadCount(count => count + 1);
        }
      });
      
      // Listen for notification read updates
      window.socketInstance.on("notification_read", (updatedNotification: { id: string }) => {
        // Update recent notifications
        setRecentNotifications(prev => 
          prev.map(notification => 
            notification._id === updatedNotification.id
              ? { ...notification, read: true }
              : notification
          )
        );
        
        // Update all notifications
        setAllNotifications(prev => 
          prev.map(notification => 
            notification._id === updatedNotification.id
              ? { ...notification, read: true }
              : notification
          )
        );
        
        // Update unread count
        setUnreadCount(prev => Math.max(0, prev - 1));
      });
    }
    
    // Clean up function
    return () => {
      if (window.socketInstance) {
        window.socketInstance.off("new_notification");
        window.socketInstance.off("notification_read");
      }
    };
  };

  // Function to mark a notification as read
  const markAsRead = async (id: string) => {
    try {
      const response = await axios.put(`${BASE_URL}/noti/${id}/read`);
      if (response.status === 200) {
        // Update recent notifications
        setRecentNotifications(
          recentNotifications.map(notification => 
            notification._id === id 
              ? { ...notification, read: true } 
              : notification
          )
        );
        
        // Update all notifications
        setAllNotifications(
          allNotifications.map(notification => 
            notification._id === id 
              ? { ...notification, read: true } 
              : notification
          )
        );
        
        // Update unread count
        setUnreadCount(prev => Math.max(0, prev - 1));
        
        // Emit socket event to notify other components of the change
        if (window.socketInstance && window.socketInstance.connected && userEmail) {
          window.socketInstance.emit("mark_as_read", { id, userEmail });
        }
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Truncate message for preview
  const truncateMessage = (message: string, maxLength: number = 40) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  };

  const value = {
    recentNotifications,
    allNotifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    selectedNotification,
    setSelectedNotification,
    fetchNotifications,
    pagination,
    currentPage,
    setCurrentPage,
    fetchPaginatedNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}; 