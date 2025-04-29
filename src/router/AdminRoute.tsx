import LayoutAdmin from "@/layout/admin";
import DashboardAdmin from "@/pages/Admin/Dashboard";
import DeviceAdmin from "@/pages/Admin/Device";
import UserAdmin from "@/pages/Admin/User";

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
        element: <UserAdmin />,
    },
    {
        path: "devices",
        element: <DeviceAdmin />,
    },
  ],
};

export default adminRouter;
