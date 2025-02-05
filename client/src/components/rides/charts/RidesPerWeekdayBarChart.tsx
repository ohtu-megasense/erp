import { BarChart } from "@mui/x-charts/BarChart";
import {
  getDatasetForRidesPerWeekday,
  sortByDayOfWeek,
} from "../../../data/rideData";

export const RidesPerWeekdayBarChart = () => {
  const dataset = getDatasetForRidesPerWeekday();
  sortByDayOfWeek(dataset, "dayOfWeek");

  return (
    <BarChart
      dataset={dataset}
      xAxis={[{ scaleType: "band", dataKey: "dayOfWeek" }]}
      series={[
        { dataKey: "ridesOnNonPublicHoliday", label: "Normal", stack: "day" },
        {
          dataKey: "ridesOnPublicHoliday",
          label: "Public holiday",
          stack: "day",
        },
      ]}
    />
  );
};
