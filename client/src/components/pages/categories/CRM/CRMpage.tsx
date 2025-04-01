import { Box } from '@mui/material';
import { HeadingSection } from '../CRM/HeadingSection';
import { ManageCategoriesSection } from '../../../categories/manage/ManageCategoriesSection';
import { AddCategorySection } from '../../../categories/manage/AddCategorySection';

export const CRMpage = () => {
  return (
    <>
      <Box mt={2}>
        <HeadingSection />
      </Box>
      <Box mt={4}>
        <AddCategorySection />
      </Box>
      <Box mt={4}>
        <ManageCategoriesSection />
      </Box>
    </>
  );
};