import { Box, Typography } from "@mui/material";
import { useGetInventoryQuery } from "../../../features/apiSlice";

export const InventoryDataSection = () => {
  const { data } = useGetInventoryQuery();

  if (!data) {
    return null;
  }

  return (
    <Box>
      <Typography variant="h6">Inventory Data</Typography>
      <Typography>Active sensor count: {data.active_sensors}</Typography>
    </Box>
  );
};
