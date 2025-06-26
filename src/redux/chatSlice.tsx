import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosApi from "../api/axios";

interface ChatState {
  chatRoom: ChatRoom | null;
  messages: any[];
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  chatRoom: null,
  messages: [],
  loading: false,
  error: null,
};

export const getChatRoom = createAsyncThunk(
  "chat/getChatRoom",
  async (chatRoomId: string, thunkAPI) => {
    try {
      const response = await axiosApi.get(
        `/chat/get-messages-for-chat-room/${chatRoomId}`
      );
      console.log("Chat room data:", response.data.data);
        return response.data.data; // Assuming the response contains the chat room data
    } catch (error) {
      const axiosError = error as Error;
      return thunkAPI.rejectWithValue(
        axiosError.message || "Failed to fetch chat room"
      );
    }
  }
);

const ChatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setSelectedChatRoom(state, action) {
      state.chatRoom = action.payload;
    },
    addNewMessage(state, action){
      state.messages = [...state.messages, action.payload];
    },
    removeMessage(state, action) {
      const {messageId} = action.payload;
      state.messages = state.messages.filter(
        (message) => message._id !== messageId
      );
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getChatRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getChatRoom.fulfilled, (state, action) => {
        state.loading = false;
        console.log("Chat room fetched successfully:", action.payload);
        state.messages = action.payload.messages || [];
      })
      .addCase(getChatRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedChatRoom, addNewMessage, removeMessage } = ChatSlice.actions;
export const chatReducer = ChatSlice.reducer;
