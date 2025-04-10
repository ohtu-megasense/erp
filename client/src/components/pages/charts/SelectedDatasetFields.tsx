import {
  Box,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography
} from '@mui/material';
import GridOnIcon from '@mui/icons-material/GridOn';
import { testDataset } from './dataset';

export const SelectedDatasetFields = () => {
  const { label, shape } = testDataset;

  // idea is to show which fields are
  // active in the chart, commented out
  // for now because of prototyping stuff

  // const visualizeState = useAppSelector((state) => state.datasetFields.fields);

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
          // const isChecked = selectableFields.some((p) => p === property);

          return (
            <ListItem key={index}>
              {/* <Checkbox
                disableRipple
                checked={isChecked}
                sx={{
                  cursor: 'default'
                }}
              /> */}
              <ListItemText primary={property} sx={{ ml: 2 }} />
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};
