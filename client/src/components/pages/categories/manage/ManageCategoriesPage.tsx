import { Box, Stack, Typography } from '@mui/material';
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
        Create
      </Typography>
      <Stack
        sx={{
          gap: 2
        }}
      >
        <AddCategoryForm />
        <AddCategoryItems />
      </Stack>
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
        Update
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
