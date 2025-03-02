import { CssBaseline } from '@mui/material';
import { ThemeProvider } from './components/theme-provider/ThemeProvider';
import { DashboardPage } from './components/pages/dashboard/DashboardPage';
import { DetailViewPage } from './components/pages/detail-view/DetailViewPage';
import { Route, Routes } from 'react-router';
import { DefaultPageLayout } from './components/pages/layout/DefaultPageLayout';
import { Redirect } from './components/redirect/Redirect';
import { VisualizeCategoriesPage } from './components/pages/categories/VisualizeCategoriesPage';
import { ManageCategoriesPage } from './components/pages/categories/ManageCategoriesPage';

export const App = () => {
  return (
    <ThemeProvider>
      <CssBaseline />
      <Routes>
        <Route element={<DefaultPageLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route
            path="/categories/visualize"
            element={<VisualizeCategoriesPage />}
          />
          <Route path="/categories/manage" element={<ManageCategoriesPage />} />
          <Route path="/search" element={<DetailViewPage />} />
        </Route>
        <Route path="*" element={<Redirect to="/" />} />
      </Routes>
    </ThemeProvider>
  );
};
