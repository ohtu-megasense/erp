import { List, ListItem, ListItemText } from '@mui/material';
import { getRandomInt } from '../../utils/utils';
import { DrawerNavigationLink } from './DrawerNavigationLink';
import { ReactNode } from 'react';

interface NavigationCategoryProps {
  title: string;
  isPlaceholder: boolean;
  children?: ReactNode;
}

export const NavigationCategory = (props: NavigationCategoryProps) => {
  return (
    <List>
      <ListItem>
        <ListItemText
          primary={props.title}
          slotProps={{
            primary: { sx: { fontWeight: 500 } }
          }}
        />
      </ListItem>
      {props.isPlaceholder &&
        Array.from({ length: getRandomInt(2, 8) }).map((_, index) => (
          <DrawerNavigationLink
            key={index}
            href={''}
            text={`Item ${index + 1}`}
          />
        ))}
      {props.children}
    </List>
  );
};
