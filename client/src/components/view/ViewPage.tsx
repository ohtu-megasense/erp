import {
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { useAppSelector } from '../../app/hooks';
import { Item, type View } from '../../../../shared/types';
import { useGetViewsQuery } from '../../features/apiSlice';

const orangeColor = '#ffaa0b';
const blueColor = '#006aff';

const Heading = () => {
  const module = useAppSelector((state) => state.createView.module);

  return (
    <Stack>
      <Typography sx={{ color: blueColor, fontSize: 38, fontWeight: 500 }}>
        {module.toLocaleUpperCase()}
      </Typography>
      <Typography
        sx={{
          fontSize: 24,
          fontWeight: 500,
          color: orangeColor
        }}
      >
        Views
      </Typography>
    </Stack>
  );
};

const ViewsList = () => {
  const module = useAppSelector((state) => state.createView.module);
  const { data: views = [] } = useGetViewsQuery(module);
  const ordered = [...views].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Stack
      sx={{
        gap: 4
      }}
    >
      {views.length === 0 && (
        <Typography variant="caption">No Views Found</Typography>
      )}
      {ordered.map((view) => (
        <View key={view.id} view={view} />
      ))}
    </Stack>
  );
};

const View = (props: { view: View }) => {
  const { view } = props;

  const getShape = (): string[] => {
    if (view.items.length === 0) return [];
    return Object.keys(view.items[0].item_data);
  };

  const shape = getShape();

  return (
    <Stack gap={2}>
      <Stack>
        <Typography
          sx={{
            fontSize: 16
          }}
        >
          {view.name}
        </Typography>
      </Stack>

      <Stack
        sx={{
          border: '1.5px solid',
          borderRadius: 2,
          borderColor: blueColor,
          p: 2
        }}
      >
        {view.items.length === 0 && (
          <Typography variant="caption">No items found</Typography>
        )}
        {view.items.length > 0 && (
          <Table>
            <TableHead>
              <TableRow>
                {shape.map((property, index) => (
                  <TableCell key={index}>{property}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {view.items.map((item) => (
                <Row key={item.id} item={item} />
              ))}
            </TableBody>
          </Table>
        )}
      </Stack>
    </Stack>
  );
};

const Row = (props: { item: Item }) => {
  const values = Object.values(props.item.item_data);
  return (
    <TableRow>
      {values.map((value, index) => (
        <TableCell key={index}>{value}</TableCell>
      ))}
    </TableRow>
  );
};

export const ViewPage = () => {
  return (
    <Stack
      sx={{
        mx: 2,
        mt: 1,
        borderRadius: 4,
        gap: 2
      }}
    >
      <Heading />
      <ViewsList />
    </Stack>
  );
};
