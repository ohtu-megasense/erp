import { Box } from '@mui/material';
import { HeadingSection } from './sections/HeadingSection';
import { CategoriesListSection } from './sections/CategoriesListSection';

export const CategoriesPage = () => {
  return (
    <>
      <Box mt={2}>
        <HeadingSection />
      </Box>
      <Box mt={4}>
        <CategoriesListSection />
      </Box>
    </>
  );
};
