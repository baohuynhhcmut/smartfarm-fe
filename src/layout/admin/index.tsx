import Header from "../../components/Header";
import AdminSidebar from "../../components/AdminSidebar";
import { Outlet } from "react-router-dom";

const LayoutAdmin = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="h-full flex flex-row">
        <AdminSidebar />
        <div className="w-full p-10! bg-[#FEF4FF] h-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default LayoutAdmin;
