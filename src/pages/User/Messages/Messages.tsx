import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Messages.css";
import { useAppContext } from "../../../context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";

// Use the same Notification interface as in the NotificationContext
interface Notification {
  _id: string;
  senderId: string;
  receiverId: string;
  message: string;
  createdAt: string;
  read: boolean;
}

const BASE_URL = 'http://localhost:8081/api/v1';

const Messages = () => {
  const { state } = useAppContext();
  const currentUser = state.user.user;
  
  // State for notifications
  const [allNotifications, setAllNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1
  });
  const [currentPage, setCurrentPage] = useState(1);
  
  // Filtering state
  const [filter, setFilter] = useState("");
  const [selectedDateRange, setSelectedDateRange] = useState<
    [Date | null, Date | null]
  >([null, null]);
  const [readStatus, setReadStatus] = useState("All");
  
  // Fetch notifications when component mounts or user changes
  useEffect(() => {
    if (currentUser?.email) {
      fetchNotifications();
      
      // Set up socket connection to receive real-time notifications
      if (window.socketInstance) {
        console.log("Setting up socket for user:", currentUser.email);
        
        // Register user with socket server
        window.socketInstance.emit("register", { 
          email: currentUser.email, 
          role: "USER" 
        });
        
        // Listen for new notifications
        window.socketInstance.on("new_notification", (notification) => {
          console.log("New notification received via socket:", notification);
          
          // Add the new notification at the beginning of the list
          setAllNotifications(prev => {
            // Check if notification already exists to avoid duplicates
            const exists = prev.some(n => n._id === notification._id);
            if (!exists) {
              return [notification, ...prev];
            }
            return prev;
          });
          
          // Show toast notification
          toast.success("Bạn có thông báo mới!", {
            duration: 5000,
            position: "top-right",
            icon: '🔔',
          });
          
          // Show a browser notification if supported
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification("Thông báo mới", {
              body: `Từ: ${notification.senderId} - ${notification.message.substring(0, 50)}${notification.message.length > 50 ? '...' : ''}`
            });
          }
        });
        
        // Listen for read status updates from other tabs/windows
        window.socketInstance.on("notification_read", ({ id }) => {
          setAllNotifications(prev => 
            prev.map(n => n._id === id ? { ...n, read: true } : n)
          );
        });
      }
      
      // Clean up socket listeners when component unmounts
      return () => {
        if (window.socketInstance) {
          window.socketInstance.off("new_notification");
          window.socketInstance.off("notification_read");
        }
      };
    }
  }, [currentUser]);
  
  // Request notification permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "denied") {
      Notification.requestPermission();
    }
  }, []);
  
  const fetchNotifications = async () => {
    if (!currentUser?.email) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      
      console.log(`Fetching notifications for user: ${currentUser.email}`);
      const response = await axios.get(
        `${BASE_URL}/noti/user?user=${currentUser.email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Notifications response:", response.data);

      // Handle different response formats
      if (Array.isArray(response.data)) {
        // Response is an array of notifications without pagination info
        setAllNotifications(response.data);
        setPagination({
          total: response.data.length,
          page: 1,
          limit: 10,
          totalPages: 1
        });
      } else {
        // Response includes notifications and pagination info
        setAllNotifications(response.data.notifications || []);
        
        // If pagination data exists, use it, otherwise set defaults
        if (response.data.pagination) {
          setPagination(response.data.pagination);
        } else {
          setPagination({
            total: response.data.notifications?.length || 0,
            page: 1,
            limit: 10,
            totalPages: 1
          });
        }
      }
      
      setError(null);
    } catch (err: any) {
      console.error("Error fetching notifications:", err);
      setError(err.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };
  
  // Function to handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      setCurrentPage(newPage + 1);
      // We're not using pagination parameters anymore
      fetchNotifications();
    }
  };

  // Function to handle notification click and show details
  const handleNotificationClick = (notification: Notification) => {
    setSelectedNotification(notification);
    
    // If notification is not read, mark it as read
    if (!notification.read) {
      markAsRead(notification._id);
    }
  };
  
  // Function to mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      
      console.log(`Marking notification ${notificationId} as read`);
      
      await axios.put(
        `${BASE_URL}/noti/${notificationId}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Update notification state
      setAllNotifications(prev => 
        prev.map(n => n._id === notificationId ? { ...n, read: true } : n)
      );
      
      // Notify admin that notification was read via socket using the correct event name
      if (window.socketInstance && currentUser?.email) {
        window.socketInstance.emit("mark_as_read", {
          id: notificationId,
          userEmail: currentUser.email
        });
        console.log(`Emitted mark_as_read event for notification ${notificationId}`);
      }
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };
  
  // Function to close message detail popup
  const closeMessageDetail = () => {
    setSelectedNotification(null);
  };

  // Filter notifications based on user input
  const filteredNotifications = allNotifications.filter(
    (notification) =>
      // Text search
      notification.message.toLowerCase().includes(filter.toLowerCase()) &&
      // Read status filter
      (readStatus === "All" ||
       (readStatus === "Read" ? notification.read : !notification.read)) &&
      // Date range filter
      (selectedDateRange[0] === null ||
        selectedDateRange[1] === null ||
        (new Date(notification.createdAt) >= selectedDateRange[0]! &&
         new Date(notification.createdAt) <= selectedDateRange[1]!))
  );

  // Format date to a readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="messages-container">
      <h2>Thông báo của bạn</h2>
      {currentUser?.email && (
        <div className="user-info">
          Đang xem thông báo của: <strong>{currentUser.email}</strong>
        </div>
      )}
      
      <div className="filters">
        <input
          type="text"
          placeholder="Tìm kiếm thông báo"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="filter-input"
        />

        <div className="filter-select">
          <label>Trạng thái:</label>
          <select
            value={readStatus}
            onChange={(e) => setReadStatus(e.target.value)}
          >
            <option value="All">Tất cả</option>
            <option value="Read">Đã đọc</option>
            <option value="Unread">Chưa đọc</option>
          </select>
        </div>

        <div className="filter-select">
          <label>Chọn khoảng thời gian:</label>
          <ReactDatePicker
            selected={selectedDateRange[0]}
            onChange={(date: [Date | null, Date | null]) =>
              setSelectedDateRange(date)
            }
            startDate={selectedDateRange[0]}
            endDate={selectedDateRange[1]}
            selectsRange
            dateFormat="yyyy/MM/dd"
            className="date-picker"
            placeholderText="Chọn khoảng thời gian"
          />
        </div>
      </div>

      {loading ? (
        <div className="loading-message">Đang tải thông báo...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : filteredNotifications.length === 0 ? (
        <div className="no-messages">Không tìm thấy thông báo nào phù hợp với bộ lọc của bạn.</div>
      ) : (
        <div className="messages-list">
          {filteredNotifications.map((notification) => (
            <div
              key={notification._id}
              className={`message-item ${notification.read ? "read" : ""}`}
              onClick={() => handleNotificationClick(notification)}
            >
              <h4>Thông báo từ {notification.senderId}</h4>
              <p className="message-content">{notification.message.length > 100 
                ? `${notification.message.substring(0, 100)}...` 
                : notification.message}
              </p>
              <p className="message-date">Thời gian: {formatDate(notification.createdAt)}</p>
              <div className="message-status">
                {notification.read ? (
                  <span className="read-status">Đã đọc</span>
                ) : (
                  <span className="unread-status">Chưa đọc</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <ReactPaginate
          previousLabel={"Trước"}
          nextLabel={"Sau"}
          pageCount={pagination.totalPages}
          onPageChange={(e) => handlePageChange(e.selected)}
          containerClassName={"pagination"}
          activeClassName={"active"}
          forcePage={currentPage - 1}
        />
      )}
      
      {/* Message Detail Popup */}
      {selectedNotification && (
        <div className="message-detail-overlay" onClick={closeMessageDetail}>
          <div className="message-detail-popup" onClick={(e) => e.stopPropagation()}>
            <div className="message-detail-header">
              <h3>Thông báo từ {selectedNotification.senderId}</h3>
              <button className="close-button" onClick={closeMessageDetail}>×</button>
            </div>
            <div className="message-detail-content">
              <p className="message-detail-time">
                {formatDate(selectedNotification.createdAt)}
              </p>
              <div className="message-detail-text">
                {selectedNotification.message}
              </div>
              <div className="message-status-detail">
                <span className={selectedNotification.read ? "read-status" : "unread-status"}>
                  {selectedNotification.read ? "Đã đọc" : "Chưa đọc"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
