import { useState, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Stack,
  TextField
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Add as AddIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useUpdateItemMutation } from '../../../features/apiSlice';
import {
  useRenameCategoryMutation,
  useDeleteCategoryMutation
} from '../../../features/apiSlice';
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
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogueText, setDialogueText] = useState('');

  const [title, setTitle] = useState('');
  const [RenameCategoryMutation] = useRenameCategoryMutation();
  const [DeleteCategoryMutation] = useDeleteCategoryMutation();

  const tableRef = useRef<{
    getFormValues: () => Record<number, Record<string, string | number>>;
  }>(null);
  // const dispatch = useAppDispatch();
  const [updateItem] = useUpdateItemMutation();

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  const handleAddToggle = () => {
    setIsAdding((prev) => !prev);
  };

  const handleClickDeleteIcon = () => {
    setIsDeleting(true);
    setDialogueText(`Do you want to delete category ${category.name}`);
    setIsDialogOpen(true);
  };

  const handleDelete = () => {
    DeleteCategoryMutation({ categoryId: category.id });
  };

  const handleSave = () => {
    if (title !== '') {
      console.log(title);
      RenameCategoryMutation({
        categoryId: category.id,
        itemShape: category.itemShape,
        categoryName: title
      });
    }
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

      try {
        Promise.all(updatePromises);
      } catch (error) {
        console.error('Error updating items:', error);
      }
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
    const titleChanged = title !== category.name;

    if (isOpenNecessary === false && !titleChanged) {
      setIsEditing(false);
      return;
    }

    const itemText = updateCount === 1 ? 'item' : 'items';

    let displayText: string = `Do you want to`;

    if (titleChanged) {
      displayText += ` update the title to ${title}`;
    }
    if (updateCount > 0 && titleChanged) {
      displayText += ` and ${updateCount} ${itemText}`;
    }
    if (updateCount > 0 && !titleChanged) {
      displayText += ` change ${updateCount} ${itemText}`;
    }

    displayText += `?`;
    setDialogueText(displayText);
    setIsDialogOpen(true);
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setIsEditing(false);
    setIsDeleting(false);
  };

  return (
    <>
      <UpdateConfirmationDialog
        text={dialogueText}
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        onCancel={handleCancel}
        onSave={isDeleting ? handleDelete : handleSave}
      />
      <Box>
        <Stack
          sx={{
            gap: 2
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {!isEditing && <Typography noWrap>{category.name}</Typography>}
            {isEditing && (
              <>
                <TextField
                  sx={{ fontSize: '0.8125rem' }}
                  defaultValue={category.name || ''}
                  id="categoryName"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setTitle(e.target.value);
                  }}
                ></TextField>
                <IconButton
                  size="medium"
                  color="error"
                  onClick={handleClickDeleteIcon}
                >
                  <DeleteIcon fontSize="medium"></DeleteIcon>
                </IconButton>
              </>
            )}
          </div>
          <Box sx={{ display: 'flex' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {isEditing ? (
                <IconButton
                  color="primary"
                  size="small"
                  onClick={handleClickSaveIcon}
                  aria-label="Save changes"
                  data-testid="save-category-button"
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
                  <EditIcon
                    fontSize="small"
                    data-testid="edit-category-button"
                  />
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
