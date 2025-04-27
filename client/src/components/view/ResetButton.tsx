import { Box, Button } from '@mui/material';
import { useAppDispatch } from '../../app/hooks';
import { createDefaultRoot } from './createViewSlice';
import { pinkColor } from './colors';

export const ResetButton = ({ isSmall = false }: { isSmall?: boolean }) => {
  const dispatch = useAppDispatch();

  const onClick = () => {
    dispatch(createDefaultRoot());
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
