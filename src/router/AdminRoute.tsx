
import LayoutAdmin from "@/layout/admin";
import DashboardAdmin from "@/pages/Admin/Dashboard/AdminDashboard";
import DeviceAdmin from "@/pages/Admin/Device";
import UserPage from "@/pages/Admin/User/UserManagement";
// import UserAdmin from "@/pages/Admin/User/UserManagement";
import Profile from "../pages/User/Profile";
const adminRouter = {
  path: "",
  element: <LayoutAdmin />,
  children: [
    {
        index: true,
        element: <DashboardAdmin />,
    },
    {
        path: "users",
        element: <UserPage />,
    },
    {
        path: "devices",
        element: <DeviceAdmin />,
    },
    {
      path: "profile",
      element: <Profile />,
    },
  ],
};

export default adminRouter;
