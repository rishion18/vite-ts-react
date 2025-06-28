import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosApi from "../api/axios";

interface Pagination {
  limit: number;
  hasMore: boolean;
  nextCursor: string | null;
}

interface ChatState {
  chatRoom: ChatRoom | null;
  messages: any[];
  loading: boolean;
  messageLoading: boolean;
  messagesError: string | null;
  pagination: Pagination;
  error: string | null;
}

const initialState: ChatState = {
  chatRoom: null,
  messages: [],
  loading: false,
  messageLoading: false,
  messagesError: null,
  pagination: {
    limit: 10,
    hasMore: true,
    nextCursor: null,
  },
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

export const getMessages = createAsyncThunk(
  "chat/getMessages",
  async (
    {
      chatRoomId,
      cursor,
      limit,
    }: { chatRoomId: string; cursor: string | null; limit: number },
    thunkAPI
  ) => {
    try {
      const query = cursor
        ? `cursor=${cursor}&limit=${limit}`
        : `limit=${limit}`;
      const response = await axiosApi.get(
        `/chat/get-messages-for-chat-room/${chatRoomId}?${query}`
      );
      return response.data.data; // { messages: [], pagination: { ... } }
    } catch (error) {
      const axiosError = error as Error;
      return thunkAPI.rejectWithValue(
        axiosError.message || "Failed to fetch messages"
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
    addNewMessage(state, action) {
      state.messages = [...state.messages, action.payload];
    },
    removeMessage(state, action) {
      const { messageId } = action.payload;
      state.messages = state.messages.filter(
        (message) => message._id !== messageId
      );
    },
    setMessages(state, action) {
      // action.payload: { prepend: boolean, messages: [] }
      if (action.payload.prepend) {
        state.messages = [...action.payload.messages, ...state.messages];
      } else {
        state.messages = action.payload.messages;
      }
    },
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
        // state.messages = action.payload.messages || [];
      })
      .addCase(getChatRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getMessages.pending, (state) => {
        state.messageLoading = true;
        state.messagesError = null;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.messageLoading = false;
        const { messages, pagination } = action.payload;
        state.messages = [...messages, ...state.messages];
        state.pagination = pagination || initialState.pagination;
      });
  },
});

export const {
  setSelectedChatRoom,
  addNewMessage,
  removeMessage,
  setMessages,
} = ChatSlice.actions;
export const chatReducer = ChatSlice.reducer;
