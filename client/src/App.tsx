import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "./components/theme-provider/ThemeProvider";
import { DashboardPage } from "./components/pages/dashboard/DashboardPage";
import { DetailViewPage } from "./components/pages/detail-view/DetailViewPage";
import { Route, Routes } from "react-router";
import { DefaultPageLayout } from "./components/pages/layout/DefaultPageLayout";
import { Redirect } from "./components/redirect/Redirect";
import { useGetInventoryQuery } from "./features/apiSlice";

export const App = () => {
  const {data, isLoading} = useGetInventoryQuery()

  if (isLoading) {
    return <div>Loading...</div>
  }

  console.log(data);
  

  return (
    <ThemeProvider>
      <CssBaseline />
      <Routes>
        <Route element={<DefaultPageLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/search" element={<DetailViewPage />} />
        </Route>
        <Route path="*" element={<Redirect to="/" />} />
      </Routes>
    </ThemeProvider>
  );
};
