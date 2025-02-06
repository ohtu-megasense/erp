import { Link, ListItemButton, ListItemText } from '@mui/material';
import { useAppDispatch } from '../../app/hooks';
import { closedDrawer } from '../../features/drawerSlice';

interface DrawerNavigationLinkProps {
  href: string;
  text: string;
}

export const DrawerNavigationLink = ({
  href,
  text
}: DrawerNavigationLinkProps) => {
  const dispatch = useAppDispatch();

  const onClick = () => {
    dispatch(closedDrawer());
  };

  return (
    <ListItemButton onClick={onClick} LinkComponent={Link} href={href}>
      <ListItemText primary={text} />
    </ListItemButton>
  );
};
