import { Box, Stack, Typography } from '@mui/material';
import { ManageCategoriesSection } from '../../../categories/manage/ManageCategoriesSection';
import { AddCategorySection } from '../../../categories/manage/AddCategorySection';
import { blueColor, orangeColor } from '../../../view/colors';

const Heading = () => {
  return (
    <Stack>
      <Typography sx={{ color: blueColor, fontSize: 38, fontWeight: 500 }}>
        CRM
      </Typography>
      <Typography
        sx={{
          fontSize: 24,
          fontWeight: 500,
          color: orangeColor
        }}
      >
        Manage Data
      </Typography>
    </Stack>
  );
};

export const CRMpage = () => {
  return (
    <Box px={2}>
      <Box mt={2}>
        <Heading />
      </Box>
      <Box mt={4}>
        <AddCategorySection module="crm" />
      </Box>
      <Box mt={4}>
        <ManageCategoriesSection module="crm" />
      </Box>
    </Box>
  );
};
