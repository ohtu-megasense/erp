import {
  Box,
  Divider,
  Grid2,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ReactNode } from "react";

interface RidesChartGridItem {
  title: string;
  chart: ReactNode;
}

export const RidesChartGridItem = ({ title, chart }: RidesChartGridItem) => {
  const theme = useTheme();
  const isLarge = useMediaQuery(theme.breakpoints.up("xl"));
  const isMedium = useMediaQuery(theme.breakpoints.up("md"));
  const gridItemSize = isLarge ? 4 : isMedium ? 6 : 12;

  return (
    <Grid2 size={gridItemSize}>
      <Paper>
        <Stack>
          <Typography
            variant="h5"
            sx={{
              px: 2,
              py: 2,
              fontWeight: 500,
            }}
          >
            {title}
          </Typography>
          <Divider />
          <Box
            sx={{
              pt: 2,
            }}
          >
            {chart}
          </Box>
        </Stack>
      </Paper>
    </Grid2>
  );
};
