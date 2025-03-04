import { Paper, Stack, Typography } from '@mui/material';
import { useAppSelector } from '../../../app/hooks';
import { CategoryTable } from './CategoryTable';

export const CategoryTables = () => {
  const categoriesData = useAppSelector(
    (state) => state.categoryData.categoriesData
  );

  return (
    <Stack gap={4}>
      {categoriesData.map((category) => {
        return (
          <Paper
            sx={{
              p: 2
            }}
          >
            <Typography
              sx={{
                mb: 2
              }}
            >
              {category.name}
            </Typography>
            <CategoryTable
              key={category.id}
              category={category}
              isEditing={false}
            />
          </Paper>
        );
      })}
    </Stack>
  );
};
