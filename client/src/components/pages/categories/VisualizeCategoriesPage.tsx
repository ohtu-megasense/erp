import { Box } from '@mui/material';
import { VisualizationHeadingSection } from '../../categories/sections/VisualizationHeadingSection';
import { CategoryTablesSection } from '../../categories/sections/CategoryTablesSection';

export const VisualizeCategoriesPage = () => {
  return (
    <>
      <Box mt={2}>
        <VisualizationHeadingSection />
      </Box>
      <Box mt={4}>
        <CategoryTablesSection />
      </Box>
    </>
  );
};
