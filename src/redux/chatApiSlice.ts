import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../api/axiosBaseQuery";
import { ENDPOINTS } from "../api/endpoints";

export const chatApiSlice = createApi({
  reducerPath: "chatApi",
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    createChatRoom: builder.mutation({
      query: (body) => ({
        url: ENDPOINTS.CHAT.CREATE_CHATROOM,
        method: "POST",
        data: body,
      }),
    }),
    getChatRooms: builder.query<any, void>({
      query: () => ({
        url: ENDPOINTS.CHAT.GET_CHATROOMS,
        method: "GET",
      }),
    }),
  }),
});

export const { useCreateChatRoomMutation, useGetChatRoomsQuery } = chatApiSlice;
