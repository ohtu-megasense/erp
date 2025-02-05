import { Link, ListItemButton, ListItemText } from "@mui/material";

interface DrawerNavigationLinkProps {
  href: string;
  text: string;
}

export const DrawerNavigationLink = ({
  href,
  text,
}: DrawerNavigationLinkProps) => {
  return (
    <Link href={href}>
      <ListItemButton>
        <ListItemText primary={text} />
      </ListItemButton>
    </Link>
  );
};
