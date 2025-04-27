import { useState } from 'react';
import {
  FilterOption,
  filterOptions,
  PropertyFilterConfig
} from '../../../../shared/types';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { Id, Invert, saveFilter, setInvert } from './createViewSlice';
import { store } from '../../app/store';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField
} from '@mui/material';
import { DeleteButton } from './DeleteButton';
import { useStateKey } from './useStateKey';

export const Filter = (props: {
  filter: PropertyFilterConfig;
  parentId: Id;
}) => {
  const { filter } = props;
  const propertyOptions = useAppSelector(
    (state) => state.createView.propertyOptions
  );
  const stateKey = useStateKey();

  const [property, setProperty] = useState(filter.property);
  const [invert, setInvertState] = useState<Invert>(
    store
      .getState()
      .createView[stateKey].nodes.find((node) => node.filter.id === filter.id)
      ?.invert || 'is'
  );

  const [value, setValue] = useState(filter.value);
  const [type, setType] = useState<FilterOption>(filter.type);

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
    dispatch(setInvert({ id: filter.id, invert, stateKey }));
  };

  const saveFilterChanges = (updatedFilter: Partial<PropertyFilterConfig>) => {
    const filter: PropertyFilterConfig = {
      id: props.filter.id,
      property,
      type,
      value,
      ...updatedFilter
    };
    dispatch(saveFilter({ id: filter.id, filter, stateKey }));
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
