import React from "react";
import { FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleBellClick = () => {
    navigate("/message");
  };

  const handleUserClick = () => {
    navigate("/profile");
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
            <span style={styles.username}>User Name</span>
            <span style={styles.userLabel}>User</span>
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
    // border: "1px"
    // boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
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
