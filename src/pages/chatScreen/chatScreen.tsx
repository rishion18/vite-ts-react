import { Box } from "@mui/material";
import { COMPONENTS } from "../../components";
import React from "react";

const ChatScreen: React.FC = () => {


  return (
    <Box display="flex" flexDirection="row" height="100dvh">
      {/* Left: Chat List */}
      <COMPONENTS.FEATURES.CHAT.CHAT_LIST/>
      {/* Right: Chat Detail */}
      <COMPONENTS.FEATURES.CHAT.CHAT_BOX/>
    </Box>
  );
};

export default ChatScreen;
