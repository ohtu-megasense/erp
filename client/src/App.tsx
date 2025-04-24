import { CssBaseline } from '@mui/material';
import { ThemeProvider } from './components/theme-provider/ThemeProvider';
import { Route, Routes } from 'react-router';
import { DefaultPageLayout } from './components/pages/layout/DefaultPageLayout';
import { Redirect } from './components/redirect/Redirect';
import { ManageCategoriesPage } from './components/pages/categories/manage/ManageCategoriesPage';
import { CRMpage } from './components/pages/categories/CRM/CRMpage';
import { NotificationSnackbar } from './components/notification/NotificationSnackbar';
import { DashboardPage } from './components/pages/dashboard/DashboardPage';
import { ViewPage } from './components/view/ViewPage';
import { BuildViewPage } from './components/view/BuildViewPage';

export const App = () => {
  return (
    <ThemeProvider>
      <CssBaseline />
      <NotificationSnackbar />
      <Routes>
        <Route element={<DefaultPageLayout />}>
          {/** Home */}
          <Route path="/" element={<DashboardPage />} />

          {/** AI chat */}
          <Route path="/ai-chat" element={null} />

          {/** Inventory pages */}
          <Route path="/inventory/data" element={<ManageCategoriesPage />} />
          <Route
            path="/inventory/views"
            element={<ViewPage module="inventory" />}
          />
          <Route
            path="/inventory/views/build"
            element={<BuildViewPage module="inventory" />}
          />

          {/** CRM pages */}
          <Route path="/crm/data" element={<CRMpage />} />
          <Route path="/crm/views" element={<ViewPage module="crm" />} />
          <Route
            path="/crm/views/build"
            element={<BuildViewPage module="crm" />}
          />
        </Route>
        <Route path="*" element={<Redirect to="/" />} />
      </Routes>
    </ThemeProvider>
  );
};
