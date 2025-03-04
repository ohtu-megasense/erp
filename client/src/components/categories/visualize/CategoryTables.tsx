import { Stack } from '@mui/material';
import { useAppSelector } from '../../../app/hooks';
import { CategoryTable } from './CategoryTable';

export const CategoryTables = () => {
  const categoriesData = useAppSelector(
    (state) => state.categoryData.categoriesData
  );

  return (
    <Stack gap={4}>
      {categoriesData.map((category) => {
        return <CategoryTable key={category.id} category={category} />;
      })}
    </Stack>
  );
};
