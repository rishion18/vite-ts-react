import React, { useState } from 'react';
import { Box, IconButton, Avatar, Drawer, useTheme, useMediaQuery } from '@mui/material';
import { Menu as MenuIcon, Close as CloseIcon, Logout as LogoutIcon } from '@mui/icons-material';

interface ResponsiveChatLayoutProps {
  chatList: React.ReactNode;
  children: React.ReactNode; // This will be the ChatBox
  userProfilePhoto?: string;
  onLogout?: () => void;
  onChatItemSelect?: () => void; // Callback to close drawer when chat item is selected
}

const ResponsiveChatLayout: React.FC<ResponsiveChatLayoutProps> = ({
  chatList,
  children,
  userProfilePhoto,
  onLogout,
  onChatItemSelect
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleChatItemSelect = () => {
    setDrawerOpen(false);
    onChatItemSelect?.();
  };

  // Mobile Header Component
  const MobileHeader = () => (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      p={2}
      bgcolor="white"
      borderBottom="1px solid #eee"
      sx={{ minHeight: '64px' }}
    >
      <IconButton onClick={handleDrawerToggle} sx={{ p: 0 }}>
        <MenuIcon />
      </IconButton>
      
      <Avatar
        src={userProfilePhoto}
        sx={{ width: 40, height: 40 }}
      />
      
      <IconButton onClick={onLogout} sx={{ p: 0 }}>
        <LogoutIcon />
      </IconButton>
    </Box>
  );

  // Enhanced ChatList wrapper that handles mobile selection
  const ChatListWrapper = ({ inDrawer = false }) => (
    <Box
      sx={{
        height: inDrawer ? '100%' : 'auto',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}
      onClick={inDrawer ? handleChatItemSelect : undefined}
    >
      {inDrawer && (
        <IconButton
          onClick={handleDrawerClose}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 1000,
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 1)',
            },
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
          }}
        >
          <CloseIcon />
        </IconButton>
      )}
      {chatList}
    </Box>
  );

  if (isMobile) {
    return (
      <Box display="flex" flexDirection="column" height="100dvh">
        <MobileHeader />
        
        {/* Mobile Drawer for Chat List */}
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={handleDrawerClose}
          sx={{
            '& .MuiDrawer-paper': {
              width: '100%',
              height: '100%',
            },
          }}
        >
          <ChatListWrapper inDrawer />
        </Drawer>
        
        {/* Chat Box taking remaining space */}
        <Box flex={1} overflow="hidden">
          {children}
        </Box>
      </Box>
    );
  }

  // Desktop Layout
  return (
    <Box display="flex" flexDirection="row" height="100dvh">
      {/* Desktop Chat List */}
      <ChatListWrapper />
      
      {/* Chat Box */}
      <Box flex={1}>
        {children}
      </Box>
    </Box>
  );
};

export default ResponsiveChatLayout;