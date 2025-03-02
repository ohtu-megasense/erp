import { useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { updateItem } from '../../features/categoryDataSlice';

interface Item {
  id: number;
  data: Record<string, string>;
}

interface Category {
  id: number;
  name: string;
  itemShape: Record<string, string>;
  items: Item[];
}

export const CategoryItemsManager = () => {
  const categories = useAppSelector(
    (state) => state.categoryData.categoriesData
  );

  return (
    <Box>
      {categories.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No categories available
        </Typography>
      ) : (
        <Stack spacing={2}>
          {categories.map((category) => (
            <CategoryItemEditor key={category.id} category={category} />
          ))}
        </Stack>
      )}
    </Box>
  );
};

const CategoryItemEditor = ({ category }: { category: Category }) => {
  const [editItems, setEditItems] = useState<Record<number, boolean>>({});
  const [formValues, setFormValues] = useState<
    Record<number, Record<string, string>>
  >({});
  const dispatch = useAppDispatch();

  const toggleEdit = (itemId: number) => {
    const isEditing = editItems[itemId];
    if (!isEditing) {
      const item = category.items.find((i) => i.id === itemId);
      if (item) {
        setFormValues((prev) => ({
          ...prev,
          [itemId]: { ...item.data }
        }));
      }
    }
    setEditItems((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const handleInputChange = (itemId: number, key: string, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [key]: value
      }
    }));
  };

  const handleUpdate = (itemId: number) => {
    const updatedItem = formValues[itemId];
    if (updatedItem) {
      dispatch(
        updateItem({
          categoryId: category.id,
          itemId,
          updatedItem
        })
      );
      setEditItems((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  const handleCancel = (itemId: number) => {
    setEditItems((prev) => ({ ...prev, [itemId]: false }));
    setFormValues((prev) => {
      const newValues = { ...prev };
      delete newValues[itemId];
      return newValues;
    });
  };

  const isShapeDefined = Object.keys(category.itemShape).length > 0;

  if (!isShapeDefined) {
    return (
      <Box>
        <Typography variant="subtitle1" gutterBottom>
          {category.name}
        </Typography>
        <Typography variant="body2">No shape defined</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        {category.name}
      </Typography>
      {category.items.map((item) => (
        <Box key={item.id} sx={{ mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              onClick={() => toggleEdit(item.id)}
              size="small"
              sx={{ mr: 1 }}
            >
              <EditIcon />
            </IconButton>
            <Typography variant="body2">Item ID: {item.id}</Typography>
          </Box>
          {editItems[item.id] && (
            <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <Stack spacing={2}>
                {Object.keys(category.itemShape).map((key) => (
                  <TextField
                    key={key}
                    label={key}
                    value={formValues[item.id]?.[key] || ''}
                    onChange={(e) =>
                      handleInputChange(item.id, key, e.target.value)
                    }
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                ))}
                <Box
                  sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}
                >
                  <Button
                    onClick={() => handleCancel(item.id)}
                    variant="outlined"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleUpdate(item.id)}
                    variant="contained"
                  >
                    Save
                  </Button>
                </Box>
              </Stack>
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default CategoryItemsManager;
