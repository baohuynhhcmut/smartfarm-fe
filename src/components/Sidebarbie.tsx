import { Link, useLocation } from "react-router-dom";
import { FaHome, FaDev, FaUser } from "react-icons/fa";
import "./Sidebar.css"; // Sử dụng chung file CSS với sidebar thông thường

const Sidebarbie = () => {
  const location = useLocation();

  // Helper function to check if path is active
  const isActive = (path: string) => {
    return location.pathname.startsWith(`/admin${path}`);
  };

  return (
    <div className="sidebar">
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
    </div>
  );
};

export default Sidebarbie;