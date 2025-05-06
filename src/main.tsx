import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/index.tsx";
import { AppProvider } from "./context/AppContext";
import { NotificationProvider } from "./context/NotificationContext";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")!).render(
  <AppProvider>
    <NotificationProvider>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </NotificationProvider>
  </AppProvider>
);
