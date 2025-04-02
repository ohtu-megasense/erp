import { CssBaseline } from '@mui/material';
import { ThemeProvider } from './components/theme-provider/ThemeProvider';
import { DashboardPage } from './components/pages/dashboard/DashboardPage';
import { Route, Routes } from 'react-router';
import { DefaultPageLayout } from './components/pages/layout/DefaultPageLayout';
import { Redirect } from './components/redirect/Redirect';
import { VisualizeCategoriesPage } from './components/pages/categories/visualize/VisualizeCategoriesPage';
import { ManageCategoriesPage } from './components/pages/categories/manage/ManageCategoriesPage';
import { CRMpage } from './components/pages/categories/CRM/CRMpage';
import { NotificationSnackbar } from './components/notification/NotificationSnackbar';

export const App = () => {
  return (
    <ThemeProvider>
      <CssBaseline />
      <NotificationSnackbar />
      <Routes>
        <Route element={<DefaultPageLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route
            path="/categories/visualize"
            element={<VisualizeCategoriesPage />}
          />
          <Route path="/categories/inventory" element={<ManageCategoriesPage />} />
          <Route path="/categories/CRM" element={<CRMpage />} />
        </Route>
        <Route path="*" element={<Redirect to="/" />} />
      </Routes>
    </ThemeProvider>
  );
};
