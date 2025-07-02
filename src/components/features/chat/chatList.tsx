import { Box, useTheme } from "@mui/material";
import ChatItem from "./chatItem";
import { useGetChatRoomsQuery } from "../../../redux/chatApiSlice";
import { useSocket } from "../../../socket/socketProvider";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import { getChatRoom, setSelectedChatRoom } from "../../../redux/chatSlice";
import Logo from "./logo";
import ChatListFilters from "./chatListFilters";

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

  const theme = useTheme();

  const sendChatListEvent = () => {
    let payload: string[] = [];

    console.log(
      "Current room found while sending chat list event:",
      currentRoom
    );

    payload =
      chatRooms?.data
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
    if (currentRoom?._id === chatRoom._id) return;
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
      width={"100%"}
      height={"100%"}
      display="flex"
      flexDirection="column"
      sx={{
        borderRight: `1px solid ${theme.palette.divider}`
      }}
    >
      {/* Sticky Header with Logo */}
      <Box
        p={2}
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Logo />
        <ChatListFilters/>
      </Box>

      {/* Scrollable Chat Items */}
      <Box
        flex={1}
        overflow="auto"
        padding={2}
        sx={{
          // WhatsApp-style scrollbar styles
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme.palette.background.paper,
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            }
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: theme.palette.background.default,
          },
          // Firefox scrollbar
          scrollbarWidth: 'thin',
          scrollbarColor: `${theme.palette.background.paper} ${theme.palette.background.default}`,
        }}
      >
        {chatRooms?.data?.map((item: any, index: number) => (
          <div key={index} onClick={() => handleChatItemClick(item)}>
            <Box
              width={"100%"}
              bgcolor={theme.palette.background.default}
              p={2}
              borderRadius={2}
              sx={{
                ":hover": {
                  backgroundColor: theme.palette.action.hover,
                  cursor: "pointer",
                }
              }}
            >
              <ChatItem
                key={index}
                message={item.latestMessage?.text || "No messages yet"}
                unreadCount={0}
              />
            </Box>
          </div>
        ))}
      </Box>
    </Box>
  );
};

export default ChatList;