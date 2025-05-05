import Home from "../pages/User/Home/Home";
import Devices from "../pages/User/Devices";
import HomePage2 from "../pages/User/HomePage/HomePage2";
import Messages from "../pages/User/Messages/Messages";
import History from "../pages/User/History";
import LayoutUser from "../layout/user";
import Profile from "../pages/User/Profile";

const userRouter = {
    path: "",
    element: <LayoutUser />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "devices",
        element: <Devices />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "analytics",
        element: <HomePage2 />,
      },
      {
        path: "messages",
        element: <Messages />,
      },
      {
        path: "history",
        element: <History />,
      },
    ],
}
 

export default userRouter;
