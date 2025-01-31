import { PieChart } from "@mui/x-charts";
import { DistributionData } from "../../../data/rideData";

interface DistributonPieChartProps {
  dataset: DistributionData[];
}

export const DistributonPieChart = ({ dataset }: DistributonPieChartProps) => {
  return (
    <PieChart
      series={[
        {
          data: dataset,
        },
      ]}
      width={400}
      height={200}
    />
  );
};
