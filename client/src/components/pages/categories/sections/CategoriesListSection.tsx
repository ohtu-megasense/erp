import { Paper, Typography } from '@mui/material';
import { CategoriesList } from '../../../categories/CategoriesList';

export const CategoriesListSection = () => {
  return (
    <>
      <Typography
        sx={{
          fontSize: 22,
          mb: 2
        }}
      >
        Inventory Categories
      </Typography>
      <Paper>
        <CategoriesList />
      </Paper>
    </>
  );
};
