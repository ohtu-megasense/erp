import { ListItemButton, ListItemText } from '@mui/material';
import { useAppDispatch } from '../../app/hooks';
import { openedModal } from '../../features/categorySlice';

export const OpenAddCategoryModalButton = () => {
  const dispatch = useAppDispatch();

  const onClick = () => {
    dispatch(openedModal());
  };

  return (
    <ListItemButton onClick={onClick}>
      <ListItemText primary="Add Category" />
    </ListItemButton>
  );
};
