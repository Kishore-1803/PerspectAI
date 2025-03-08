import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#003366", // Navy Blue
    },
    secondary: {
      main: "#D4A373", // Warm Tan
    },
    error: {
      main: "#D32F2F", // Bright Red
    },
    background: {
      default: "#F4F4F4", // Light Gray Background
    },
  },
  typography: {
    fontFamily: "Arial, sans-serif",
  },
});

export default theme;
