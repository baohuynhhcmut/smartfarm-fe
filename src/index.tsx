import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { AppProvider } from "./context/AppContext";
import "./index.css";

// Đảm bảo DOM element tồn tại
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element không tồn tại. Vui lòng kiểm tra HTML của bạn.");
}

// Tạo root
const root = ReactDOM.createRoot(rootElement as HTMLElement);

// Render ứng dụng với Context API Provider
root.render(
  <StrictMode>
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  </StrictMode>
);
