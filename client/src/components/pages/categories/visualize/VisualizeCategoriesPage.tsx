import { Box } from '@mui/material';
import { CategoryTablesSection } from '../../../categories/visualize/CategoryTablesSection';
import { HeadingSection } from './HeadingSection';

export const VisualizeCategoriesPage = () => {
  return (
    <>
      <Box mt={2}>
        <HeadingSection />
      </Box>
      <Box mt={4}>
        <CategoryTablesSection />
      </Box>
    </>
  );
};
