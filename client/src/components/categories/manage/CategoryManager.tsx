import { useState, useRef } from 'react';
import { Box, Paper, Typography, IconButton, Stack } from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { useUpdateItemMutation } from '../../../features/apiSlice';
import { AddCategoryItemForm } from './AddCategoryItemForm';
import { CategoryTable } from '../visualize/CategoryTable';
import { Category } from '../../../../../shared/types';
import { UpdateConfirmationDialog } from './UpdateConfirmationDialog';

interface CategoryManagerProps {
  category: Category;
  refetchCategories: () => void;
}

export const CategoryManager = ({
  category,
  refetchCategories
}: CategoryManagerProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogueText, setDialogueText] = useState('');

  const tableRef = useRef<{
    getFormValues: () => Record<number, Record<string, string>>;
  }>(null);
  // const dispatch = useAppDispatch();
  const [updateItem] = useUpdateItemMutation();

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  const handleAddToggle = () => {
    setIsAdding((prev) => !prev);
  };

  const handleSave = () => {
    if (tableRef.current) {
      const dirtyFormValues = tableRef.current.getFormValues();

      const updatePromises = Object.entries(dirtyFormValues).map(
        ([itemId, updatedItem]) => {
          return updateItem({
            categoryId: category.id,
            itemId: Number(itemId),
            updatedItem
          }).unwrap();
        }
      );

      Promise.all(updatePromises).catch((error) => {
        console.error('Error updating items:', error);
      });
    }
    setIsEditing(false);
  };

  const handleClickSaveIcon = () => {
    if (tableRef.current == null) {
      setIsEditing(false);
      return;
    }

    // if there are no 'dirty items' ie. no changes
    // no need to open confirmation dialog.

    const dirtyFormValues = tableRef.current.getFormValues();
    const updateCount = Object.keys(dirtyFormValues).length;
    const isOpenNecessary = updateCount > 0;

    if (isOpenNecessary === false) {
      setIsEditing(false);
      return;
    }

    const itemText = updateCount === 1 ? 'item' : 'items';

    setDialogueText(`Do you want to update ${updateCount} ${itemText}?`);
    setIsDialogOpen(true);
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setIsEditing(false);
  };

  return (
    <>
      <UpdateConfirmationDialog
        text={dialogueText}
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        onCancel={handleCancel}
        onSave={handleSave}
      />
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
                  onClick={handleClickSaveIcon}
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
    </>
  );
};
