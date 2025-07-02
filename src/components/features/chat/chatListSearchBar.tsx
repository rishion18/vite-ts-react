import React from "react";
import { Box, InputBase, useTheme } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const ChatListSearchBar: React.FC = () => {
  const theme = useTheme();

  return (
    <Box px={2} py={2} width="100%">
      <Box
        display="flex"
        alignItems="center"
        bgcolor={theme.palette.mode === "light" ? "#f0f2f5" : "#2a2f32"}
        borderRadius="999px"
        px={2}
        py={0.5}
        boxShadow={1}
      >
        <SearchIcon sx={{ color: "gray", mr: 1 }} />
        <InputBase
          placeholder="Search or start new chat"
          fullWidth
          sx={{
            fontSize: "0.9rem",
          }}
        />
      </Box>
    </Box>
  );
};

export default ChatListSearchBar;
