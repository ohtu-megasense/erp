import {
  Box,
  List,
  Drawer as MuiDrawer,
  Toolbar,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { NavigationCategory } from './NavigationCategory';
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
          px: 2,
          borderRight: 1,
          borderTop: 1,
          borderColor: 'divider'
        }}
      >
        <List>
          <DrawerNavigationLink href="/" text="Home" />
          <DrawerNavigationLink href="/search" text="Search" />
          <NavigationAccordion title="Categories" isPlaceholder={false}>
            <DrawerNavigationLink
              href="/categories/visualize"
              text="Visualize"
            />
            <DrawerNavigationLink href="/categories/manage" text="Manage" />
          </NavigationAccordion>
          <NavigationAccordion title="Recent" isPlaceholder={true} />
          <NavigationAccordion title="Pinned" isPlaceholder={true} />
        </List>
        <NavigationCategory title="My Work" isPlaceholder={true} />
        <NavigationCategory title="Insights" isPlaceholder={true} />
        <NavigationCategory title="Providers" isPlaceholder={true} />
        <NavigationCategory title="Orders" isPlaceholder={true} />
        <NavigationCategory title="Orchestration" isPlaceholder={true} />
      </Box>
    </MuiDrawer>
  );
};
