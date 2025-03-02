import { Stack, Typography } from '@mui/material';
import { useAppSelector } from '../../../app/hooks';
import { AddCategoryItemForm } from '../AddCategoryItemForm';

export const AddCategoryItemsSection = () => {
  const data = useAppSelector((state) => state.categoryData.categoriesData);

  return (
    <>
      {/* <Typography
        variant="h5"
        sx={{
          mb: 2
        }}
      >
        Add Items to Categories
      </Typography> */}
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
