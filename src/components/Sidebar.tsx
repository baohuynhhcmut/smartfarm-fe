import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaDev,
  FaHistory,
  FaChartLine,
  FaEnvelope,
  FaUser,
} from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = () => {
  const location = useLocation();

  // Helper function to check if path is active
  const isActive = (path: string) => {
    return location.pathname.startsWith(`/user${path}`);
  };

  return (
    <div className="sidebar">
      <Link
        to="/user"
        className={`sidebar-item ${location.pathname === "/user" ? "active" : ""}`}
      >
        <FaHome />
        <span>Home</span>
      </Link>
      <Link
        to="/user/devices"
        className={`sidebar-item ${isActive("/devices") ? "active" : ""}`}
      >
        <FaDev />
        <span>Devices</span>
      </Link>
      <Link
        to="/user/history"
        className={`sidebar-item ${isActive("/history") ? "active" : ""}`}
      >
        <FaHistory />
        <span>History</span>
      </Link>
      <Link
        to="/user/analytics"
        className={`sidebar-item ${isActive("/home2") ? "active" : ""}`}
      >
        <FaChartLine />
        <span>Analytics</span>
      </Link>
      <Link
        to="/user/messages"
        className={`sidebar-item ${isActive("/messages") ? "active" : ""}`}
      >
        <FaEnvelope />
        <span>Messages</span>
      </Link>
      <Link
        to="/user/profile"
        className={`sidebar-item ${isActive("/profile") ? "active" : ""}`}
      >
        <FaUser />
        <span>My Profile</span>
      </Link>
    </div>
  );
};

export default Sidebar;