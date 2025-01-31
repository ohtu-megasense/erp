import { countOccurrencesByKey, getRideData } from "../../../data/rideData";
import { DistributonPieChart } from "./DistributionPieChart";

export const PaymentMethodDistributionChart = () => {
  const rideData = getRideData();
  const dataset = countOccurrencesByKey({
    data: rideData,
    key: "paymentMethod",
  });

  return <DistributonPieChart dataset={dataset} />;
};
