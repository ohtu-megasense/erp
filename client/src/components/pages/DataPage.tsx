import { Box, Stack, Typography } from '@mui/material';
import { ManageCategoriesSection } from '../categories/manage/ManageCategoriesSection';
import { AddCategorySection } from '../categories/manage/AddCategorySection';
import { blueColor, orangeColor } from '../view/colors';
import { ModuleOption } from '../../../../shared/types';

const Heading = (props: { module: ModuleOption }) => {
  return (
    <Stack>
      <Typography sx={{ color: blueColor, fontSize: 38, fontWeight: 500 }}>
        {props.module.toLocaleUpperCase()}
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

export const DataPage = (props: { module: ModuleOption }) => {
  return (
    <Box px={2}>
      <Box mt={2}>
        <Heading module={props.module} />
      </Box>
      <Box mt={4}>
        <AddCategorySection module={props.module} />
      </Box>
      <Box mt={4}>
        <ManageCategoriesSection module={props.module} />
      </Box>
    </Box>
  );
};
