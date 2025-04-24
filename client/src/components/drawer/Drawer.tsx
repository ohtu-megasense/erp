import {
  Box,
  Divider,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Drawer as MuiDrawer,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { closedDrawer } from '../../features/drawerSlice';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';

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
          py: 1,
          borderRight: 1,
          borderTop: 1,
          borderColor: 'divider'
        }}
      >
        <List>
          <ListItem>
            <ListItemText sx={{ pl: 2 }} secondary="GENERAL" />
          </ListItem>
          <LinkButton leftPad={false} text="Home" location="/" />
          <LinkButton leftPad={false} text="AI Insights" location="/ai-chat" />
          <Divider sx={{ my: 2, mx: 2 }} />
          <ListItem>
            <ListItemText sx={{ pl: 2 }} secondary="MODULES" />
          </ListItem>
          <ListItem>
            <ListItemText sx={{ pl: 2 }} primary="Inventory" />
          </ListItem>
          <LinkButton text="Overview" location="/inventory/views" />
          <LinkButton text="Manage Data" location="/inventory/data" />
          <LinkButton text="Manage Views" location="/inventory/views/build" />
          <ListItem sx={{ mt: 1 }}>
            <ListItemText sx={{ pl: 2 }} primary="CRM" />
          </ListItem>
          <LinkButton text="Overview" location="/crm/views" />
          <LinkButton text="Manage Data" location="/crm/data" />
          <LinkButton text="Manage Views" location="/crm/views/build" />
        </List>
      </Box>
    </MuiDrawer>
  );
};

const LinkButton = ({
  text,
  location,
  leftPad = true
}: {
  text: string;
  location: string;
  leftPad?: boolean;
}) => {
  const [isActive, setIsActive] = useState(false);
  const pathname = useLocation().pathname;
  const dispatch = useAppDispatch();

  const onClick = () => {
    dispatch(closedDrawer());
  };

  useEffect(() => {
    if (pathname.endsWith(location)) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [pathname, location]);

  return (
    <ListItemButton
      onClick={onClick}
      LinkComponent={Link}
      href={location}
      disableRipple
    >
      <Stack flexDirection="row" alignItems="center">
        <Box
          sx={{
            width: 3,
            height: 24,
            bgcolor: isActive ? 'primary.main' : undefined,
            position: 'absolute'
          }}
        />
        <ListItemText sx={{ pl: leftPad ? 4 : 2 }} primary={text} />
      </Stack>
    </ListItemButton>
  );
};
