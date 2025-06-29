import React from "react";
import { COMPONENTS } from "../../components";
import ResponsiveChatLayout from "../../components/layout/ResponsiveChatLayout";

const ChatScreen: React.FC = () => {
  const handleLogout = () => {
    // Implement your logout logic here
    console.log("Logout clicked");
  };

  const handleChatItemSelect = () => {
    // Optional: Additional logic when chat item is selected on mobile
    console.log("Chat item selected on mobile");
  };

  return (
    <ResponsiveChatLayout
      chatList={<COMPONENTS.FEATURES.CHAT.CHAT_LIST />}
      userProfilePhoto="/path-to-user-photo.jpg" // Replace with actual photo URL
      onLogout={handleLogout}
      onChatItemSelect={handleChatItemSelect}
    >
      <COMPONENTS.FEATURES.CHAT.CHAT_BOX />
    </ResponsiveChatLayout>
  );
};

export default ChatScreen;