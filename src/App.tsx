import React from "react";
import { ActivityProvider } from "@/context/ActivityContext";

const App: React.FC = () => {
  return <ActivityProvider>{/* Your existing app content */}</ActivityProvider>;
};

export default App;
