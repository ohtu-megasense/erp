import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  Stack,
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
  ModuleOption,
  OrFilterConfig,
  PropertyFilterConfig,
  ViewConfig
} from '../../../../shared/types';
import {
  ChangeEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from 'react';
import {
  useCreateViewMutation,
  useGetCategoriesQuery
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
  type Node,
  setDecoratorType,
  setInvert,
  Invert
} from './createViewSlice';
import { store } from '../../app/store';
import { blueColor, greenColor, orangeColor, pinkColor } from './colors';
import { ViewsList } from './ViewsList';
import RemoveIcon from '@mui/icons-material/Remove';

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
        Manage Views
      </Typography>
    </Stack>
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

const Decorator = (props: {
  filter: AndFilterConfig | OrFilterConfig;
  parentId: Id;
}) => {
  const { filter } = props;
  const dispatch = useAppDispatch();

  const nodes = useAppSelector((state) => state.createView.nodes);
  const children = nodes.filter((node) => node.parentId === filter.id);

  const onChange = (type: DecoratorOption) => {
    dispatch(setDecoratorType({ id: filter.id, type }));
  };

  return (
    <Stack gap={2}>
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
            <InputLabel>Decorator</InputLabel>
            <Select
              value={filter.type}
              label="Decorator"
              onChange={({ target }) =>
                onChange(target.value as DecoratorOption)
              }
            >
              {Object.values(decoratorOptions).map((decoratorOption) => (
                <MenuItem key={decoratorOption} value={decoratorOption}>
                  {decoratorOption.toLocaleUpperCase()}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <AddButton parentId={filter.id} text="+ Filter" />
        <DeleteButton id={props.filter.id} />
      </Stack>
      <Stack ml={4} gap={2}>
        {children.map((child) => (
          <Node
            key={child.filter.id}
            filter={child.filter}
            parentId={filter.id}
          />
        ))}
      </Stack>
    </Stack>
  );
};

const Filter = (props: { filter: PropertyFilterConfig; parentId: Id }) => {
  const { filter } = props;
  const propertyOptions = useAppSelector(
    (state) => state.createView.propertyOptions
  );

  const [property, setProperty] = useState(filter.property);
  const [invert, setInvertState] = useState<Invert>(
    store
      .getState()
      .createView.nodes.find((node) => node.filter.id === filter.id)?.invert ||
      'is'
  );

  const [value, setValue] = useState(filter.value);
  const [type, setType] = useState<FilterOption>(filter.type); // default

  const dispatch = useAppDispatch();

  const onChangeProperty = (newProperty: string) => {
    setProperty(newProperty);
    saveFilterChanges({ property: newProperty });
  };

  const onChangeType = (newType: FilterOption) => {
    setType(newType);
    saveFilterChanges({ type: newType });
  };

  const onChangeValue = (newValue: string) => {
    setValue(newValue);
    saveFilterChanges({ value: newValue });
  };

  const onChangeInvert = (invert: Invert) => {
    setInvertState(invert);
    dispatch(setInvert({ id: filter.id, invert }));
  };

  const saveFilterChanges = (updatedFilter: Partial<PropertyFilterConfig>) => {
    const filter: PropertyFilterConfig = {
      id: props.filter.id,
      property,
      type,
      value,
      ...updatedFilter
    };
    dispatch(saveFilter({ id: filter.id, filter }));
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
              onChange={({ target }) => onChangeProperty(target.value)}
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
            minWidth: 100
          }}
        >
          <FormControl fullWidth>
            <Select
              value={invert}
              onChange={({ target }) =>
                onChangeInvert(target.value as 'is' | 'not')
              }
            >
              {['is', 'not'].map((inversion) => (
                <MenuItem key={inversion} value={inversion}>
                  {inversion.toLocaleUpperCase()}
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
            <InputLabel>Filter</InputLabel>
            <Select
              value={type}
              label="Filter"
              onChange={({ target }) =>
                onChangeType(target.value as FilterOption)
              }
            >
              {Object.values(filterOptions).map((filterOption) => (
                <MenuItem key={filterOption} value={filterOption}>
                  {filterOption.toLocaleUpperCase()}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <TextField
          placeholder={'Value'}
          value={value}
          onChange={({ target }) => onChangeValue(target.value)}
        />
      </Stack>
      <DeleteButton id={props.filter.id} />
    </Stack>
  );
};

const DeleteButton = (props: { id: Id }) => {
  const dispatch = useAppDispatch();

  const onClick = () => {
    dispatch(deleteNode({ id: props.id }));
  };

  return (
    <IconButton
      size="small"
      sx={{
        color: pinkColor,
        borderRadius: 1,
        border: '1.5px solid',
        p: 0.2
      }}
      onClick={onClick}
    >
      <RemoveIcon fontSize="small" />
    </IconButton>
  );
};

const Node = (props: { filter: FilterConfig; parentId: Id }) => {
  const { filter, parentId } = props;

  switch (filter.type) {
    case 'and':
      return <Decorator filter={filter} parentId={parentId} />;
    case 'or':
      return <Decorator filter={filter} parentId={parentId} />;
    case 'equals':
      return <Filter filter={filter} parentId={parentId} />;
    default:
      throw new Error('Unknown filter config');
  }
};

const RootNode = () => {
  const nodes = useAppSelector((state) => state.createView.nodes);
  const root = nodes.length > 0 ? nodes[0] : null;
  const isInitialized = useRef(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const createDefaultRoot = () => {
      const rootNode = createNode('and', -1);
      dispatch(addNode({ node: rootNode }));
      const filterNode = createNode('equals', rootNode.filter.id);
      dispatch(addNode({ node: filterNode }));
      isInitialized.current = true; // prevents strict mode causing 2 calls
    };

    if (!root && !isInitialized.current) {
      createDefaultRoot();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {root ? (
        <>
          <Node
            key={root.filter.id}
            filter={root.filter}
            parentId={root.parentId}
          />
        </>
      ) : (
        <>
          <AddButton parentId={-1} text="+ Filter" />
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
  const nodeCount = useAppSelector((state) => state.createView.nodes.length);
  const dispatch = useAppDispatch();

  const onClick = () => {
    dispatch(reset());
  };

  return (
    <>
      {nodeCount > 0 && (
        <Box>
          <Button
            variant="outlined"
            sx={{
              color: pinkColor,
              borderColor: pinkColor
            }}
            onClick={onClick}
          >
            Reset
          </Button>
        </Box>
      )}
    </>
  );
};

const SaveViewButton = () => {
  const name = useAppSelector((state) => state.createView.name);
  const module = useAppSelector((state) => state.createView.module);
  const nodes = useAppSelector((state) => state.createView.nodes);
  const dispatch = useAppDispatch();
  const [apiCreateView] = useCreateViewMutation();

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

  const isVisible = nodes.length > 0 && Boolean(name);

  return (
    <>
      {isVisible && (
        <Stack gap={2}>
          <Box>
            <Button
              variant="outlined"
              fullWidth={false}
              onClick={onClick}
              sx={{
                color: greenColor,
                outline: '1px solid',
                outlineColor: greenColor,
                borderRadius: 1,
                px: 2
              }}
            >
              Save Filter as View
            </Button>
          </Box>
        </Stack>
      )}
    </>
  );
};

const Name = () => {
  const nodeCount = useAppSelector((state) => state.createView.nodes.length);
  const name = useAppSelector((state) => state.createView.name);
  const dispatch = useAppDispatch();

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setName({ name: event.target.value }));
  };

  return (
    <>
      {nodeCount > 0 && (
        <Box>
          <TextField
            fullWidth={true}
            value={name}
            onChange={onChange}
            placeholder="Enter view name..."
          />
        </Box>
      )}
    </>
  );
};

const SaveAndResetButtons = () => {
  const nodeCount = useAppSelector((state) => state.createView.nodes.length);

  return (
    <>
      {nodeCount > 0 && (
        <Stack flexDirection="row" gap={2}>
          <SaveViewButton />
          <ResetButton />
        </Stack>
      )}
    </>
  );
};

export const BuildViewPage = (props: { module: ModuleOption }) => {
  const dispatch = useAppDispatch();

  useLayoutEffect(() => {
    dispatch(setModule({ module: props.module }));
  }, [dispatch, props.module]);

  return (
    <>
      <LoadPropertyOptions />
      <Stack
        sx={{
          mx: 2,
          mt: 2,
          borderRadius: 4,
          gap: 2
        }}
      >
        <Box bgcolor={undefined} p={0}>
          <Heading />
        </Box>
        <Stack gap={2} mb={2}>
          <Typography fontSize={18}>Create New View</Typography>
          <Stack
            sx={{
              border: '1px solid',
              borderColor: blueColor,
              borderRadius: 2,
              p: 2,
              gap: 2
            }}
          >
            <RootNode />
            <Name />
            <SaveAndResetButtons />
          </Stack>
        </Stack>
        <ViewsList />
      </Stack>
    </>
  );
};
