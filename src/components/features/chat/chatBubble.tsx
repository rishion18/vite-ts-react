import React, { useState } from "react";
import { Box, Typography, IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useAppSelector } from "../../../redux/hook";

// Props: message object and currentUserId
const ChatBubble: React.FC<{
  message: any;
  currentUserId: string;
}> = ({ message, currentUserId }) => {
 const {user} = useAppSelector((state) => state.auth);
 console.log("currennt userId and  sender id are:",message?.sender,user);
  const isSender = message.sender === user?.id;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Determine if message is image
  const isImage =
    message.type === "image" ||
    (message.fileUrl &&
      (message.fileUrl.endsWith(".png") || message.fileUrl.endsWith(".jpg") || message.fileUrl.endsWith(".jpeg")));

  return (
    <Box
      display="flex"
      justifyContent={isSender ? "flex-end" : "flex-start"}
      mb={1}
    >
      <Box
        position="relative"
        maxWidth="70%"
        bgcolor={isSender ? "#1976d2" : "#f1f0f0"}
        color={isSender ? "#fff" : "#222"}
        borderRadius={3}
        px={2}
        py={1.5}
        boxShadow={1}
        display="flex"
        flexDirection="column"
        sx={{
          borderTopRightRadius: isSender ? 0 : 12,
          borderTopLeftRadius: isSender ? 12 : 0,
        }}
      >
        {/* Three-dot menu */}
        <Box position="absolute" top={4} right={8} zIndex={2}>
          <IconButton size="small" onClick={handleMenuOpen}>
            <MoreVertIcon fontSize="small" sx={{ color: isSender ? "#fff" : "#888" }} />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem onClick={handleMenuClose}>Opt 1</MenuItem>
            <MenuItem onClick={handleMenuClose}>Opt 2</MenuItem>
          </Menu>
        </Box>
        {/* Message content */}
        <Box minHeight={32} display="flex" alignItems="center" justifyContent="center">
          {isImage ? (
            <img
              src={message.fileUrl}
              alt="attachment"
              style={{ maxWidth: 200, maxHeight: 200, borderRadius: 8 }}
            />
          ) : (
            <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
              {message.text}
            </Typography>
          )}
        </Box>
        {/* Dummy double/single tick */}
        <Box display="flex" justifyContent="flex-end" alignItems="center" mt={0.5}>
          <Typography variant="caption" color={isSender ? "#b3e5fc" : "#888"}>
            {/* Dummy: double tick for read, single for sent */}
            {message.readBy && message.readBy.length > 1 ? "✔✔" : "✔"}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatBubble;
