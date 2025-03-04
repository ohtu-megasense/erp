import { Box } from '@mui/material';
import { HeadingSection } from './HeadingSection';
import { CategoryTablesSection } from '../../../categories/visualize/CategoryTablesSection';

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
