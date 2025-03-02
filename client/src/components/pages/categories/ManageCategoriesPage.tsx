import { Box, Typography } from '@mui/material';
import { AddCategoryItemsSection } from '../../categories/sections/AddCategoryItemsSection';
import { AddCategoryForm } from '../../categories/AddCategoryForm';
import { CategoryItemsManager } from '../../categories/CategoryItemsManager';
import { ManageHeadingSection } from '../../categories/sections/ManageHeadingSection';

export const ManageCategoriesPage = () => {
  return (
    <>
      <Box mt={2}>
        <ManageHeadingSection />
      </Box>
      <Box mt={4}>
        <Typography mb={2}>Add Items</Typography>
        <AddCategoryForm />
        <AddCategoryItemsSection />
      </Box>
      <Box mt={4}>
        <Typography mb={2}>Edit Items</Typography>
        <CategoryItemsManager />
      </Box>
    </>
  );
};
