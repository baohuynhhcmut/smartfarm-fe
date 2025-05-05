import React, { useState, useEffect } from "react";
import { FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState("User Name");
  const [loading, setLoading] = useState(true);
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
    navigate("/message");
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

  return (
    <header style={styles.header}>
      <div style={styles.title}>Smart Fruitiez</div>
      <div style={styles.icons}>
        <div style={styles.bellIcon} onClick={handleBellClick}>
          <FaBell />
        </div>
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
  bellIcon: {
    fontSize: "24px",
    cursor: "pointer",
    marginRight: "20px",
    color: "#808191",
    display: "flex",
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