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
  SelectChangeEvent,
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
  ModuleOption,
  moduleOptions,
  PropertyFilterConfig,
  ViewConfig,
  type View
} from '../../../../shared/types';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  addedFilter,
  removedFilter,
  resetState,
  setModule,
  setName,
  setPropertyOptions
} from './createViewSlice';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import {
  ChangeEvent,
  MouseEventHandler,
  ReactNode,
  useEffect,
  useState
} from 'react';
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
const debugGreyColor = '#dcdcdc';

const Heading = () => {
  const module = useAppSelector((state) => state.createView.module);

  return (
    <Stack>
      <Typography sx={{ color: '#006aff', fontSize: 38, fontWeight: 500 }}>
        {module.toLocaleUpperCase()}
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
  const { data: inventory = [] } = useGetCategoriesQuery('inventory');
  const { data: crm = [] } = useGetCategoriesQuery('crm');
  const dispatch = useAppDispatch();

  useEffect(() => {
    const getPropertyOptions = (): string[] => {
      const propertyOptions: string[] = [];

      for (const category of inventory) {
        const properties = Object.keys(category.itemShape);
        propertyOptions.push(...properties);
      }

      for (const category of crm) {
        const properties = Object.keys(category.itemShape);
        propertyOptions.push(...properties);
      }

      const uniques = Array.from(new Set(propertyOptions));
      return uniques.sort((a, b) => a.localeCompare(b));
    };

    const properties = getPropertyOptions();
    dispatch(setPropertyOptions({ properties }));
  }, [inventory, crm, module, dispatch]);

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
  const filters = useAppSelector((state) => state.createView.root.filters);

  return (
    <>
      {filters.length > 0 && (
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
      )}
    </>
  );
};

const SaveButton = () => {
  const name = useAppSelector((state) => state.createView.name);
  const module = useAppSelector((state) => state.createView.module);
  const root = useAppSelector((state) => state.createView.root);
  const dispatch = useAppDispatch();
  const [apiCreateView] = useCreateViewMutation();

  const getView = (): ViewConfig | null => {
    if (!name) {
      console.log('Invalid name');
      return null;
    }

    if (root.filters.length === 0) {
      console.log('Add a filter first');
      return null;
    }

    const view: ViewConfig = {
      name,
      module,
      filterConfig: root
    };

    return view;
  };

  const onClick = async () => {
    const view = getView();
    if (view === null) return;
    try {
      const response = await apiCreateView(view).unwrap();
      dispatch(resetState());
      console.log('Created a view', response);
    } catch (error) {
      console.log('Error creating a view', error);
    }
  };

  const isEnabled = root.filters.length > 0 && Boolean(name);

  return (
    <Box>
      <Button
        variant="outlined"
        disabled={!isEnabled}
        fullWidth={false}
        onClick={onClick}
        sx={{
          color: greenColor,
          outline: '1.5px solid',
          outlineColor: isEnabled ? greenColor : undefined,
          borderRadius: 2,
          px: 2
        }}
      >
        Save Filter as View
      </Button>
    </Box>
  );
};

const Name = () => {
  const name = useAppSelector((state) => state.createView.name);
  const dispatch = useAppDispatch();

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setName({ name: event.target.value }));
  };

  return (
    <Box>
      <TextField
        fullWidth={true}
        value={name}
        onChange={onChange}
        placeholder="Enter filter name..."
      />
    </Box>
  );
};

const ViewsList = () => {
  const module = useAppSelector((state) => state.createView.module);
  const { data: views = [] } = useGetViewsQuery(module);
  const ordered = [...views].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Stack
      sx={{
        gap: 2
      }}
    >
      <Stack>
        <Typography
          sx={{
            fontSize: 18,
            fontWeight: 500
          }}
        >
          Views
        </Typography>
        {views.length === 0 && (
          <Typography variant="caption">No Views Found</Typography>
        )}
      </Stack>
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
    <Stack
      sx={{
        border: '1.5px solid',
        borderRadius: 2,
        borderColor: blueColor,
        py: 2
      }}
    >
      <Stack px={2}>
        <Typography>{view.name}</Typography>
        <Typography variant="caption">{view.items.length} items</Typography>
      </Stack>
      {view.items.length > 0 && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>id</TableCell>
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
  );
};

const Row = (props: { item: Item }) => {
  const values = Object.values(props.item.item_data);
  return (
    <TableRow>
      <TableCell>{props.item.id}</TableCell>
      {values.map((value, index) => (
        <TableCell key={index}>{value}</TableCell>
      ))}
    </TableRow>
  );
};

const SetModuleButton = () => {
  const module = useAppSelector((state) => state.createView.module);
  const dispatch = useAppDispatch();

  const onChange = (event: SelectChangeEvent<string>) => {
    const selected = event.target.value as ModuleOption;
    dispatch(setModule({ module: selected }));
  };

  return (
    <Box
      sx={{
        minWidth: 180
      }}
    >
      <FormControl fullWidth>
        <InputLabel>Module</InputLabel>
        <Select value={module} label="Module" onChange={onChange}>
          {Object.values(moduleOptions).map((option) => (
            <MenuItem key={option} value={option}>
              {option.toLocaleUpperCase()}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

const CreateView = () => {
  const propertyOptions = useAppSelector(
    (state) => state.createView.propertyOptions
  );

  return (
    <Stack gap={2}>
      {propertyOptions.length > 0 ? (
        <>
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
          <Name />
          <SaveButton />
        </>
      ) : (
        <>
          <Typography>No data for view creation</Typography>
        </>
      )}
    </Stack>
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
        <Box bgcolor={debugGreyColor}>
          <SetModuleButton />
        </Box>
        <Box bgcolor={debugGreyColor} p={2}>
          <Heading />
        </Box>
        <Box bgcolor={debugGreyColor} p={2}>
          <CreateView />
        </Box>
        <Box bgcolor={debugGreyColor} p={2}>
          <ViewsList />
        </Box>
      </Stack>
    </>
  );
};
