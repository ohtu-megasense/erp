import { useGetInventoryQuery } from '../../features/apiSlice';
import { DistributonPieChart } from '../charts/DistributionPieChart';

export const SensorDistributionChart = () => {
  const { data } = useGetInventoryQuery();

  if (!data) {
    return null;
  }

  // Transform API data into the expected format for DistributionPieChart
  const dataset = [
    {
      id: 'Active',
      key: 'active',
      value: data.active_sensors,
      label: 'Active'
    },
    {
      id: 'Inactive',
      key: 'inactive',
      value: data.inactive_sensors,
      label: 'Inactive'
    }
  ];

  return <DistributonPieChart dataset={dataset} />;
};
