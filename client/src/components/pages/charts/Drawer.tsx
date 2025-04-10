import { Box, Drawer as MuiDrawer, Stack, Typography } from '@mui/material';
import { ChartTypeSelection } from './SelectChartType';
import { SelectedDatasetFields } from './SelectedDatasetFields';
import { SelectBarChartData } from './SelectBarChartData';
import { useAppSelector } from '../../../app/hooks';

export const Drawer = () => {
  const chartType = useAppSelector((state) => state.chartType.chartType);
  const drawerWidth = 600;

  return (
    <MuiDrawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box'
        }
      }}
      variant={'permanent'}
      anchor="right"
    >
      <Stack
        sx={{
          flexDirection: 'row'
        }}
      >
        {/** CHART SECTION */}

        <Stack sx={{ bgcolor: '#e3e3e3', width: '50%', p: 1 }}>
          <Typography variant="h5" mb={1}>
            Build
          </Typography>
          <Typography mb={0.5}>Suggestions</Typography>
          <Box
            sx={{
              border: '1px solid',
              minHeight: 200, // temporary for nicer ui
              p: 0.5,
              mb: 2
            }}
          >
            <ChartTypeSelection />
          </Box>
          {chartType === 'bar' && <SelectBarChartData />}
        </Stack>

        {/** DATA SECTION */}

        <Stack sx={{ bgcolor: 'lightblue', width: '50%', p: 1 }}>
          <Typography variant="h5" mb={1}>
            Data
          </Typography>
          <Typography mb={0.5}>Dataset fields</Typography>
          <Box
            sx={{
              minHeight: 200, // temporary for nicer ui
              p: 0.5
            }}
          >
            <SelectedDatasetFields />
          </Box>
        </Stack>
      </Stack>
    </MuiDrawer>
  );
};
