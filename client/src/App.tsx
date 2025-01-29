import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "./components/theme-provider/ThemeProvider";
import { RidesSection } from "./components/rides/RidesSection";

export const App = () => {
  return (
    <ThemeProvider>
      <CssBaseline />
      <RidesSection />
    </ThemeProvider>
  );
};
