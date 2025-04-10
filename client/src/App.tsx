import { CssBaseline } from '@mui/material';
import { ThemeProvider } from './components/theme-provider/ThemeProvider';
import { Route, Routes } from 'react-router';
import { DefaultPageLayout } from './components/pages/layout/DefaultPageLayout';
import { Redirect } from './components/redirect/Redirect';
import { NotificationSnackbar } from './components/notification/NotificationSnackbar';
import { TheBarChartPage } from './components/pages/charts/TheBarChartPage';
import { ChartBuilderPageLayout } from './components/pages/charts/ChartBuilderPageLayout';

export const App = () => {
  return (
    <ThemeProvider>
      <CssBaseline />
      <NotificationSnackbar />
      <Routes>
        <Route element={<ChartBuilderPageLayout />}>
          <Route path="/" element={<TheBarChartPage />} />
        </Route>
        <Route element={<DefaultPageLayout />}>
          {/* <Route path="/" element={<DashboardPage />} />
          <Route
            path="/categories/visualize"
            element={<VisualizeCategoriesPage />}
          />
          <Route path="/categories/inventory" element={<ManageCategoriesPage />} />
          <Route path="/categories/CRM" element={<CRMpage />} /> */}
        </Route>
        <Route path="*" element={<Redirect to="/" />} />
      </Routes>
    </ThemeProvider>
  );
};
