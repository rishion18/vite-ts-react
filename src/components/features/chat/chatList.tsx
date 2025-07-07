import { Box, useTheme } from "@mui/material";
import ChatItem from "./chatItem";
import { useSocket } from "../../../socket/socketProvider";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import {
  clearUnreadCount,
  getAllChatRooms,
  getChatRoom,
  setSelectedChatRoom,
  updateChatRooms,
} from "../../../redux/chatSlice";
import Logo from "./logo";
import ChatListFilters from "./chatListFilters";

const ChatList: React.FC = () => {
  const socket = useSocket();
  const dispatch = useAppDispatch();

  const {
    chatRoom: currentRoom,
    chatRooms,
    chatRoomsLoading,
    chatRoomsError,
  } = useAppSelector((state) => state.chat);

  const theme = useTheme();
  const { user } = useAppSelector((state) => state.auth);

  console.log("userid", user?.id);

  useEffect(() => {
    dispatch(getAllChatRooms());
  }, []);

  const sendChatListEvent = () => {
    let payload: string[] = [];

    console.log(
      "Current room found while sending chat list event:",
      currentRoom
    );

    payload =
      chatRooms
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
    payload = chatRooms?.map((room: any) => room?._id);
    socket.emit("leaveChatListViewers", { chatRooms: payload });
  };

  useEffect(() => {
    if (chatRooms && chatRooms?.length > 0) {
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
    //join room and leave chatList taken care at backend
    socket.emit("joinChatRoomViewers", { chatRoomId: chatRoom._id });
    // socket.emit("leaveChatListViewers", { chatRooms: [chatRoom._id] });
    //leave previous room if any
    const previousRoomId = currentRoom?._id;
    if (previousRoomId) {
      console.log(`Leaving previous chat room: ${previousRoomId}`);
      //when user leaves this previous room , it will also be added to chatlist again
      leaveChatRoom(previousRoomId);
      // socket.emit("joinChatListViewers", { chatRooms: [previousRoomId] });
    }
    dispatch(setSelectedChatRoom(chatRoom));
    dispatch(getChatRoom(chatRoom._id));
    dispatch(clearUnreadCount({chatRoomId: chatRoom._id}));
  };

  useEffect(() => {
    if (!socket) return;

    const handleIncomingMessage = (data: any) => {
      console.log("Incoming message from chatListUpdate", data.message);
      dispatch(updateChatRooms(data.message));
    };

    socket.on("chatListUpdate", handleIncomingMessage);
    return () => {
      // socket.off("chatListUpdate", handleIncomingMessage);
    };
  }, [socket, dispatch]);

  if (chatRoomsLoading) {
    return <Box p={2}>Loading chat rooms...</Box>;
  }

  if (chatRoomsError) {
    return <Box p={2}>Error loading chat rooms</Box>;
  }

  return (
    <Box
      width={"100%"}
      height={"100%"}
      display="flex"
      flexDirection="column"
      sx={{
        borderRight: `1px solid ${theme.palette.divider}`,
      }}
    >
      {/* Sticky Header with Logo */}
      <Box
        p={2}
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Logo />
        <ChatListFilters />
      </Box>

      {/* Scrollable Chat Items */}
      <Box
        flex={1}
        overflow="auto"
        padding={2}
        sx={{
          // WhatsApp-style scrollbar styles
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: theme.palette.background.paper,
            borderRadius: "4px",
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
            },
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: theme.palette.background.default,
          },
          // Firefox scrollbar
          scrollbarWidth: "thin",
          scrollbarColor: `${theme.palette.background.paper} ${theme.palette.background.default}`,
        }}
      >
        {chatRooms?.map((item: ChatRoom, index: number) => (
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
                },
              }}
            >
              <ChatItem
                key={index}
                message={item.latestMessage?.text || "No messages yet"}
                unreadCount={item.unreadCount}
                chatItem={item}
              />
            </Box>
          </div>
        ))}
      </Box>
    </Box>
  );
};

export default ChatList;
