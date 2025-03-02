import { FormEvent, useState } from 'react';
import {
  Box,
  Button,
  Collapse,
  IconButton,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';
import { useAppDispatch } from '../../app/hooks';
import { addedItem, Category } from '../../features/categoryDataSlice';

interface AddCategoryItemFormProps {
  category: Category;
}

export const AddCategoryItemForm = ({ category }: AddCategoryItemFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const dispatch = useAppDispatch();

  const shapeKeys = Object.keys(category.itemShape);

  const handleInputChange = (key: string, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const newItem = shapeKeys.reduce(
      (acc, key) => ({
        ...acc,
        [key]: formValues[key] || ''
      }),
      {} as Record<string, string>
    );

    dispatch(
      addedItem({
        categoryId: category.id,
        item: newItem
      })
    );

    setFormValues({});
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <IconButton
          onClick={() => setIsOpen(!isOpen)}
          size="small"
          sx={{ mr: 1 }}
        >
          {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
        <Typography variant="subtitle1">Add Item to {category.name}</Typography>
      </Box>

      <Collapse in={isOpen}>
        {shapeKeys.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No shape defined for this category yet
          </Typography>
        ) : (
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ p: 2, borderRadius: 1, bgcolor: '#f7f7f7ff' }}
          >
            <Stack spacing={2}>
              {shapeKeys.map((key) => (
                <TextField
                  key={key}
                  label={key}
                  value={formValues[key] || ''}
                  onChange={(e) => handleInputChange(key, e.target.value)}
                  variant="outlined"
                  size="small"
                  fullWidth
                />
              ))}
              <Button type="submit" variant="outlined" color="primary">
                Add {category.name} Item
              </Button>
            </Stack>
          </Box>
        )}
      </Collapse>
    </Box>
  );
};
