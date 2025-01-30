import { Container, Grid2 } from "@mui/material";
import { RidesPerWeekdayBarChart } from "./charts/RidesPerWeekdayBarChart";
import { RidesChartGridItem } from "./charts-grid-item/RidesChartGridItem";

export const RidesSection = () => {
  return (
    <Container
      maxWidth={false}
      sx={{
        my: 2,
      }}
    >
      <Grid2 container spacing={2}>
        <RidesChartGridItem
          title="Rides per day of week"
          chart={<RidesPerWeekdayBarChart />}
        />
      </Grid2>
    </Container>
  );
};
