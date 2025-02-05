import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "./components/theme-provider/ThemeProvider";
import { DashboardPage } from "./components/pages/dashboard/DashboardPage";

export const App = () => {
  return (
    <ThemeProvider>
      <CssBaseline />
      <DashboardPage />
    </ThemeProvider>
  );
};
