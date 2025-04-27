import { ChangeEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setName } from './createViewSlice';
import { Box, TextField } from '@mui/material';

export const Name = () => {
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
