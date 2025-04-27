import { Box, Button } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { reset } from './createViewSlice';
import { pinkColor } from './colors';

export const ResetButton = () => {
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
