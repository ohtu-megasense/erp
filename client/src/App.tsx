import { CssBaseline, Typography } from "@mui/material";
import { ThemeProvider } from "./components/theme-provider/ThemeProvider";
import { useGetPingQuery } from "./features/apiSlice";

export const App = () => {
  const { data } = useGetPingQuery();

  return (
    <ThemeProvider>
      <CssBaseline />
      {data && <Typography variant="h3">{data.message}</Typography>}
    </ThemeProvider>
  );
};
