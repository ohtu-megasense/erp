import { Box, Container } from "@mui/material";
import { RidesKPISection } from "../../rides/sections/RidesKPISection";
import { RidesChartsSection } from "../../rides/sections/RidesChartsSection";
import { TopBar } from "../../top-bar/TopBar";
import { Drawer } from "../../drawer/Drawer";
import { HeadingSection } from "./HeadingSection";

export const DashboardPage = () => {
  return (
    <>
      <TopBar />
      <Box display="flex">
        <Drawer />
        <Container
          maxWidth="xl"
          sx={{
            mb: 2,
          }}
        >
          <Box component="main">
            <Box mt={2}>
              <HeadingSection />
            </Box>
            <Box mt={2}>
              <RidesKPISection />
            </Box>
            <Box mt={2}>
              <RidesChartsSection />
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};
