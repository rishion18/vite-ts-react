import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosApi from "../api/axios";

interface Pagination {
  limit: number;
  hasMore: boolean;
  nextCursor: string | null;
}

interface ChatState {
  chatRoom: ChatRoom | null;
  chatRooms: ChatRoom[];
  chatRoomsLoading: boolean;
  chatRoomsError: string | null;
  messages: any[];
  loading: boolean;
  messageLoading: boolean;
  messagesError: string | null;
  pagination: Pagination;
  error: string | null;
}

const initialState: ChatState = {
  chatRoom: null,
  chatRooms: [],
  chatRoomsLoading: false,
  chatRoomsError: null,
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

export const getAllChatRooms = createAsyncThunk(
  "chat/getAllChatRooms",
  async (_, thunkAPI) => {
    try {
      const response = await axiosApi.get(`/chat/get-chat-rooms`);
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
    addNewMessage(state, action) {
      const { chatRoomId } = action.payload;
      console.log('action.payload in addNewMessage', action.payload);
      if (state.chatRoom?._id !== chatRoomId){
        console.log('state.chatRoom._id !== chatRoomId');
        return;
      }
      state.messages.push(action.payload);
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
    updateChatRooms(state, action) {
      const newMessage = action.payload;
      console.log("newMessage in reducer", newMessage);
      if (!state.chatRooms) return; // prevent error if null or undefined

      // Update the chat room
      state.chatRooms = state.chatRooms.map((chatRoom: ChatRoom) => {
        if (chatRoom._id === newMessage.chatRoomId) {
          return {
            ...chatRoom,
            latestMessage: newMessage,
            unreadCount: (chatRoom.unreadCount || 0) + 1,
          };
        }
        return chatRoom;
      });

      console.log(
        "state.chatRooms after latest message updation",
        state.chatRooms
      );

      // Sort chat rooms by latestMessage.createdAt
      state.chatRooms.sort((a: ChatRoom, b: ChatRoom) => {
        const aDate = new Date(a.latestMessage?.createdAt || 0).getTime();
        const bDate = new Date(b.latestMessage?.createdAt || 0).getTime();
        return bDate - aDate;
      });
    },
    clearUnreadCount(state, action) {
      const { chatRoomId } = action.payload;
      state.chatRooms = state.chatRooms.map((chatRoom: ChatRoom) => {
        if (chatRoom._id === chatRoomId) {
          return {
            ...chatRoom,
            unreadCount: 0,
          };
        }
        return chatRoom;
      });
    },
    updateDeliveryStatus(state, action){
      const {_id, status} = action.payload;
      state.messages = state.messages.map((message: Message) => {
        if(message._id === _id){
          console.log('setting deliveryStatus to ', {
            ...message,
            deliveryStatus: status
          });
          return {
            ...message,
            deliveryStatus: status
          }
        }
        return message;
      });
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
      })
      .addCase(getAllChatRooms.pending, (state) => {
        state.chatRoomsLoading = true;
        state.chatRoomsError = null;
      })
      .addCase(getAllChatRooms.fulfilled, (state, action) => {
        state.chatRoomsLoading = false;
        state.chatRooms = action.payload;
      })
      .addCase(getAllChatRooms.rejected, (state, action) => {
        state.chatRoomsLoading = false;
        state.chatRoomsError = action.payload as string;
      });
  },
});

export const {
  setSelectedChatRoom,
  addNewMessage,
  removeMessage,
  setMessages,
  updateChatRooms,
  clearUnreadCount,
  updateDeliveryStatus
} = ChatSlice.actions;
export const chatReducer = ChatSlice.reducer;
