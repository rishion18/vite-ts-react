import React from "react";
import { Avatar, Badge, Box, Typography, useTheme } from "@mui/material";
import { useAppSelector } from "../../../redux/hook";
import { formatChatTimestamp } from "./helper";


interface ChatItemProps {
  message: string;
  unreadCount?: number;
  chatItem: ChatRoom;
}

const ChatItem: React.FC<ChatItemProps> = ({
  message,
  unreadCount = 0,
  chatItem,
}) => {
  
  console.log("chatitem", chatItem);
  const { user } = useAppSelector((state) => state.auth);
const otherUser = chatItem?.users?.find((item: any) => item._id !== user?.id);
const avatar = otherUser?.avatar;
const userName = otherUser?.userName;

  console.log("avatar", avatar);

  const theme = useTheme();

  return (
    <Box display="flex" alignItems="center" gap={2.5}>
      <Box position="relative" zIndex={1}>
        <Badge
          color="primary"
          badgeContent={unreadCount > 0 ? unreadCount : null}
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Avatar src={avatar} sx={{}} />
        </Badge>
      </Box>

      <Box flex={1} position="relative" zIndex={1} minWidth={0}>
        <Typography
          sx={{
            color: theme.palette.text.primary,
            fontWeight: theme.palette.custom.headingWeight,
          }}
        >
          {userName || "Anonymous"}
        </Typography>
        <Typography
          variant="body2"
          noWrap
          sx={{
            maxWidth: 200,
            fontSize: "14px",
            fontWeight: 500,
            color: theme.palette.text.secondary,
            letterSpacing: "0.01em",
            lineHeight: 1.4,
            transition: "color 0.2s ease",
            textShadow: "0 1px 2px rgba(0, 0, 0, 0.02)",
          }}
        >
          {message}
        </Typography>
      </Box>
      <Box
        sx={{
          width: "20%",
          height: "100%",
        }}
      >
        <Typography
          fontSize={12}
          color={theme.palette.text.secondary}
          sx={{
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
          }}
        >
          {formatChatTimestamp(String(chatItem.latestMessage?.createdAt))}
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Box
            sx={{
              width: 18,
              height: 18,
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: 1,
              bgcolor: theme.palette.custom.appViolet,
            }}
          >
            <Typography
             fontSize={12}
             color={'white'}
            >
              3
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatItem;
