import { Box } from "@mui/material";
import ChatListSearchBar from "./chatListSearchBar";
import ChatListFilterChips from "./chatListTabs";

const ChatListFilters:React.FC = () => {
    return (
<Box
>
<ChatListSearchBar/>
<ChatListFilterChips/>
</Box>
    )
}

export default ChatListFilters;