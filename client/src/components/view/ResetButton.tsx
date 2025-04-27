import { Box, Button } from '@mui/material';
import { useAppDispatch } from '../../app/hooks';
import { createDefaultRoot } from './createViewSlice';
import { pinkColor } from './colors';
import { useStateKey } from './useStateKey';

export const ResetButton = ({ isSmall = false }: { isSmall?: boolean }) => {
  const stateKey = useStateKey();
  const dispatch = useAppDispatch();

  const onClick = () => {
    dispatch(createDefaultRoot({ stateKey }));
  };

  return (
    <>
      <Box>
        <Button
          variant="outlined"
          size={isSmall ? 'small' : 'medium'}
          sx={{
            color: pinkColor,
            borderColor: pinkColor
          }}
          onClick={onClick}
        >
          Reset to Default
        </Button>
      </Box>
    </>
  );
};
