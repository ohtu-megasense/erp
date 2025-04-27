import { useState } from 'react';
import { addNode, createNode, Id } from './createViewSlice';
import { useAppDispatch } from '../../app/hooks';
import {
  DecoratorOption,
  decoratorOptions,
  FilterOption,
  filterOptions
} from '../../../../shared/types';
import { store } from '../../app/store';
import { Box, Button, Menu, MenuItem } from '@mui/material';
import { useStateKey } from './useStateKey';

export const AddButton = (props: { parentId: Id; text?: string }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const dispatch = useAppDispatch();
  const stateKey = useStateKey();
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
    const isRoot = store.getState().createView[stateKey].nodes.length === 0;
    const parentId = isRoot ? -1 : props.parentId;
    const node = createNode(type, parentId);

    dispatch(
      addNode({
        node,
        stateKey
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
