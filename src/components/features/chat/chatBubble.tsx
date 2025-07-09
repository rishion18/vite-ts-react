import React, { useState } from "react";
import { Box, Typography, IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useAppSelector } from "../../../redux/hook";

// Props: message object and currentUserId
const ChatBubble: React.FC<{
  message: any;
  currentUserId: string;
}> = ({ message, currentUserId }) => {
  const { user } = useAppSelector((state) => state.auth);
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
      (message.fileUrl.endsWith(".png") ||
        message.fileUrl.endsWith(".jpg") ||
        message.fileUrl.endsWith(".jpeg")));

  // Format timestamp
  const formatTimestamp = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
    const time = date.toLocaleTimeString(undefined, timeOptions);
    if (isToday) {
      return `${time}, today`;
    }
    const dateOptions: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    };
    const day = date.toLocaleDateString(undefined, dateOptions);
    return `${time}, ${day}`;
  };

  return (
    <Box
      display="flex"
      justifyContent={isSender ? "flex-end" : "flex-start"}
      mb={2}
      px={1}
    >
      <Box
        position="relative"
        maxWidth="70%"
        sx={{
          background: isSender 
            ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            : "linear-gradient(135deg, #f8f9ff 0%, #e8f4fd 100%)",
          color: isSender ? "#ffffff" : "#2c3e50",
          borderRadius: "20px",
          px: 3,
          py: 2,
          boxShadow: isSender 
            ? "0 8px 32px rgba(102, 126, 234, 0.25)" 
            : "0 4px 20px rgba(0, 0, 0, 0.08)",
          border: isSender ? "none" : "1px solid rgba(0, 0, 0, 0.06)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          display: "flex",
          flexDirection: "column",
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            boxShadow: isSender 
              ? "0 12px 40px rgba(102, 126, 234, 0.35)" 
              : "0 8px 30px rgba(0, 0, 0, 0.12)",
          },
          ...(isSender 
            ? {
                borderBottomRightRadius: "8px",
              }
            : {
                borderBottomLeftRadius: "8px",
              }
          )
        }}
      >
        {/* Three-dot menu */}
        <Box 
          position="absolute" 
          top={8} 
          right={8} 
          zIndex={2}
          sx={{
            opacity: 0.7,
            transition: "opacity 0.2s ease",
            "&:hover": {
              opacity: 1,
            }
          }}
        >
          <IconButton 
            size="small" 
            onClick={handleMenuOpen}
            sx={{
              padding: "4px",
              borderRadius: "50%",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.2)",
              }
            }}
          >
            <MoreVertIcon 
              fontSize="small" 
              sx={{ 
                color: isSender ? "rgba(255, 255, 255, 0.8)" : "rgba(44, 62, 80, 0.6)",
                fontSize: "16px"
              }} 
            />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            PaperProps={{
              sx: {
                borderRadius: "12px",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
                border: "1px solid rgba(0, 0, 0, 0.06)",
                backdropFilter: "blur(20px)",
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                mt: 1,
              }
            }}
          >
            <MenuItem 
              onClick={handleMenuClose}
              sx={{
                borderRadius: "8px",
                mx: 1,
                my: 0.5,
                "&:hover": {
                  backgroundColor: "rgba(102, 126, 234, 0.08)",
                }
              }}
            >
              Option 1
            </MenuItem>
            <MenuItem 
              onClick={handleMenuClose}
              sx={{
                borderRadius: "8px",
                mx: 1,
                my: 0.5,
                "&:hover": {
                  backgroundColor: "rgba(102, 126, 234, 0.08)",
                }
              }}
            >
              Option 2
            </MenuItem>
          </Menu>
        </Box>

        {/* Message content */}
        <Box 
          mb={1} 
          minHeight={32} 
          display="flex" 
          alignItems="center" 
          justifyContent="center"
          sx={{ pr: 4 }} // Add padding to avoid overlap with menu button
        >
          {isImage ? (
            <Box
              component="img"
              src={message.fileUrl}
              alt="attachment"
              sx={{
                maxWidth: 200,
                maxHeight: 200,
                borderRadius: "12px",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.2s ease",
                "&:hover": {
                  transform: "scale(1.02)",
                }
              }}
            />
          ) : (
            <Typography 
              variant="body1" 
              sx={{ 
                wordBreak: "break-word",
                fontSize: "15px",
                lineHeight: 1.5,
                fontWeight: 400,
                letterSpacing: "0.01em"
              }}
            >
              {message.text}
            </Typography>
          )}
        </Box>

        {/* Timestamp and status row */}
        <Box 
          display="flex" 
          justifyContent="flex-end" 
          alignItems="center"
          gap={1}
          sx={{ pr: 4 }} // Add padding to avoid overlap with menu button
        >
          <Typography 
            variant="caption" 
            sx={{
              color: isSender ? "rgba(255, 255, 255, 0.7)" : "rgba(44, 62, 80, 0.6)",
              fontSize: "11px",
              fontWeight: 500,
              letterSpacing: "0.02em"
            }}
          >
            {formatTimestamp(message.createdAt)}
          </Typography>

          {/* Only show ticks for sent messages */}
          {isSender && (
            <Typography 
              variant="caption" 
              sx={{
                color: "rgba(255, 255, 255, 0.8)",
                fontSize: "12px",
                fontWeight: 600,
                textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)"
              }}
            >
              {message.deliveryStatus === 'delivered' ? "✓✓" : message.deliveryStatus === 'savedInDb' ? "✓" : "✗"}
            </Typography>
          )}
          {/* <p style={{color: 'red'}}>{JSON.stringify(message)}</p> */}
        </Box>
      </Box>
    </Box>
  );
};

export default ChatBubble;