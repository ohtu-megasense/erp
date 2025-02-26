import { Box, Container } from '@mui/material';
import { TopBar } from '../../top-bar/TopBar';
import { Drawer } from '../../drawer/Drawer';
import { Outlet } from 'react-router';
import { AddCategoryModal } from '../../categories/AddCategoryModal';

export const DefaultPageLayout = () => {
  return (
    <>
      <AddCategoryModal />
      <TopBar />
      <Box display="flex">
        <Drawer />
        <Container
          maxWidth="xl"
          sx={{
            mb: 2
          }}
        >
          <Box component="main">
            <Outlet />
          </Box>
        </Container>
      </Box>
    </>
  );
};
