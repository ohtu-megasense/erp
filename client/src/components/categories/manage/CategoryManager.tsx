import { useState, useRef } from 'react';
import { Box, Paper, Typography, IconButton, Stack, TextField } from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Add as AddIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { updateItem } from '../../../features/categoryDataSlice';
import { useRenameCategoryMutation } from '../../../features/apiSlice';
import { useAppDispatch } from '../../../app/hooks';
import { AddCategoryItemForm } from './AddCategoryItemForm';
import { CategoryTable } from '../visualize/CategoryTable';
import { Category } from '../../../../../shared/types';

interface CategoryManagerProps {
  category: Category;
  refetchCategories: () => void;
}

export const CategoryManager = ({ category, refetchCategories }: CategoryManagerProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [RenameCategoryMutation] = useRenameCategoryMutation();

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
    if (title !== '') {
      console.log(title)
      RenameCategoryMutation({categoryId: category.id, itemShape: category.itemShape, categoryName: title})
    }
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
        <div style={{display: 'flex', alignItems: 'center'}}>
          {!isEditing && <Typography noWrap>{category.name}</Typography>}
          {isEditing && <TextField nowrap sx={{ fontSize: '0.8125rem' }} defaultValue={category.name || ''} id="categoryName" onChange={(e: React.ChangeEvent<HTMLInputElement>) => {setTitle(e.target.value)}}></TextField>}
        </div>
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
            refetchCategories={refetchCategories}
          />
        </Paper>
      </Stack>
    </Box>
  );
};
