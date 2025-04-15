import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Menu,
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
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  AndFilterConfig,
  DecoratorOption,
  decoratorOptions,
  FilterConfig,
  FilterOption,
  filterOptions,
  Item,
  ModuleOption,
  moduleOptions,
  PropertyFilterConfig,
  ViewConfig,
  type View
} from '../../../../shared/types';
import { ChangeEvent, useEffect, useState } from 'react';
import {
  useCreateViewMutation,
  useGetCategoriesQuery,
  useGetViewsQuery
} from '../../features/apiSlice';
import {
  addNode,
  createView,
  createNode,
  deleteNode,
  Id,
  reset,
  saveFilter,
  setModule,
  setName,
  setPropertyOptions,
  type Node
} from './createViewSliceV2';
import { store } from '../../app/store';

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

// This could be "create decorator"
// when more are added
const And = (props: { filter: AndFilterConfig; parentId: Id }) => {
  const { filter } = props;

  const nodes = useAppSelector((state) => state.createView.nodes);
  const children = nodes.filter((node) => node.parentId === filter.id);

  return (
    <Box>
      <Stack
        sx={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 1
        }}
      >
        <Typography>AND (Dekoraattorin valinta tähän)</Typography>
        <AddButton parentId={filter.id} text="+ Filter" />
        <DeleteButton id={props.filter.id} />
      </Stack>
      <Stack ml={4} mt={2} gap={2}>
        {children.map((child) => (
          <Node
            key={child.filter.id}
            filter={child.filter}
            parentId={filter.id}
          />
        ))}
      </Stack>
    </Box>
  );
};

const CreateFilter = (props: {
  filter: PropertyFilterConfig;
  parentId: Id;
}) => {
  const propertyOptions = useAppSelector(
    (state) => state.createView.propertyOptions
  );

  const [property, setProperty] = useState('');
  const [value, setValue] = useState('');
  const [type, setType] = useState<FilterOption>('equals'); // default

  const createFilter = (): PropertyFilterConfig => {
    return {
      id: props.filter.id,
      property,
      type,
      value
    };
  };

  return (
    <Stack
      sx={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2
      }}
    >
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
        <Box
          sx={{
            minWidth: 180
          }}
        >
          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select
              value={type}
              label="Type"
              onChange={({ target }) => setType(target.value)}
            >
              {Object.values(filterOptions).map((filterOption) => (
                <MenuItem key={filterOption} value={filterOption}>
                  {filterOption}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <TextField
          placeholder={'Value'}
          value={value}
          onChange={({ target }) => setValue(target.value)}
        />
      </Stack>
      <SaveButton id={props.filter.id} filter={createFilter()} />
      <DeleteButton id={props.filter.id} />
    </Stack>
  );
};

const SaveButton = (props: { id: Id; filter: PropertyFilterConfig }) => {
  const { id, filter } = props;
  const dispatch = useAppDispatch();

  const onClick = () => {
    dispatch(saveFilter({ id, filter }));
  };
  return (
    <Button
      variant="outlined"
      size="small"
      sx={{
        color: greenColor,
        borderColor: greenColor
      }}
      onClick={onClick}
    >
      +
    </Button>
  );
};

const DeleteButton = (props: { id: Id }) => {
  const dispatch = useAppDispatch();

  const onClick = () => {
    dispatch(deleteNode({ id: props.id }));
  };
  return (
    <Button
      variant="outlined"
      size="small"
      sx={{
        color: pinkColor,
        borderColor: pinkColor
      }}
      onClick={onClick}
    >
      -
    </Button>
  );
};

const Node = (props: { filter: FilterConfig; parentId: Id }) => {
  const { filter, parentId } = props;

  switch (filter.type) {
    case 'and':
      return <And filter={filter} parentId={parentId} />;
    case 'equals':
      return <CreateFilter filter={filter} parentId={parentId} />;
    default:
      throw new Error('Unknown filter config');
  }
};

const RootNode = () => {
  const nodes = useAppSelector((state) => state.createView.nodes);
  const root = nodes.length > 0 ? nodes[0] : null;

  return (
    <>
      {root ? (
        <Node
          key={root.filter.id}
          filter={root.filter}
          parentId={root.parentId}
        />
      ) : (
        <>
          <AddButton parentId={-1} text="Create Filter" />
        </>
      )}
    </>
  );
};

const AddButton = (props: { parentId: Id; text?: string }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const dispatch = useAppDispatch();
  const options = [
    ...Object.values(filterOptions),
    ...Object.values(decoratorOptions)
  ].sort((a, b) => a.localeCompare(b));

  const onClickOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const onClose = () => {
    setAnchorEl(null);
  };

  const onClickNode = (type: FilterOption | DecoratorOption) => {
    const isRoot = store.getState().createView.nodes.length === 0;
    const parentId = isRoot ? -1 : props.parentId;
    const node = createNode(type, parentId);

    dispatch(
      addNode({
        node
      })
    );

    onClose();
  };

  return (
    <Box>
      <Button onClick={onClickOpen} variant="outlined" size="small">
        {props.text || 'Create Filter'}
      </Button>
      <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={onClose}>
        {options.map((option) => (
          <MenuItem
            onClick={() => onClickNode(option)}
            key={option}
            value={option}
          >
            {option.toLocaleUpperCase()}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

const ResetButton = () => {
  const dispatch = useAppDispatch();

  const onClick = () => {
    dispatch(reset());
  };

  return <Button onClick={onClick}>Reset</Button>;
};

const CreateButton = () => {
  const name = useAppSelector((state) => state.createView.name);
  const module = useAppSelector((state) => state.createView.module);
  const nodes = useAppSelector((state) => state.createView.nodes);
  const [isAccepted, setIsAccepted] = useState(false);
  const dispatch = useAppDispatch();
  const [apiCreateView] = useCreateViewMutation();

  useEffect(() => {
    setIsAccepted(false);
  }, [nodes]);

  const getView = (): ViewConfig | null => {
    if (!name) {
      console.log('Invalid name');
      return null;
    }

    if (nodes.length === 0) {
      console.log('Add a filter first');
      return null;
    }

    return createView(module, name, nodes);
  };

  const onClick = async () => {
    const view = getView();
    if (view === null) return;
    try {
      const response = await apiCreateView(view).unwrap();
      dispatch(reset());
      console.log('Created a view', response);
    } catch (error) {
      console.log('Error creating a view', error);
    }
  };

  const isEnabled = nodes.length > 0 && Boolean(name) && isAccepted;

  return (
    <Stack gap={2}>
      <Stack
        sx={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 2
        }}
      >
        <Typography>Tallensin Filtterit (Dekoja ei tarvi)?</Typography>
        <Button
          variant="contained"
          size="small"
          onClick={() => setIsAccepted(true)}
          disableRipple={true}
        >
          Joo
        </Button>
      </Stack>
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
    </Stack>
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

export const ViewPageV2 = () => {
  return (
    <>
      <LoadPropertyOptions />
      <Typography my={4} mx={2}>
        View Page Version 2
      </Typography>
      <Stack
        sx={{
          mx: 2,
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
          <RootNode />
        </Box>
        <Box bgcolor={debugGreyColor} p={2}>
          <Name />
        </Box>
        <Box bgcolor={debugGreyColor} p={2}>
          <CreateButton />
        </Box>
        <Box bgcolor={debugGreyColor} p={2}>
          <ResetButton />
        </Box>
        <Box bgcolor={debugGreyColor} p={2}>
          <ViewsList />
        </Box>
      </Stack>
    </>
  );
};
