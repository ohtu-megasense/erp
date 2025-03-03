import { Box, Typography } from '@mui/material';
import { Grid2 } from '@mui/material';
import { SensorDistributionChart } from './SensorDistributionChart';
import { ChartGridItem } from '../charts/ChartGridItem';
import { useGetInventoryQuery } from '../../features/apiSlice';

export const InventoryDataSection = () => {
  const { data } = useGetInventoryQuery();

  if (!data) {
    return null;
  }

  return (
    <Box>
      <Typography variant="h6">Inventory Data</Typography>
      <Typography>Total sensors: {data.total_sensors}</Typography>
      <Typography>Active sensor count: {data.active_sensors}</Typography>
      <Typography>Inactive sensor count: {data.inactive_sensors}</Typography>
      <Typography>
        Total cloud resources: {data.total_cloud_resources}
      </Typography>
      <Typography>Monthly API usage: {data.monthly_api_usage}</Typography>

      <Grid2 container spacing={2}>
        <ChartGridItem
          title="Sensor status distribution"
          chart={<SensorDistributionChart />}
        />
      </Grid2>
    </Box>
  );
};
