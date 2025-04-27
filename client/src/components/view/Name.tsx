import { ChangeEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setName } from './createViewSlice';
import { Box, TextField } from '@mui/material';
import { useStateKey } from './useStateKey';

export const Name = () => {
  const stateKey = useStateKey();
  const nodeCount = useAppSelector(
    (state) => state.createView[stateKey].nodes.length
  );
  const name = useAppSelector((state) => state.createView[stateKey].name);
  const dispatch = useAppDispatch();

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setName({ name: event.target.value, stateKey }));
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
