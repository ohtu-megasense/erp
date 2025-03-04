import { Box, Typography } from '@mui/material';
import { AddCategoryItems } from '../../../categories/manage/AddCategoryItems';
import { HeadingSection } from './HeadingSection';
import { UpdateItems } from '../../../categories/manage/UpdateItems';
import { AddCategoryForm } from '../../../categories/manage/AddCategoryForm';

const AddItemsSection = () => {
  return (
    <>
      <Typography
        sx={{
          fontSize: 24,
          mb: 2
        }}
      >
        Add Items
      </Typography>
      <AddCategoryForm />
      <AddCategoryItems />
    </>
  );
};

const UpdateItemsSection = () => {
  return (
    <>
      <Typography
        sx={{
          fontSize: 24,
          mb: 2
        }}
      >
        Edit Items
      </Typography>
      <UpdateItems />
    </>
  );
};

export const ManageCategoriesPage = () => {
  return (
    <>
      <Box mt={2}>
        <HeadingSection />
      </Box>
      <Box mt={4}>
        <AddItemsSection />
      </Box>
      <Box mt={4}>
        <UpdateItemsSection />
      </Box>
    </>
  );
};
