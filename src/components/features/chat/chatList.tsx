import { Box } from "@mui/material";
import ChatItem from "./chatItem";
import { useGetChatRoomsQuery } from "../../../redux/chatApiSlice";
import { useSocket } from "../../../socket/socketProvider";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
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
  const { chatRoom: currentRoom } = useAppSelector((state) => state.chat);

const sendChatListEvent = () => {
  let payload: string[] = [];

  console.log("Current room found while sending chat list event:", currentRoom);

  payload = chatRooms?.data
    ?.filter((room: ChatRoom) => {
      if (currentRoom?._id) {
        return room._id !== currentRoom._id;
      }
      return true; 
    })
    ?.map((room: ChatRoom) => room._id) || [];

  console.log("Emitting chat list event with payload:", payload);
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
    //join room and leave chatList
    socket.emit("joinChatRoomViewers", { chatRoomId: chatRoom._id });
    socket.emit("leaveChatListViewers", { chatRooms: [chatRoom._id] });
    //leave previous room if any
    const previousRoomId = currentRoom?._id;
    if (previousRoomId) {
      console.log(`Leaving previous chat room: ${previousRoomId}`);
      leaveChatRoom(previousRoomId);
      socket.emit("joinChatListViewers", { chatRooms: [previousRoomId] });
    }
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
