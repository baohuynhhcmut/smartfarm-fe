import { configureStore } from "@reduxjs/toolkit";
import messagesReducer from "./User/messagesSlice";
import userReducer from "./UserSlice";

export const store = configureStore({
  reducer: {
    messages: messagesReducer,
    user:userReducer
  },
});
