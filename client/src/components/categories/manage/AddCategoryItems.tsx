import { Stack, Typography } from '@mui/material';
import { useAppSelector } from '../../../app/hooks';
import { AddCategoryItemForm } from './AddCategoryItemForm';

export const AddCategoryItems = () => {
  const data = useAppSelector((state) => state.categoryData.categoriesData);

  return (
    <>
      {data.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No categories available
        </Typography>
      ) : (
        <Stack>
          {data.map((category) => (
            <AddCategoryItemForm key={category.id} category={category} />
          ))}
        </Stack>
      )}
    </>
  );
};
