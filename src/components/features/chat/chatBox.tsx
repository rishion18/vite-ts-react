import { Box, IconButton, TextField, Button, InputAdornment, Typography } from "@mui/material";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { useEffect, useState } from "react";
import { useAppSelector } from "../../../redux/hook";

const ChatBox:React.FC = () => {
    const [message, setMessage] = useState("");
    const [file, setFile] = useState<File | null>(null);
  
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        setFile(e.target.files[0]);
      }
    };

    const {messages} = useAppSelector((state) => state.chat);

    useEffect(() => {
      // This effect can be used to handle any side effects related to messages
      console.log("Messages updated:", messages);
      // You can also scroll to the bottom of the chat or perform other actions here
    }, [messages]);
  
    const handleSend = () => {
      // Placeholder for send logic
      setMessage("");
      setFile(null);
    };
    return (
      <Box flex={1} display="flex" flexDirection="column" height="100%">
        <Box flex={1} p={2} overflow="auto">
          {/* Chat messages would go here */}
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
