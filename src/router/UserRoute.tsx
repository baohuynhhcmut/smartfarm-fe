import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home/Home";
import Devices from "../pages/Devices";
import HomePage2 from "../pages/HomePage/HomePage2";
import Messages from "../pages/Messages/Messages";
import History from "../pages/History";
import LayoutUser from "../layout/user";
import Profile from "../pages/Profile";



export const router = createBrowserRouter([
  {
    path: "/user",
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
        path: "/profile",
        element: <Profile />
      },
      {
        path: "home2",
        element: <HomePage2 />,
      },
      {
        path: "messages",
        element: <Messages />,
      },
      {
        path: 'history',
        element: <History/>
      }
    ],
  },
]);
   
