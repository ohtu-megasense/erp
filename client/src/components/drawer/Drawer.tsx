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
import { FadeMenu } from './FadeMenu';
import { NavigationAccordion } from './NavigationAccordion';

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
            color: 'text.primary',
            ml: 1
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
          <NavigationAccordion
            title="Modules"
            isPlaceholder={false}
            defaultExpanded
          >
            <FadeMenu
              title="Inventory"
              items={[{ label: 'Manage', href: '/categories/inventory' }]}
            ></FadeMenu>
            <FadeMenu
              title="CRM"
              items={[{ label: 'Manage', href: '/categories/CRM' }]}
            ></FadeMenu>
          </NavigationAccordion>
        </List>
      </Box>
    </MuiDrawer>
  );
};
