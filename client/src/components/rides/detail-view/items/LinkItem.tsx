import { Link, ListItem, ListItemText, Stack } from "@mui/material";
import { TextItemProps } from "./TextItem";
import { ReactNode } from "react";

interface LinkItemProps extends TextItemProps {
  href: string;
  icon?: ReactNode;
}

export const LinkItem = ({ primary, secondary, href, icon }: LinkItemProps) => {
  return (
    <ListItem>
      <Link
        href={href}
        target="_blank"
        rel="noreferrer"
        sx={{
          cursor: "pointer",
          textDecoration: "underline",
          color: "primary.light",
          textUnderlineOffset: 4,
        }}
      >
        <Stack
          sx={{
            flexDirection: "row",
            gap: 2,
            alignItems: "center",
          }}
        >
          {icon}
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
        </Stack>
      </Link>
    </ListItem>
  );
};
