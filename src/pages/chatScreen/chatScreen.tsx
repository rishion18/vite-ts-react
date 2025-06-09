import { COMPONENTS } from "../../components";

const ChatScreen: React.FC = () => {

  return (
    <>
    <div className="flex flex-row h-dvh">
      <COMPONENTS.FEATURES.CHAT.CHAT_LIST />
      <COMPONENTS.FEATURES.CHAT.CHAT_BOX />
    </div>
    </>
  );
};

export default ChatScreen;
