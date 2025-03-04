import { PieChart } from '@mui/x-charts';

interface DistributionData {
  id: string | number;
  key: string;
  value: number;
  label: string;
}

interface DistributonPieChartProps {
  dataset: DistributionData[];
}

export const DistributonPieChart = ({ dataset }: DistributonPieChartProps) => {
  return (
    <PieChart
      series={[
        {
          data: dataset
        }
      ]}
      width={400}
      height={200}
    />
  );
};
