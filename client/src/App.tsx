import { CssBaseline } from '@mui/material';
import { ThemeProvider } from './components/theme-provider/ThemeProvider';
import { DashboardPage } from './components/pages/dashboard/DashboardPage';
import { Route, Routes } from 'react-router';
import { DefaultPageLayout } from './components/pages/layout/DefaultPageLayout';
import { Redirect } from './components/redirect/Redirect';
import { VisualizeCategoriesPage } from './components/pages/categories/visualize/VisualizeCategoriesPage';
import { ManageCategoriesPage } from './components/pages/categories/manage/ManageCategoriesPage';
import { NotificationSnackbar } from './components/notification/NotificationSnackbar';
import { useGetPingQuery } from './features/apiSlice';

export const App = () => {
  // const { data, error } = useGetCategoriesQuery();
  const { data, error } = useGetPingQuery();

  console.log('App test ping query', data, 'error', error);

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
          <Route path="/categories/manage" element={<ManageCategoriesPage />} />
        </Route>
        <Route path="*" element={<Redirect to="/" />} />
      </Routes>
    </ThemeProvider>
  );
};
