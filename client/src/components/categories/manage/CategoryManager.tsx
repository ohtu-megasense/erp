import { useState, useRef } from 'react';
import { Box, Paper, Typography, IconButton, Stack } from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { updateItem } from '../../../features/categoryDataSlice';
import { useAppDispatch } from '../../../app/hooks';
import { AddCategoryItemForm } from './AddCategoryItemForm';
import { CategoryTable } from '../visualize/CategoryTable';
import { Category } from '../../../../../shared/types';

interface CategoryManagerProps {
  category: Category;
  // ATTEMPT TO RENDER NEW COLUMN NAME STARTS
  refetchCategories: () => void;
  // ATTEMPT TO RENDER NEW COLUMN NAME ENDS
}
// ATTEMPT TO RENDER NEW COLUMN NAME STARTS
export const CategoryManager = ({ category, refetchCategories }: CategoryManagerProps) => {
// ATTEMPT TO RENDER NEW COLUMN NAME ENDS
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const tableRef = useRef<{
    getFormValues: () => Record<number, Record<string, string>>;
  }>(null);
  const dispatch = useAppDispatch();

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  const handleAddToggle = () => {
    setIsAdding((prev) => !prev);
  };

  const handleSave = () => {
    if (tableRef.current) {
      const dirtyFormValues = tableRef.current.getFormValues();
      Object.entries(dirtyFormValues).forEach(([itemId, updatedItem]) => {
        dispatch(
          updateItem({
            categoryId: category.id,
            itemId: Number(itemId),
            updatedItem
          })
        );
      });
    }
    setIsEditing(false);
  };

  return (
    <Box>
      <Stack
        sx={{
          gap: 2
        }}
      >
        <Typography>{category.name}</Typography>
        <Box sx={{ display: 'flex' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {isEditing ? (
              <IconButton
                color="primary"
                size="small"
                onClick={handleSave}
                aria-label="Save changes"
              >
                <SaveIcon fontSize="small" />
              </IconButton>
            ) : (
              <IconButton
                color="primary"
                size="small"
                onClick={handleEditToggle}
                aria-label="Edit category"
              >
                <EditIcon fontSize="small" />
              </IconButton>
            )}
            <IconButton
              color="primary"
              size="small"
              onClick={handleAddToggle}
              aria-label={isAdding ? 'Hide add form' : 'Show add form'}
              data-testid="add-item-button"
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        {isAdding && (
          <Paper sx={{ p: 2 }}>
            <AddCategoryItemForm category={category} />
          </Paper>
        )}
        <Paper sx={{ p: 2 }}>
          <CategoryTable
            category={category}
            isEditing={isEditing}
            ref={tableRef}
            // ATTEMPT TO RENDER NEW COLUMN NAME STARTS
            refetchCategories={refetchCategories}
            // ATTEMPT TO RENDER NEW COLUMN NAME ENDS
          />
        </Paper>
      </Stack>
    </Box>
  );
};
