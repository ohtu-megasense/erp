import { Box } from '@mui/material';
import { HeadingSection } from './HeadingSection';
import { InventoryDataSection } from '../../inventory/InventoryDataSection';

export const DashboardPage = () => {
  return (
    <>
      <Box mt={2}>
        <HeadingSection />
      </Box>
      <Box mt={2}>
        <InventoryDataSection />
      </Box>
    </>
  );
};
