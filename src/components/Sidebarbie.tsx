import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaHome, FaDev, FaUser, FaSignOutAlt, FaBell } from "react-icons/fa";
import "./Sidebar.css"; // Sử dụng chung file CSS với sidebar thông thường

const Sidebarbie = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Helper function to check if path is active
  const isActive = (path: string) => {
    return location.pathname.startsWith(`/admin${path}`);
  };
  const handleLogout = () => {
    // Add your logout logic here
    console.log("Logging out...");
    // For example, clear user session and redirect to login
    navigate("/");
  };

  return (
    <div className="sidebar">
      <div className="side">
      <Link
        to="/admin"
        className={`sidebar-item ${location.pathname === "/admin" ? "active" : ""}`}
      >
        <FaHome />
        <span>Home</span>
      </Link>
      <Link
        to="/admin/devices"
        className={`sidebar-item ${isActive("/devices") ? "active" : ""}`}
      >
        <FaDev />
        <span>Devices</span>
      </Link>
      <Link
        to="/admin/users"
        className={`sidebar-item ${isActive("/users") ? "active" : ""}`}
      >
        <FaUser />
        <span>Users</span>
      </Link>
      <Link
        to="/admin/notifications"
        className={`sidebar-item ${isActive("/notifications") ? "active" : ""}`}
      >
        <FaBell />
        <span>Notifications</span>
      </Link>
      </div>
      <div className="sidebar-item logout-button" onClick={handleLogout}>
        <FaSignOutAlt />
        <span>Logout</span>
      </div>
    </div>
  );
};

export default Sidebarbie;