import {
  Container,
  Divider,
  Grid2,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { getKPIData } from "../../../data/rideData";
import { KPIItem } from "../key-performance-indicators/KPIItem";

export const RidesKPISection = () => {
  const kpiData = getKPIData();

  return (
    <Container
      maxWidth={false}
      sx={{
        my: 2,
      }}
    >
      <Paper>
        <Stack>
          <Typography
            sx={{
              px: 2,
              py: 2,
              fontWeight: 500,
            }}
          >
            Key Performance Indicators
          </Typography>
          <Divider />
          <Grid2 container spacing={2} sx={{ p: 2 }}>
            {kpiData.map((kpi) => (
              <KPIItem key={kpi.label} label={kpi.label} value={kpi.value} />
            ))}
          </Grid2>
        </Stack>
      </Paper>
    </Container>
  );
};
