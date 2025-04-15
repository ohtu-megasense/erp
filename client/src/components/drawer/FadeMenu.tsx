import * as React from 'react';
import {
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Fade,
  Link
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

type FadeMenuItem = {
  label: string;
  href?: string;
  onClick?: () => void;
};

type FadeMenuProps = {
  title: string;
  items: FadeMenuItem[];
};

export const FadeMenu: React.FC<FadeMenuProps> = ({ title, items }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const theme = useTheme();
  const drawerWidth = theme.palette.vars?.['mui-drawer-width'] ?? 300;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <ListItemButton onClick={handleClick} sx={{ width: '100%' }}>
        <ListItemText primary={title} />
      </ListItemButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        PaperProps={{
          sx: {
            width: `${drawerWidth - 20}px`
          }
        }}
      >
        {items.map((item, index) => (
          <MenuItem
            key={index}
            component={Link}
            href={item.href}
            onClick={() => {
              handleClose();
              item.onClick?.();
            }}
            sx={{ width: '100%', paddingLeft: 2 }}
          >
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
