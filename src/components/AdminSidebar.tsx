import { Link, useLocation } from "react-router-dom";
import { FaHome, FaUser, FaDev } from "react-icons/fa";
import "./Sidebar.css";

const AdminSidebar = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/admin") {
      return location.pathname === "/admin" || location.pathname === "/admin/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="sidebar">
      <Link
        to="/admin"
        className={`sidebar-item ${isActive("/admin") ? "active" : ""}`}
      >
        <FaHome />
        <span>Home</span>
      </Link>
      <Link
        to="/admin/user"
        className={`sidebar-item ${isActive("/admin/user") ? "active" : ""}`}
      >
        <FaUser />
        <span>Users</span>
      </Link>
      <Link
        to="/admin/device"
        className={`sidebar-item ${isActive("/admin/device") ? "active" : ""}`}
      >
        <FaDev />
        <span>Devices</span>
      </Link>
    </div>
  );
};

export default AdminSidebar;
