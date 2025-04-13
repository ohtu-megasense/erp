import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import {
  AndFilterConfig,
  FilterConfig,
  Item,
  PropertyFilterConfig,
  type View
} from '../../../../shared/types';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  addedFilter,
  removedFilter,
  setPropertyOptions
} from './createViewSlice';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { MouseEventHandler, ReactNode, useEffect, useState } from 'react';
import {
  useCreateViewMutation,
  useGetCategoriesQuery,
  useGetViewsQuery
} from '../../features/apiSlice';
import { addNotification } from '../../features/notificationSlice';

const orangeColor = '#ffaa0b';
const pinkColor = '#ff54a4';
const blueColor = '#116fea';
const greenColor = '#08c408';

const Heading = () => {
  return (
    <Stack>
      <Typography sx={{ color: '#006aff', fontSize: 42, fontWeight: 500 }}>
        Inventory
      </Typography>
      <Typography
        sx={{
          fontSize: 24,
          fontWeight: 500,
          color: orangeColor
        }}
      >
        Manage Views
      </Typography>
    </Stack>
  );
};

const EqualFilter = (props: { filter: PropertyFilterConfig }) => {
  const { filter } = props;
  const { property, value, id } = filter;

  return (
    <FilterListItem>
      <ListItemText primary={`${property} = ${value}`} />
      <RemoveFilterButton id={id} />
    </FilterListItem>
  );
};

const AndFilter = (props: { filter: AndFilterConfig }) => {
  const { filter } = props;
  const { id } = filter;

  // What would be nice display
  // for and filters?

  return (
    <FilterListItem>
      <ListItemText primary={'AND FILTER'} />
      <RemoveFilterButton id={id} />
    </FilterListItem>
  );
};

const Filter = (props: { filter: FilterConfig }) => {
  const { filter } = props;

  switch (filter.type) {
    case 'equals':
      return <EqualFilter filter={filter} />;
    case 'and':
      return <AndFilter filter={filter} />;
    default:
      throw new Error(`Unknown filter`);
  }
};

const FilterListItem = (props: { children: ReactNode }) => {
  return (
    <ListItem
      sx={{
        border: '1.5px solid',
        borderColor: 'divider',
        borderRadius: 4
      }}
    >
      {props.children}
    </ListItem>
  );
};

const RemoveFilterButton = (props: { id: string | number }) => {
  const dispatch = useAppDispatch();

  const onClick = (id: string | number) => {
    dispatch(removedFilter({ id }));
  };

  return (
    <IconButton
      sx={{
        border: '1.5px solid',
        borderRadius: 2,
        borderColor: pinkColor
      }}
      size="small"
      onClick={() => onClick(props.id)}
    >
      <RemoveIcon />
    </IconButton>
  );
};

const AddFilterButton = (props: {
  onClick: MouseEventHandler;
  suffix?: string;
}) => {
  return (
    <Box>
      <IconButton
        onClick={props.onClick}
        sx={{
          border: '1.5px solid',
          borderRadius: 2,
          borderColor: orangeColor
        }}
        size="small"
      >
        <AddIcon />
        {props.suffix}
      </IconButton>
    </Box>
  );
};

const LoadPropertyOptions = () => {
  const module = useAppSelector((state) => state.createView.module);
  const { data: categories = [] } = useGetCategoriesQuery(module);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const getPropertyOptions = (): string[] => {
      const propertyOptions: string[] = [];

      for (const category of categories) {
        const properties = Object.keys(category.itemShape);
        propertyOptions.push(...properties);
      }

      return propertyOptions;
    };

    const properties = getPropertyOptions();
    dispatch(setPropertyOptions({ properties }));
  }, [categories, module, dispatch]);

  return null;
};

const CreateEqualFilter = () => {
  const [notificationId] = useState(crypto.randomUUID());
  const [property, setProperty] = useState('');
  const [value, setValue] = useState('');
  const propertyOptions = useAppSelector(
    (state) => state.createView.propertyOptions
  );
  const dispatch = useAppDispatch();

  const validateInputs = (): boolean => {
    const id = notificationId;

    if (!propertyOptions.includes(property)) {
      dispatch(
        addNotification({
          id,
          message: 'Invalid property for equal filter',
          severity: 'warning'
        })
      );
      return false;
    }

    if (!value) {
      dispatch(
        addNotification({
          id,
          message: 'Enter a value for equal filter',
          severity: 'warning'
        })
      );
      return false;
    }

    return true;
  };

  const onClickAdd = () => {
    const isValid = validateInputs();
    if (!isValid) return;

    const filter: PropertyFilterConfig = {
      id: crypto.randomUUID(),
      type: 'equals',
      property,
      value
    };

    dispatch(addedFilter({ filter }));
    setProperty('');
    setValue('');
  };

  return (
    <Stack
      sx={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2
      }}
    >
      <Typography>Equal Filter</Typography>
      <Stack
        sx={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 2
        }}
      >
        <Box
          sx={{
            minWidth: 180
          }}
        >
          <FormControl fullWidth>
            <InputLabel>Property</InputLabel>
            <Select
              value={property}
              label="Property"
              onChange={({ target }) => setProperty(target.value)}
            >
              {propertyOptions.map((propertyOption) => (
                <MenuItem key={propertyOption} value={propertyOption}>
                  {propertyOption}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Typography>=</Typography>
        <TextField
          placeholder={'Value'}
          value={value}
          onChange={({ target }) => setValue(target.value)}
        />
        <AddFilterButton onClick={onClickAdd} suffix="EQ" />
      </Stack>
    </Stack>
  );
};

const CreateFilters = () => {
  return (
    <>
      <CreateEqualFilter />
    </>
  );
};

const FiltersList = () => {
  const filters = useAppSelector((state) => state.createView.filters);

  return (
    <>
      <List
        component={Stack}
        sx={{
          border: '1.5px solid',
          borderColor: blueColor,
          borderRadius: 4,
          gap: 1,
          p: 2
        }}
      >
        {filters.map((filter, index) => (
          <Filter filter={filter} key={index} />
        ))}
      </List>
    </>
  );
};

const CreateViewButton = () => {
  const view = useAppSelector((state) => state.createView.viewConfig);
  const [apiCreateView] = useCreateViewMutation();

  const onClick = async () => {
    if (view === null) return;
    try {
      const response = await apiCreateView(view).unwrap();
      console.log('Created a view', response);
    } catch (error) {
      console.log('Error creating a view', error);
    }
  };

  return (
    <Box>
      <Button
        fullWidth={false}
        onClick={onClick}
        sx={{
          color: greenColor,
          border: '1.5px solid',
          borderColor: greenColor,
          borderRadius: 2,
          px: 2
        }}
      >
        Save Filter as View
      </Button>
    </Box>
  );
};

const ViewsList = () => {
  const module = useAppSelector((state) => state.createView.module);
  const { data: views = [] } = useGetViewsQuery(module);

  return (
    <Box>
      <Typography
        sx={{
          fontSize: 18,
          fontWeight: 500
        }}
      >
        Views
      </Typography>
      {views.map((view) => (
        <View key={view.id} view={view} />
      ))}
    </Box>
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

const View = (props: { view: View }) => {
  const { view } = props;

  const getShape = (): string[] => {
    if (view.items.length === 0) return [];
    return Object.keys(view.items[0].item_data);
  };

  const shape = getShape();

  return (
    <Box>
      <Table>
        <TableHead>
          <TableRow>
            {shape.map((property) => (
              <TableCell key={property}>{property}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {view.items.map((item) => (
            <Row key={item.id} item={item} />
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export const ViewPage = () => {
  return (
    <>
      <LoadPropertyOptions />
      <Stack
        sx={{
          m: 2,
          p: 2,
          border: '1.5px solid',
          borderRadius: 4,
          gap: 2
        }}
      >
        <Heading />
        <Typography
          sx={{
            fontSize: 18,
            fontWeight: 500
          }}
        >
          Create New View
        </Typography>
        <FiltersList />
        <CreateFilters />
        <CreateViewButton />
        <ViewsList />
      </Stack>
    </>
  );
};
