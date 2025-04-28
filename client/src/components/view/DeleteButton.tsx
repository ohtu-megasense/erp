import { IconButton } from '@mui/material';
import { useAppDispatch } from '../../app/hooks';
import { deleteNode, Id } from '../../features/createViewSlice';
import { pinkColor } from './colors';
import RemoveIcon from '@mui/icons-material/Remove';
import { useStateKey } from './useStateKey';

export const DeleteButton = (props: { id: Id }) => {
  const stateKey = useStateKey();
  const dispatch = useAppDispatch();

  const onClick = () => {
    dispatch(deleteNode({ id: props.id, stateKey }));
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
