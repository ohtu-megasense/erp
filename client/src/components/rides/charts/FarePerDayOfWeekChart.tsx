import { BarChart } from "@mui/x-charts/BarChart";
import {
  getRideData,
  groupAndSumByProperty,
  sortByDayOfWeek,
} from "../../../data/rideData";
import { getLocaleCurrencyString } from "../../../utils/utils";

export const FarePerDayOfWeekChart = () => {
  const rideData = getRideData();
  const dataset = groupAndSumByProperty({
    data: rideData,
    groupByKey: "dayOfWeek",
    sumByKey: "fareAmount",
  });

  sortByDayOfWeek(dataset, "key");

  const valueFormatter = (value: number | null) => {
    if (value === null) {
      return "N/A";
    }

    return getLocaleCurrencyString(value);
  };

  return (
    <BarChart
      dataset={dataset}
      xAxis={[{ scaleType: "band", dataKey: "key" }]}
      series={[{ dataKey: "value", label: "Fare amount", valueFormatter }]}
    />
  );
};
