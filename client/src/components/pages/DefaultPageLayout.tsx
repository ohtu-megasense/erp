import {
  Box,
  Container,
  AppBar,
  Divider,
  useTheme,
  useMediaQuery,
  Toolbar
} from '@mui/material';
import { Outlet } from 'react-router';
import { OpenDrawerButton } from '../drawer/OpenDrawerButton';
import { Drawer } from '../drawer/Drawer';

const TopBar = () => {
  const theme = useTheme();
  const isAtleastLarge = useMediaQuery(theme.breakpoints.up('lg'));

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          width: isAtleastLarge
            ? 'calc(100% - var(--mui-palette-vars-mui-drawer-width))'
            : undefined,
          bgcolor: 'background.default'
        }}
      >
        <Toolbar sx={{ gap: 2, color: 'text.primary' }}>
          {!isAtleastLarge && <OpenDrawerButton />}
        </Toolbar>
        <Divider />
      </AppBar>
      <Toolbar />
    </>
  );
};

export const DefaultPageLayout = () => {
  return (
    <>
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
