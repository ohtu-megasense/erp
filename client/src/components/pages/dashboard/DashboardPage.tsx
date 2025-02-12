import { Box, Typography } from "@mui/material";
import { RidesKPISection } from "../../rides/sections/RidesKPISection";
import { RidesChartsSection } from "../../rides/sections/RidesChartsSection";
import { HeadingSection } from "./HeadingSection";
import { InventoryDataSection } from "../../rides/sections/InventoryDataSection";


export const DashboardPage = () => {
  return (
    <>
      <Box mt={2}>
        <HeadingSection />
      </Box>
      <Box mt={2}>
        <RidesKPISection />
      </Box>
      <Box mt={2}>
        <RidesChartsSection />
      </Box>
      <Box mt={2}>
        <InventoryDataSection />
      </Box>
    </>
  );
};