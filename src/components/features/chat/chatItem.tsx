import React from "react";
import { Avatar, Badge, Box, Typography, useTheme } from "@mui/material";

interface ChatItemProps {
  avatarUrl?: string;
  message: string;
  unreadCount?: number;
}

const ChatItem: React.FC<ChatItemProps> = ({ avatarUrl, message, unreadCount = 0 }) => {

  const theme = useTheme();

  return (
    <Box 
      display="flex" 
      alignItems="center" 
      gap={2.5} 
    >
      <Box position="relative" zIndex={1}>
        <Badge
          color="primary"
          badgeContent={unreadCount > 0 ? unreadCount : null}
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}

        >
          <Avatar 
            src={avatarUrl}
            sx={{
              
            }}
          />
        </Badge>
      </Box>
      
      <Box flex={1} position="relative" zIndex={1} minWidth={0}>
        <Typography
         sx={{
          color: theme.palette.text.primary,
          fontWeight: theme.palette.custom.headingWeight,
         }}
        >
          Name
        </Typography>
        <Typography 
          variant="body2" 
          noWrap 
          sx={{ 
            maxWidth: 120,
            fontSize: '14px',
            fontWeight: 500,
            color: theme.palette.text.secondary,
            letterSpacing: '0.01em',
            lineHeight: 1.4,
            transition: 'color 0.2s ease',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.02)',
          }}
        >
          {message}
        </Typography>
      </Box>
    </Box>
  );
};

export default ChatItem;