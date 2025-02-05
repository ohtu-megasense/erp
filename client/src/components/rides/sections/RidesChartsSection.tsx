import { Grid2 } from "@mui/material";
import { RidesChartGridItem } from "../charts-grid-item/RidesChartGridItem";
import { PaymentMethodDistributionChart } from "../charts/PaymentMethodDistributionChart";
import { RidesPerWeekdayBarChart } from "../charts/RidesPerWeekdayBarChart";
import { VehicleTypeDistributionChart } from "../charts/VehicleTypeDistributionChart";
import { FarePerDayOfWeekChart } from "../charts/FarePerDayOfWeekChart";

export const RidesChartsSection = () => {
  return (
    <Grid2 container spacing={2}>
      <RidesChartGridItem
        title="Rides per day of week"
        chart={<RidesPerWeekdayBarChart />}
      />
      <RidesChartGridItem
        title="Fare per day of week"
        chart={<FarePerDayOfWeekChart />}
      />
      <RidesChartGridItem
        title="Vehicle type distribution"
        chart={<VehicleTypeDistributionChart />}
      />
      <RidesChartGridItem
        title="Payment method distribution"
        chart={<PaymentMethodDistributionChart />}
      />
    </Grid2>
  );
};
