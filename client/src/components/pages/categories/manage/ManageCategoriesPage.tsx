import { Box } from '@mui/material';
import { HeadingSection } from './HeadingSection';
import { ManageCategoriesSection } from '../../../categories/manage/ManageCategoriesSection';

export const ManageCategoriesPage = () => {
  return (
    <>
      <Box mt={2}>
        <HeadingSection />
      </Box>
      <Box mt={4}>
        <ManageCategoriesSection />
      </Box>
    </>
  );
};
