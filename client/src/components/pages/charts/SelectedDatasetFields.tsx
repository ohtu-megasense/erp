import {
  Box,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography
} from '@mui/material';
import GridOnIcon from '@mui/icons-material/GridOn';
import { useAppSelector } from '../../../app/hooks';

export const SelectedDatasetFields = () => {
  const dataset = useAppSelector((state) => state.barChartBuilder.dataset);

  if (dataset === null) {
    return (
      <Box
        sx={{
          bgcolor: '#bdbdd9'
        }}
      >
        <Stack sx={{ flexDirection: 'row', gap: 1 }}>
          <GridOnIcon />
          <Typography>No dataset loaded</Typography>
        </Stack>
      </Box>
    );
  }

  const { label, shape } = dataset;

  return (
    <Box
      sx={{
        bgcolor: '#bdbdd9'
      }}
    >
      <Stack sx={{ flexDirection: 'row', gap: 1 }}>
        <GridOnIcon />
        <Typography>{label}</Typography>
      </Stack>
      <List dense disablePadding>
        {Object.entries(shape).map(([property], index) => {
          return (
            <ListItem key={index}>
              <ListItemText primary={property} sx={{ ml: 2 }} />
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};
