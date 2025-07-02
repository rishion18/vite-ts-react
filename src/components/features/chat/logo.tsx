import { Box, Typography, useTheme } from "@mui/material";

const Logo: React.FC = () => {
  const theme = useTheme();
  return (
    <Box width={100} paddingX={2}>
      <Typography
        variant="h5"
        color="white"
        sx={{
          fontWeight: theme.palette.custom.headingWeight,
          letterSpacing: "0.01em",
          lineHeight: 1.4,
          textShadow: "0 1px 2px rgba(0, 0, 0, 0.02)",
        }}
      >
        JustChat
      </Typography>
    </Box>
  );
};

export default Logo;
