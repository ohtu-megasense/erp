import { countOccurrencesByKey, getRideData } from "../../../data/rideData";
import { DistributonPieChart } from "./DistributionPieChart";

export const VehicleTypeDistributionChart = () => {
  const rideData = getRideData();
  const dataset = countOccurrencesByKey({ data: rideData, key: "vehicleType" });

  return <DistributonPieChart dataset={dataset} />;
};
