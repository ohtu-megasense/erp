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
  moduleOptions
} from '../../../../shared/types';
import { useEffect, useState } from 'react';
import { useGetCategoriesQuery } from '../../features/apiSlice';
import {
  addNode,
  createNode,
  Id,
  reset,
  setModule,
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

const And = (props: { filter: AndFilterConfig; parentId: Id }) => {
  const { filter } = props;

  const nodes = useAppSelector((state) => state.createView.nodes);
  const children = nodes.filter((node) => node.parentId === filter.id);

  return (
    <Box>
      <Stack sx={{}}>
        <Typography>AND</Typography>
        <AddNode parentId={filter.id} text="+ Filter" />
      </Stack>
      <Stack px={2}>
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

const CreateFilter = (props: { parentId: Id }) => {
  const propertyOptions = useAppSelector(
    (state) => state.createView.propertyOptions
  );

  const [property, setProperty] = useState('');
  const [value, setValue] = useState('');
  const [type, setType] = useState('equals'); // default

  // on save -> send to redux and use
  // addFilter (not addNode) (not implemented)

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
      </Stack>
    </Stack>
  );
};

const Node = (props: { filter: FilterConfig; parentId: Id }) => {
  const { filter, parentId } = props;

  switch (filter.type) {
    case 'and':
      return <And filter={filter} parentId={parentId} />;
    case 'equals':
      return <CreateFilter parentId={parentId} />;
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
          <AddNode parentId={-1} text="Create Filter" />
        </>
      )}
    </>
  );
};

const AddNode = (props: { parentId: Id; text?: string }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const dispatch = useAppDispatch();
  const options = [
    ...Object.values(filterOptions),
    ...Object.values(decoratorOptions)
  ];

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
      <Button onClick={onClickOpen}>{props.text || 'Create Filter'}</Button>
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
          <ResetButton />
        </Box>
      </Stack>
    </>
  );
};
