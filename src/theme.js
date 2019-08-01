import { createMuiTheme } from "@material-ui/core/styles";

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    primary: { main: "#2196f3" },
    secondary: { main: "#f50057" },
    error: { main: "rgb(255, 105, 102)" },
    success: { main: "rgb(0, 153, 36)" }
  }
});

export default theme;
