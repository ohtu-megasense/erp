import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack
} from '@mui/material';
import {
  AndFilterConfig,
  DecoratorOption,
  decoratorOptions,
  OrFilterConfig
} from '../../../../shared/types';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { Id, setDecoratorType } from './createViewSlice';
import { AddButton } from './AddButton';
import { DeleteButton } from './DeleteButton';
import { Node } from './Node';

export const Decorator = (props: {
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
