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
  const isAtLeastLarge = useMediaQuery(theme.breakpoints.up("lg"));
  const isMedium = useMediaQuery(theme.breakpoints.only("md"));
  const isSmall = useMediaQuery(theme.breakpoints.only("sm"));

  const getGridItemSize = () => {
    if (isAtLeastLarge) return 4;
    if (isMedium) return 4;
    if (isSmall) return 6;
    return 12;
  };

  const gridItemSize = getGridItemSize();

  return (
    <Grid2 size={gridItemSize}>
      <Paper>
        <Stack>
          <Typography
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
              aspectRatio: 1 / 0.8,
            }}
          >
            {chart}
          </Box>
        </Stack>
      </Paper>
    </Grid2>
  );
};
