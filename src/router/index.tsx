import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login/Login";
import userRouter from "./UserRoute";
import adminRouter from "./AdminRoute";
import ProtecteRoute from "@/auth/ProtecteRoute";
import ReduxTestPage from "../pages/ReduxTestPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: '/admin/',
    element: <ProtecteRoute />, 
    children: [adminRouter]
  },
  {
      path: '/user/',
      element: <ProtecteRoute />, 
      children: [userRouter]
  },
  {
    path: '/redux-test',
    element: <ReduxTestPage />
  }
]);

