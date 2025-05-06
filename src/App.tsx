import React from "react";
import { ActivityProvider } from "@/context/ActivityContext";
import { Toaster } from "react-hot-toast";
import { NotificationProvider } from "./context/NotificationContext";

const App: React.FC = () => {
  return (
    <ActivityProvider>
      <NotificationProvider>
        {/* Your existing app content */}
        <Toaster position="top-right" />
      </NotificationProvider>
    </ActivityProvider>
  );
};

export default App;
