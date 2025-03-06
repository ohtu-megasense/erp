import {
  Box,
  List,
  Drawer as MuiDrawer,
  Toolbar,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { NavigationAccordion } from './NavigationAccordion';
import { CompanyLinkFull } from '../company/CompanyLinkFull';
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
        <CompanyLinkFull />
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
          <NavigationAccordion title="Categories" isPlaceholder={false}>
            <DrawerNavigationLink href="/categories/manage" text="Manage" />
          </NavigationAccordion>
        </List>
      </Box>
    </MuiDrawer>
  );
};
