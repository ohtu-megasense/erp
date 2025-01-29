import { BarChart } from "@mui/x-charts/BarChart";
import {
  getDatasetForRidesPerWeekday,
  sortByDayOfWeek,
} from "../../../data/rideData";

export const RidesPerWeekdayBarChart = () => {
  const dataset = getDatasetForRidesPerWeekday();
  sortByDayOfWeek(dataset);

  return (
    <BarChart
      dataset={dataset as any[]}
      series={[{ dataKey: "totalRides", stack: "rides" }]}
      yAxis={[
        {
          scaleType: "band",
          dataKey: "dayOfWeek",
          disableLine: true,
          disableTicks: true,
        },
      ]}
      xAxis={[
        {
          disableLine: true,
          disableTicks: true,
        },
      ]}
      slotProps={{ legend: { hidden: false } }}
      height={500}
      layout="horizontal"
      margin={{
        left: 100,
      }}
    />
  );
};
