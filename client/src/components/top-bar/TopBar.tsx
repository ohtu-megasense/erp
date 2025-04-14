import {
  AppBar,
  Divider,
  Toolbar,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { OpenDrawerButton } from '../drawer/OpenDrawerButton';

export const TopBar = () => {
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
