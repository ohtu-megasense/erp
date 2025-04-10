import BarChartIcon from '@mui/icons-material/BarChart';
import { Stack, Typography } from '@mui/material';

export const BarChartPreview = () => {
  return (
    <Stack
      sx={{
        m: 2,
        alignItems: 'center',
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      <BarChartIcon
        sx={{
          height: 400,
          width: 400,
          color: '#aaaaaaff'
        }}
      />
      <Typography>Add data to populate chart</Typography>
    </Stack>
  );
};
