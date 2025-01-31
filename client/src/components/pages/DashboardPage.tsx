import { Stack } from "@mui/material";
import { RidesKPISection } from "../rides/sections/RidesKPISection";
import { RidesChartsSection } from "../rides/sections/RidesChartsSection";

export const DashboardPage = () => {
  return (
    <Stack>
      <RidesKPISection />
      <RidesChartsSection />
    </Stack>
  );
};
