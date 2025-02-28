import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { closedModal } from '../../features/categorySlice';
import { FormEvent, useState } from 'react';
import { useAddCategoryMutation } from '../../features/apiSlice';

export const AddCategoryModal = () => {
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const isOpen = useAppSelector((state) => state.category.isOpen);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isAtleastSmall = useMediaQuery(theme.breakpoints.up('sm'));

  const [postNewCategory] = useAddCategoryMutation();

  const onClose = () => {
    dispatch(closedModal());
    setError(false);
    setErrorMessage('');
  };

  const validateInputs = () => {
    const categoryName = document.getElementById(
      'new-category-name'
    ) as HTMLInputElement;

    let isValid = true;

    if (!categoryName.value) {
      setError(true);
      setErrorMessage('Please enter a valid category name');
      isValid = false;
    } else {
      setError(false);
      setErrorMessage('');
    }

    return isValid;
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (error) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const input = formData.get('new-category-name') as string;

    if (!input) {
      return;
    }

    try {
      await postNewCategory({ category_name: input }).unwrap();
      onClose();
    } catch (error) {
      console.log('Error adding new category', error);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      scroll="paper"
      closeAfterTransition={true}
    >
      <Box component="form" onSubmit={onSubmit}>
        <DialogTitle>Add new category</DialogTitle>
        <DialogContent dividers={true}>
          <Stack
            sx={{
              gap: 2,
              pb: 1,
              minWidth: isAtleastSmall ? 400 : undefined
            }}
          >
            <TextField
              id="new-category-name"
              name="new-category-name"
              label="Enter category name"
              variant="standard"
              autoComplete="off"
              error={error}
              helperText={errorMessage}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" onClick={validateInputs}>
            Add
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
