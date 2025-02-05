import { ListItem, ListItemText } from "@mui/material";

export interface TextItemProps {
  primary: string;
  secondary: string | number;
}

export const TextItem = ({ primary, secondary }: TextItemProps) => {
  return (
    <ListItem>
      <ListItemText primary={primary} secondary={secondary} />
    </ListItem>
  );
};
