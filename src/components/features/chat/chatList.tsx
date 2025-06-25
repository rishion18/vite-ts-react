import { Box } from "@mui/material";
import ChatItem from "./chatItem";
import { useGetChatRoomsQuery } from "../../../redux/chatApiSlice";
import { useSocket } from "../../../socket/socketProvider";
import { useEffect } from "react";
import { useAppDispatch } from "../../../redux/hook";
import type { ChatRoom } from "../../../types/global";
import { getChatRoom, setSelectedChatRoom } from "../../../redux/chatSlice";

const ChatList: React.FC = () => {
  const {
    data: chatRooms,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetChatRoomsQuery();

  const socket = useSocket();
  const dispatch = useAppDispatch();

  const sendChatListEvent = () => {
    let payload = [];
    payload = chatRooms?.data?.map((room: any) => room?._id);
    socket.emit("joinChatListViewers", { chatRooms: payload });
  };

  const leaveChatListEvent = () => {
    let payload = [];
    payload = chatRooms?.data?.map((room: any) => room?._id);
    socket.emit("leaveChatListViewers", { chatRooms: payload });
  };

  useEffect(() => {
    if (chatRooms && chatRooms?.data?.length > 0) {
      console.log("emiting chatrooms for list");
      sendChatListEvent();
    }
    return () => {
      //leave chat room
    };
  }, [chatRooms]);

  const leaveChatRoom = (chatRoomId: string) => {
    console.log(`Leaving chat room: ${chatRoomId}`);
    // Emit leave event to the server
    socket.emit("leaveChatRoomViewers", { chatRoomId });
  };

  const handleChatItemClick = (chatRoom: ChatRoom) => {
    console.log(`Chat item clicked: ${chatRoom._id}`);
    //join room event here
    socket.emit("joinChatRoomViewers", { chatRoomId: chatRoom._id });
    dispatch(setSelectedChatRoom(chatRoom));
    dispatch(getChatRoom(chatRoom._id));
  };

  if (isLoading) {
    return <Box p={2}>Loading chat rooms...</Box>;
  }

  if (isError) {
    return <Box p={2}>Error loading chat rooms</Box>;
  }

  return (
    <Box
      width={{ xs: "40%", md: "30%", lg: "25%" }}
      bgcolor="#f5f5f5"
      p={2}
      overflow="auto"
      borderRight="1px solid #eee"
    >
      {chatRooms?.data?.map((item: any) => (
        <div key={item._id} onClick={() => handleChatItemClick(item)}>
          <ChatItem
            key={item._id}
            message={`Chat message preview for chat }`}
            unreadCount={item % 2 === 0 ? item : 0}
          />
        </div>
      ))}
    </Box>
  );
};

export default ChatList;
