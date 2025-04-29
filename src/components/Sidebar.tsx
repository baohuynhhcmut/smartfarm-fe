import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaDev,
  FaHistory,
  FaChartLine,
  FaEnvelope,
  FaUser,
} from "react-icons/fa"; // Import các icon
import "./Sidebar.css";

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="sidebar">
      <Link
        to="/"
        className={`sidebar-item ${location.pathname === "/" ? "active" : ""}`}
      >
        <FaHome /> {/* Icon Home */}
        <span>Home</span>
      </Link>
      <Link
        to="/devices"
        className={`sidebar-item ${
          location.pathname === "/devices" ? "active" : ""
        }`}
      >
        <FaDev /> {/* Icon Devices */}
        <span>Devices</span>
      </Link>
      <Link
        to="/history"
        className={`sidebar-item ${
          location.pathname === "/history" ? "active" : ""
        }`}
      >
        <FaHistory /> {/* Icon History */}
        <span>History</span>
      </Link>
      <Link
        to="/analytics"
        className={`sidebar-item ${
          location.pathname === "/analytics" ? "active" : ""
        }`}
      >
        <FaChartLine /> {/* Icon Analytics */}
        <span>Analytics</span>
      </Link>
      <Link
        to="/messages"
        className={`sidebar-item ${
          location.pathname === "/messages" ? "active" : ""
        }`}
      >
        <FaEnvelope /> {/* Icon Messages */}
        <span>Messages</span>
      </Link>
      <Link
        to="/profile"
        className={`sidebar-item ${
          location.pathname === "/profile" ? "active" : ""
        }`}
      >
        <FaUser /> {/* Icon Profile */}
        <span>My Profile</span>
      </Link>
      {/* ... rest of the code remains the same */}
    </div>
  );
};

export default Sidebar;
