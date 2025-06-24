import { Box } from "@mui/material"
import ChatItem from "./chatItem"
import { useGetChatRoomsQuery } from "../../../redux/chatApiSlice"
import { useSocket } from "../../../socket/socketProvider";
import { useEffect } from "react";

const ChatList:React.FC = () => {

  const {
    data: chatRooms,
    isLoading,
    isError,
    error,
    refetch
  } = useGetChatRoomsQuery();

  const socket = useSocket();

  const sendChatListEvent = () => {
    let payload = [];
        payload = chatRooms?.data?.map((room:any) => room?._id)
     socket.emit('joinChatListViewers', {chatRooms:payload})
  }

  useEffect(() => {
    if(chatRooms && chatRooms?.data?.length > 0) {
      console.log('emiting chatrooms for list')
      sendChatListEvent();
    }
  }, [chatRooms]);

  if (isLoading) {
    return <Box p={2}>Loading chat rooms...</Box>;
  }

  if (isError) {
    return <Box p={2}>Error loading chat rooms</Box>;
  }

    return (
      <Box width={{ xs: '40%', md: '30%', lg: '25%' }} bgcolor="#f5f5f5" p={2} overflow="auto" borderRight="1px solid #eee">
        {chatRooms?.data?.map((item:any) => (
          <ChatItem
            key={item._id}
            message={`Chat message preview for chat }`}
            unreadCount={item % 2 === 0 ? item : 0}
          />
        ))}
      </Box> 
    )
}

export default ChatList