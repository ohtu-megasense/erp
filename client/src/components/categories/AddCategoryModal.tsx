import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { closedModal } from '../../features/categorySlice';
import { FormEvent, useState } from 'react';
import { addedCategory } from '../../features/categoryDataSlice';

export const AddCategoryModal = () => {
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const isOpen = useAppSelector((state) => state.category.isOpen);
  const [propertyCount, setPropertyCount] = useState(0);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isAtleastSmall = useMediaQuery(theme.breakpoints.up('sm'));

  const onClose = () => {
    dispatch(closedModal());
    setError(false);
    setErrorMessage('');
    setPropertyCount(0);
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
    const categoryName = formData.get('new-category-name') as string;

    const propertyNames = Array.from({ length: propertyCount }, (_, i) => {
      const propertyName = formData.get(
        `category-item-property-${i}`
      ) as string;
      return propertyName;
    }).filter((name) => name.trim() !== '');

    const itemShape: Record<string, string> = propertyNames.reduce(
      (acc, propertyName) => {
        acc[propertyName] = 'string'; // default type to string
        return acc;
      },
      {} as Record<string, string>
    );

    if (!categoryName) {
      return;
    }

    try {
      // Post request here when api is ready.
      dispatch(
        addedCategory({
          category: {
            name: categoryName,
            itemShape
          }
        })
      );
      onClose();
    } catch (error) {
      console.log('Error adding new category', error);
    }
  };

  const onClickAddProperty = () => {
    setPropertyCount((previousValue) => previousValue + 1);
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
              error={error}
              helperText={errorMessage}
            />
            <Stack>
              <Typography>Shape of an item in the category</Typography>
              <Typography variant="caption">
                For example a "Hardware Sensor" category item could have
                properties "Location" and "Online Status"
              </Typography>
              <Box
                sx={{
                  mt: 1
                }}
              >
                <Button onClick={onClickAddProperty}>+ Property</Button>
              </Box>
            </Stack>
            {Array.from({ length: propertyCount }, (_, i) => {
              return (
                <TextField
                  id={`category-item-property-${i}`}
                  name={`category-item-property-${i}`}
                  key={i}
                  label={`Enter property ${i + 1} name`}
                />
              );
            })}
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
