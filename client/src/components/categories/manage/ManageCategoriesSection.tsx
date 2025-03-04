import { Paper, Stack } from '@mui/material';
import { useAppSelector } from '../../../app/hooks';
import { CategoryManager } from './CategoryManager';

export const ManageCategoriesSection = () => {
  const categoriesData = useAppSelector(
    (state) => state.categoryData.categoriesData
  );

  return (
    <Stack gap={4}>
      {categoriesData.map((category) => {
        return (
          <Paper
            key={category.id}
            sx={{
              p: 2
            }}
          >
            <CategoryManager category={category} />
          </Paper>
        );
      })}
    </Stack>
  );
};
