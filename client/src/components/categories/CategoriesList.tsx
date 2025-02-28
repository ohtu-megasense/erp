import {
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  Button,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  Stack,
  useMediaQuery
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { FormEvent, useRef, useState } from 'react';

interface Category {
  category_name: string;
  items: CategoryItem[];
}

interface CategoryItem {
  item_name: string;
}

const mockCategories: Category[] = [
  {
    category_name: 'Harware Sensors',
    items: [{ item_name: 'Online Status' }, { item_name: 'Location' }]
  },
  {
    category_name: 'Public Cloud Services',
    items: [{ item_name: 'Amazon Web Services' }, { item_name: 'Google Cloud' }]
  },
  {
    category_name: 'Software Licenses',
    items: [
      { item_name: 'CAD Software' },
      { item_name: 'Project Management Tool' }
    ]
  },
  {
    category_name: 'Storage Media',
    items: [
      { item_name: 'USB Drives' },
      { item_name: 'External Hard Drives' },
      { item_name: 'SD Cards' }
    ]
  }
];

export const CategoriesList = () => {
  return (
    <List disablePadding>
      {mockCategories.map((category, index) => (
        <CategoriesListItem category={category} index={index} key={index} />
      ))}
    </List>
  );
};

interface CategoriesListItemProps {
  index: number;
  category: Category;
}

export const CategoriesListItem = ({
  index,
  category
}: CategoriesListItemProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedName, setEditedName] = useState('');
  const theme = useTheme();
  const isAtleastSmall = useMediaQuery(theme.breakpoints.up('sm'));
  const listItemRef = useRef<HTMLLIElement>(null);

  const handleOpenModal = () => setIsModalOpen(true);

  const handleCloseModal = () => {
    setIsHovered(false);
    setIsFocused(false);
    setIsModalOpen(false);
  };

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleCloseModal();
    setEditedName('');
  };

  // NOTE: If mouse is on some item it prevents
  // focusing other list items. Accessibility
  // is ok if mouse is not on an element while
  // also using keyboard navigation.
  const isEditButtonVisible = isHovered || isFocused;

  return (
    <Box
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <ListItem
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={(e) => {
          if (!isFocused) {
            return;
          }

          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleOpenModal();
          }
        }}
        ref={listItemRef}
        tabIndex={1}
        aria-label={`Edit ${category.category_name}`}
        sx={{ justifyContent: 'space-between', px: 2 }}
      >
        <ListItemText primary={category.category_name} />
        <Button
          aria-label={`Edit category ${category.category_name} button`}
          variant="outlined"
          size="small"
          startIcon={<EditIcon />}
          sx={{ ml: 2, display: isEditButtonVisible ? 'flex' : 'none' }}
          onClick={handleOpenModal}
        >
          Edit
        </Button>
      </ListItem>
      <List disablePadding dense>
        {category.items.map((item, itemIndex) => (
          <ListItem key={itemIndex} sx={{ pl: 4 }}>
            <ListItemText
              primary={item.item_name}
              slotProps={{
                primary: {
                  variant: 'body2'
                }
              }}
            />
          </ListItem>
        ))}
      </List>
      {index < mockCategories.length - 1 && <Divider />}

      <Dialog
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="edit-category-modal"
        scroll="paper"
        closeAfterTransition={true}
      >
        <DialogTitle>Edit Category</DialogTitle>
        <Box component="form" onSubmit={handleSave}>
          <DialogContent dividers>
            <Stack
              sx={{
                gap: 2,
                py: 1,
                minWidth: isAtleastSmall ? 400 : undefined
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Previous Name: {category.category_name}
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter new category name"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                variant="standard"
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal}>Cancel</Button>
            <Button type="submit">Save</Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};
