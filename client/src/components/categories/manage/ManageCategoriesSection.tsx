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
          <>
            <Paper
              sx={{
                p: 2
              }}
            >
              <CategoryManager key={category.id} category={category} />
            </Paper>
          </>
        );
      })}
    </Stack>
  );
};
