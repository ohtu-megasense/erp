import { Link, ListItemButton, ListItemText } from "@mui/material";
import { useAppDispatch } from "../../app/hooks";
import { closedDrawer } from "../../features/drawerSlice";

interface DrawerNavigationLinkProps {
  href: string;
  text: string;
}

export const DrawerNavigationLink = ({
  href,
  text,
}: DrawerNavigationLinkProps) => {
  const dispatch = useAppDispatch();

  const onClick = () => {
    dispatch(closedDrawer());
  };

  return (
    <Link href={href}>
      <ListItemButton onClick={onClick}>
        <ListItemText primary={text} />
      </ListItemButton>
    </Link>
  );
};
