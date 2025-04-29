import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Message {
  id: number;
  title: string;
  detail: string;
  sentBy: string;
  date: string;
  device: string;
  isRead: boolean;
}

interface MessagesState {
  messages: Message[];
  filter: string;
}

const initialState: MessagesState = {
  messages: [
    {
      id: 1,
      title: "Message 1",
      detail: "Details about message 1",
      sentBy: "Admin",
      date: "2022-03-28",
      device: "Sensor 1",
      isRead: false,
    },
    {
      id: 2,
      title: "Message 2",
      detail: "Details about message 2",
      sentBy: "Admin",
      date: "2022-03-28",
      device: "Sensor 2",
      isRead: false,
    },
  ],
  filter: "",
};

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<string>) => {
      state.filter = action.payload;
    },
    toggleRead: (state, action: PayloadAction<number>) => {
      const message = state.messages.find((msg) => msg.id === action.payload);
      if (message) {
        message.isRead = !message.isRead;
      }
    },
  },
});

export const { setFilter, toggleRead } = messagesSlice.actions;

export default messagesSlice.reducer;
