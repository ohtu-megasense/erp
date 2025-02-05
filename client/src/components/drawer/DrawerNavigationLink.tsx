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
    <ListItemButton>
      <Link
        href={href}
        sx={{
          width: "100%",
        }}
      >
        <ListItemText primary={text} />
      </Link>
    </ListItemButton>
  );
};
