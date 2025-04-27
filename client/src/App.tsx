import { CssBaseline } from '@mui/material';
import { ThemeProvider } from './components/theme-provider/ThemeProvider';
import { Route, Routes } from 'react-router';
import { Redirect } from './components/redirect/Redirect';
import { DataPage } from './components/pages/DataPage';
import { NotificationSnackbar } from './components/notification/NotificationSnackbar';
import { DashboardPage } from './components/pages/dashboard/DashboardPage';
import { ViewPage } from './components/view/ViewPage';
import { AiErpPage } from './components/ai-erp/AiErpPage';
import { BuildViewPage } from './components/view/BuildViewPage';
import { DefaultPageLayout } from './components/pages/DefaultPageLayout';

// NOTE: Consider using url params for module etc.
// instead of passing them as props for pages.

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
          <Route path="/ai-chat" element={<AiErpPage />} />

          {/** Inventory pages */}
          <Route
            path="/inventory/data"
            element={<DataPage module="inventory" />}
          />
          <Route
            path="/inventory/views"
            element={<ViewPage module="inventory" />}
          />
          <Route
            path="/inventory/views/build"
            element={<BuildViewPage module="inventory" />}
          />

          {/** CRM pages */}
          <Route path="/crm/data" element={<DataPage module="crm" />} />
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
