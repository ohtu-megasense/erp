import { Link, ListItem, ListItemText } from "@mui/material";
import { TextItemProps } from "./TextItem";

interface LinkItemProps extends TextItemProps {
  href: string;
}

export const LinkItem = ({ primary, secondary, href }: LinkItemProps) => {
  return (
    <ListItem>
      <Link
        href={href}
        target="_blank"
        rel="noreferrer"
        sx={{
          width: "100%",
          cursor: "pointer",
          textDecoration: "underline",
          color: "primary.light",
          textUnderlineOffset: 4,
        }}
      >
        <ListItemText
          primary={primary}
          secondary={secondary}
          slotProps={{
            secondary: {
              sx: {
                color: "primary.light",
              },
            },
          }}
        />
      </Link>
    </ListItem>
  );
};
