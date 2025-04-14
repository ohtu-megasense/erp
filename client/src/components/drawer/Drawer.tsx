import {
  Box,
  List,
  Drawer as MuiDrawer,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { closedDrawer } from '../../features/drawerSlice';
import { DrawerNavigationLink } from './DrawerNavigationLink';

export const Drawer = () => {
  const isOpen = useAppSelector((state) => state.drawer.isOpen);
  const theme = useTheme();
  const isAtleastLarge = useMediaQuery(theme.breakpoints.up('lg'));
  const dispatch = useAppDispatch();

  const onClose = () => {
    dispatch(closedDrawer());
  };

  return (
    <MuiDrawer
      sx={{
        width: theme.palette.vars['mui-drawer-width'],
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: theme.palette.vars['mui-drawer-width'],
          boxSizing: 'border-box',
          borderRight: 0
        }
      }}
      variant={isAtleastLarge ? 'permanent' : 'temporary'}
      anchor="left"
      open={isOpen}
      onClose={onClose}
    >
      <Toolbar sx={{ gap: 2, color: 'text.primary' }}>
        <Typography
          variant="body2"
          sx={{
            color: 'text.primary'
          }}
        >
          Megasense
        </Typography>
      </Toolbar>
      <Box
        sx={{
          overflow: 'auto',
          minHeight: 'calc(100dvh - 64px)',
          px: 2,
          borderRight: 1,
          borderTop: 1,
          borderColor: 'divider'
        }}
      >
        <List>
          <DrawerNavigationLink href="/" text="Home" />
          <DrawerNavigationLink href="/categories/inventory" text="Inventory" />
          <DrawerNavigationLink href="/categories/CRM" text="CRM" />
          <DrawerNavigationLink href="/view" text="Views" />
        </List>
      </Box>
    </MuiDrawer>
  );
};
