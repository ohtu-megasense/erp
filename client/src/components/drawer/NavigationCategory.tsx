import { List, ListItem, ListItemText } from "@mui/material";
import { getRandomInt } from "../../utils/utils";
import { DrawerNavigationLink } from "./DrawerNavigationLink";

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
        <DrawerNavigationLink
          key={index}
          href={""}
          text={`Item ${index + 1}`}
        />
      ))}
    </List>
  );
};
