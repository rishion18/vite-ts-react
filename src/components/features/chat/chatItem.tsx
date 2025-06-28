import React from "react";
import { Avatar, Badge, Box, Typography } from "@mui/material";

interface ChatItemProps {
  avatarUrl?: string;
  message: string;
  unreadCount?: number;
}

const ChatItem: React.FC<ChatItemProps> = ({ avatarUrl, message, unreadCount = 0 }) => {
  return (
    <Box 
      display="flex" 
      alignItems="center" 
      p={2.5} 
      gap={2.5} 
      sx={{ 
        cursor: 'pointer',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)',
        border: '1px solid rgba(0, 0, 0, 0.04)',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        mb: 1,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)',
          opacity: 0,
          transition: 'opacity 0.3s ease',
        },
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 32px rgba(102, 126, 234, 0.15)',
          border: '1px solid rgba(102, 126, 234, 0.1)',
          '&::before': {
            opacity: 1,
          }
        },
        '&:active': {
          transform: 'translateY(0px)',
          boxShadow: '0 4px 16px rgba(102, 126, 234, 0.1)',
        }
      }}
    >
      <Box position="relative" zIndex={1}>
        <Badge
          color="primary"
          badgeContent={unreadCount > 0 ? unreadCount : null}
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          sx={{
            '& .MuiBadge-badge': {
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '11px',
              minWidth: '20px',
              height: '20px',
              borderRadius: '10px',
              border: '2px solid #ffffff',
              boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
              animation: unreadCount > 0 ? 'pulse 2s infinite' : 'none',
            },
            '@keyframes pulse': {
              '0%': {
                transform: 'scale(1)',
                boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
              },
              '50%': {
                transform: 'scale(1.05)',
                boxShadow: '0 4px 16px rgba(102, 126, 234, 0.4)',
              },
              '100%': {
                transform: 'scale(1)',
                boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
              },
            },
          }}
        >
          <Avatar 
            src={avatarUrl}
            sx={{
              width: 48,
              height: 48,
              border: '3px solid rgba(255, 255, 255, 0.9)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
              background: avatarUrl ? 'transparent' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '18px',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0 6px 24px rgba(0, 0, 0, 0.15)',
              }
            }}
          />
        </Badge>
      </Box>
      
      <Box flex={1} position="relative" zIndex={1} minWidth={0}>
        <Typography 
          variant="body2" 
          noWrap 
          sx={{ 
            maxWidth: 120,
            fontSize: '14px',
            fontWeight: 500,
            color: '#2c3e50',
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