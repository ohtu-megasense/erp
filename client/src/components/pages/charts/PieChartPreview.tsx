import { Stack, Typography } from '@mui/material';
import PieChartIcon from '@mui/icons-material/PieChart';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

export const PieChartPreview = () => {
  return (
    <Stack
      sx={{
        m: 2,
        alignItems: 'center',
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Stack
        sx={{
          flexDirection: 'row',
          gap: 2
        }}
      >
        <Typography
          sx={{
            fontSize: 48
          }}
        >
          NOT IMPLEMENTED :D
        </Typography>
        <ThumbUpIcon
          sx={{
            fontSize: 60
          }}
        />
      </Stack>
      <PieChartIcon
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
