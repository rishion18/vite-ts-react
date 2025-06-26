import { Box, IconButton, TextField, Button, InputAdornment, Typography } from "@mui/material";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import { useSocket } from "../../../socket/socketProvider";
import ChatBubble from "./chatBubble"; // <-- import ChatBubble
import { addNewMessage } from "../../../redux/chatSlice";

const ChatBox:React.FC = () => {
    const [message, setMessage] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const dispatch = useAppDispatch();
  
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        setFile(e.target.files[0]);
      }
    };

    const {chatRoom: currentRoom, messages} = useAppSelector((state) => state.chat);
    const { user } = useAppSelector((state) => state.auth); // <-- get current user
    const socket = useSocket();

    useEffect(() => {
      console.log("Current messages in chat box:", messages);
      // You can also scroll to the bottom of the chat or perform other actions here
    }, [messages]);
  
    const handleSend = () => {
      if(!message.trim()) return;
      const messageBody = {
        text: message,
        type: "text",
        fileUrl: '',
        sender: user?.id,
        reciever: currentRoom?.participants,
      }
      console.log("Message sent payload is:", {chatRoomId: currentRoom?._id, message: messageBody, participants: currentRoom?.participants});
      socket.emit("sendMessage", {chatRoomId: currentRoom?._id, message: messageBody, participants: currentRoom?.participants})
      dispatch(addNewMessage(
        messageBody
      ))
      // Placeholder for send logic
      setMessage("");
      setFile(null);
    };
    return (
      <Box flex={1} display="flex" flexDirection="column" height="100%">
        <Box flex={1} p={2} overflow="auto">
          {/* Render chat bubbles for each message */}
          {messages.map((msg) => (
            <ChatBubble
              key={msg._id}
              message={msg}
              currentUserId={user?._id}
            />
          ))}
        </Box>
        {/* Message Input Area */}
        <Box p={2} borderTop="1px solid #eee" display="flex" alignItems="center" gap={1}>
          <input
            accept="*"
            style={{ display: 'none' }}
            id="file-upload"
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="file-upload">
            <IconButton component="span">
              <AttachFileIcon />
            </IconButton>
          </label>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Type a message..."
            value={message}
            onChange={e => setMessage(e.target.value)}
            fullWidth
            InputProps={{
              endAdornment: file && (
                <InputAdornment position="end">
                  <Typography variant="caption" color="primary">
                    {file.name}
                  </Typography>
                </InputAdornment>
              )
            }}
          />
          <Button variant="contained" color="primary" onClick={handleSend} disabled={!message && !file}>
            Send
          </Button>
        </Box>
      </Box>      
    )
}

export default ChatBox
