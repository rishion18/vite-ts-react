import React from "react";
import { Avatar, Badge, Box, Typography } from "@mui/material";

interface ChatItemProps {
  avatarUrl?: string;
  message: string;
  unreadCount?: number;
}

const ChatItem: React.FC<ChatItemProps> = ({ avatarUrl, message, unreadCount = 0 }) => {
  return (
    <Box display="flex" alignItems="center" p={1} gap={2} sx={{ cursor: 'pointer' }}>
      <Badge
        color="primary"
        badgeContent={unreadCount > 0 ? unreadCount : null}
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Avatar src={avatarUrl} />
      </Badge>
      <Typography variant="body2" noWrap sx={{ maxWidth: 120 }}>
        {message}
      </Typography>
    </Box>
  );
};

export default ChatItem;
