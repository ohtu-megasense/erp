import { useAppSelector } from '../../app/hooks';
import { Box, List, ListItem, ListItemText } from '@mui/material';

export const CategoryShapes = () => {
  const categoryData = useAppSelector(
    (state) => state.categoryData.categoriesData
  );

  return (
    <List dense>
      {categoryData.map((category) => (
        <Box key={category.id}>
          <ListItem>
            <ListItemText
              primary={category.name}
              slotProps={{
                primary: {
                  variant: 'body1'
                }
              }}
            />
          </ListItem>
          <ListItem>
            <List dense disablePadding>
              {Object.entries(category.itemShape).map(([key, value], index) => (
                <ListItem key={index}>
                  <ListItemText primary={`${key} - ${value}`} />
                </ListItem>
              ))}
            </List>
          </ListItem>
        </Box>
      ))}
    </List>
  );
};
