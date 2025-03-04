import { useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import { useAppDispatch } from '../../../app/hooks';
import { addedCategory } from '../../../features/categoryDataSlice';

export const AddCategoryForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({
    name: ''
  });
  const [propertyCount, setPropertyCount] = useState(0);

  const dispatch = useAppDispatch();

  const handleInputChange = (key: string, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [key]: value
    }));
    if (key === 'name' && value.trim()) {
      setError(null);
    }
  };

  const validateInputs = () => {
    if (!formValues.name.trim()) {
      setError('Please enter a valid category name');
      return false;
    }
    return true;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateInputs()) {
      return;
    }

    const propertyNames = Array.from(
      { length: propertyCount },
      (_, i) => formValues[`property-${i}`] || ''
    ).filter((name) => name.trim() !== '');

    const itemShape: Record<string, string> = propertyNames.reduce(
      (acc, propertyName) => {
        acc[propertyName] = ''; // No default value needed atm
        return acc;
      },
      {} as Record<string, string>
    );

    try {
      dispatch(
        addedCategory({
          category: {
            name: formValues.name,
            itemShape
          }
        })
      );

      setFormValues({ name: '' });
      setPropertyCount(0);
      setError(null);
    } catch (error) {
      console.log('Error adding new category', error);
    }
  };

  const onClickAddProperty = () => {
    setPropertyCount((prev) => prev + 1);
  };

  const onClickRemoveProperty = (index: number) => {
    setPropertyCount((prev) => prev - 1);
    setFormValues((prev) => {
      const newValues = { ...prev };
      delete newValues[`property-${index}`];
      // Shift subsequent properties up
      for (let i = index + 1; i < propertyCount; i++) {
        if (newValues[`property-${i}`]) {
          newValues[`property-${i - 1}`] = newValues[`property-${i}`];
          delete newValues[`property-${i}`];
        }
      }
      return newValues;
    });
  };

  return (
    <Box component="form" onSubmit={onSubmit}>
      <Stack spacing={2}>
        <TextField
          label="Category name"
          value={formValues.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          error={!!error}
          helperText={error || ''}
          variant="outlined"
          size="small"
          fullWidth
        />
        <Stack gap={2}>
          <Stack>
            <Typography variant="subtitle2">Define Item Shape</Typography>
            <Typography variant="caption" color="text.secondary">
              Example: "Hardware Sensor" could have "Location" and "Online
              Status"
            </Typography>
          </Stack>
          <Button
            onClick={onClickAddProperty}
            variant="outlined"
            size="small"
            startIcon={<AddIcon />}
            sx={{ alignSelf: 'flex-start' }}
          >
            Add Property
          </Button>
          {Array.from({ length: propertyCount }, (_, i) => (
            <Stack key={i} direction="row" spacing={1} alignItems="center">
              <TextField
                label={`Property ${i + 1} name`}
                value={formValues[`property-${i}`] || ''}
                onChange={(e) =>
                  handleInputChange(`property-${i}`, e.target.value)
                }
                variant="outlined"
                size="small"
                fullWidth
              />
              <IconButton
                onClick={() => onClickRemoveProperty(i)}
                size="small"
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Stack>
          ))}
        </Stack>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            onClick={() => {
              setFormValues({ name: '' });
              setPropertyCount(0);
              setError(null);
            }}
          >
            Clear All
          </Button>
          <Button type="submit" variant="contained">
            Create
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};
