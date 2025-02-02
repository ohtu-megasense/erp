import { Box, Container } from "@mui/material";
import { RidesKPISection } from "../rides/sections/RidesKPISection";
import { RidesChartsSection } from "../rides/sections/RidesChartsSection";
import { TopBar } from "../top-bar/TopBar";

export const DashboardPage = () => {
  return (
    <>
      <TopBar />
      <Container maxWidth="xl">
        <Box mt={2}>
          <RidesKPISection />
        </Box>
        <Box mt={2}>
          <RidesChartsSection />
        </Box>
      </Container>
    </>
  );
};
