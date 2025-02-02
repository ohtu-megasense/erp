import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { getRandomInt } from "../../utils/utils";

interface NavigationCategoryProps {
  title: string;
}

export const NavigationCategory = (props: NavigationCategoryProps) => {
  return (
    <List>
      <ListItem>
        <ListItemText
          primary={props.title}
          slotProps={{
            primary: { sx: { fontWeight: 500 } },
          }}
        />
      </ListItem>
      {Array.from({ length: getRandomInt(2, 8) }).map((_, index) => (
        <ListItemButton key={index}>
          <ListItemText primary={`Item ${index + 1}`} />
        </ListItemButton>
      ))}
    </List>
  );
};
