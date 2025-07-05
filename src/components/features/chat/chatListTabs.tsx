import React from "react";
import { Box, Chip, useTheme } from "@mui/material";

const filters = ["All", "Unread", "Favourites", "Groups"];

const ChatListFilterChips: React.FC = () => {
  const theme = useTheme();

  return (
    <Box px={2} width="100%" display="flex" gap={1} flexWrap="wrap">
      {filters.map((label) => (
        <Chip
          key={label}
          label={label}
          variant="outlined"
          sx={{
            borderRadius: "20px", // WhatsApp-style pill shape
            borderColor: theme.palette.divider,
            color: theme.palette.text.secondary,
            backgroundColor: theme.palette.background.default,
            "&:hover": {
              backgroundColor: theme.palette.background.paper,
              cursor: "pointer",
            },
            fontSize: "0.8rem",
            paddingX: "6px",
          }}
        />
      ))}
    </Box>
  );
};

export default ChatListFilterChips;
