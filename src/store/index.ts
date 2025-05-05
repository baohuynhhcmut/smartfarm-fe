import { configureStore } from "@reduxjs/toolkit";
import messagesReducer from "./User/messagesSlice";
import userReducer from "./UserSlice";
import socketReducer from "./SocketSlice";
import sensorDataReducer from "./SensorDataSlice";

export const store = configureStore({
  reducer: {
    messages: messagesReducer,
    user: userReducer,
    socket: socketReducer,
    sensorData: sensorDataReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
