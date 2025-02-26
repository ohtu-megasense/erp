import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
  TextField,
  Typography
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

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (error) {
      return;
    }

    console.log('Submitting new category...');

    const formData = new FormData(event.currentTarget);
    const input = formData.get('new-category-name') as string;

    if (!input) {
      console.log('Cant submit empty category name.');
      return;
    }

    postNewCategory({ category_name: input });
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} scroll="paper">
      <Box component="form" onSubmit={onSubmit}>
        <DialogContent dividers={true}>
          <Stack sx={{ gap: 2 }}>
            <Typography variant="h5">Add new category</Typography>
            <TextField
              id="new-category-name"
              name="new-category-name"
              label="Enter category name"
              variant="standard"
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
