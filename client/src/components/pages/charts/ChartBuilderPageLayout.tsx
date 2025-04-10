import { Box } from '@mui/material';
import { Outlet } from 'react-router';
import { Drawer } from './Drawer';

export const ChartBuilderPageLayout = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
      <Drawer />
    </Box>
  );
};
