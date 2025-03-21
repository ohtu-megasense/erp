import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Pagination,
  TextField
} from '@mui/material';
import { Category } from '../../../features/categoryDataSlice';
import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useDeleteItemMutation } from '../../../features/apiSlice';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface CategoryTableProps {
  category: Category;
  isEditing: boolean;
}

export const CategoryTable = forwardRef(
  ({ category, isEditing }: CategoryTableProps, ref) => {
    const [page, setPage] = useState(1);
    const [formValues, setFormValues] = useState<
      Record<number, Record<string, string>>
    >({});
    const [dirtyItems, setDirtyItems] = useState<Set<number>>(new Set());
    const itemsPerPage = 10;

    const isShapeDefined = Object.keys(category.itemShape).length > 0;

    const [deleteItemMutation] = useDeleteItemMutation();

    const [openDialogs, setOpenDialogs] = useState<Record<number, boolean>>({});

    useEffect(() => {
      if (isEditing) {
        const initialValues = category.items.reduce(
          (acc, item) => {
            acc[item.id] = { ...item.data };
            return acc;
          },
          {} as Record<number, Record<string, string>>
        );
        setFormValues(initialValues);
        setDirtyItems(new Set());
      } else {
        setFormValues({});
        setDirtyItems(new Set());
      }
    }, [isEditing, category.items]);

    const handleInputChange = (itemId: number, key: string, value: string) => {
      setFormValues((prev) => ({
        ...prev,
        [itemId]: {
          ...prev[itemId],
          [key]: value
        }
      }));
      setDirtyItems((prev) => new Set(prev).add(itemId));
    };

    const handleOpenDialog = (id: number) => {
      setOpenDialogs((prev) => ({
        ...prev,
        [id]: true
      }));
    };

    const handleCloseDialog = (id: number) => {
      setOpenDialogs((prev) => ({
        ...prev,
        [id]: false
      }));
    };

    useImperativeHandle(ref, () => ({
      getFormValues: () => {
        const dirtyFormValues: Record<number, Record<string, string>> = {};
        dirtyItems.forEach((itemId) => {
          if (formValues[itemId]) {
            dirtyFormValues[itemId] = formValues[itemId];
          }
        });
        return dirtyFormValues;
      }
    }));

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = category.items.slice(startIndex, endIndex);
    const totalPages = Math.ceil(category.items.length / itemsPerPage);
    const inputFieldMinWidth = 80;

    const handlePageChange = (
      _event: React.ChangeEvent<unknown>,
      newPage: number
    ) => {
      setPage(newPage);
    };

    if (!isShapeDefined) {
      return (
        <Box>
          <Typography variant="caption">No shape defined</Typography>
        </Box>
      );
    }

    if (category.items.length === 0) {
      return (
        <Box>
          <Typography variant="caption">No items added</Typography>
        </Box>
      );
    }

    return (
      <Box
        sx={{
          overflowX: 'auto'
        }}
      >
        <Table size="small" data-testid="category-table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontSize: '0.8125rem' }}>ID</TableCell>
              {Object.keys(category.itemShape).map((key) => (
                <TableCell key={key} sx={{ fontSize: '0.8125rem' }}>
                  {key}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell sx={{ fontSize: '0.8125rem' }}>{item.id}</TableCell>
                {Object.keys(category.itemShape).map((key) => (
                  <TableCell
                    key={key}
                    sx={{
                      fontSize: '0.8125rem'
                    }}
                  >
                    {isEditing ? (
                      <TextField
                        value={formValues[item.id]?.[key] || ''}
                        onChange={(e) =>
                          handleInputChange(item.id, key, e.target.value)
                        }
                        variant="outlined"
                        size="small"
                        fullWidth={true}
                        sx={{
                          minWidth: inputFieldMinWidth,
                          '& .MuiInputBase-root': {
                            height: '24px',
                            fontSize: '0.8125rem' // Match TableCell font size
                          },
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderWidth: '1px' // Keep border thin for density
                          }
                        }}
                      />
                    ) : (
                      item.data[key] || ''
                    )}
                  </TableCell>
                ))}

                {isEditing && (
                  <TableCell sx={{ fontSize: '0.0125rem' }}>
                    <IconButton
                      onClick={() => handleOpenDialog(item.id)}
                      size="small"
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                    <Dialog
                      open={openDialogs[item.id] || false}
                      onClose={() => handleCloseDialog(item.id)}
                    >
                      <DialogTitle id="alert-dialog-title">
                        {'Do you want to delete this item?'}
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText id="alert-dialog-text">
                          If you delete this item, it can't be undone
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button
                          onClick={() =>
                            deleteItemMutation(item.id)
                              .unwrap()
                              .then(() => handleCloseDialog(item.id))
                          }
                        >
                          Yes
                        </Button>
                        <Button onClick={() => handleCloseDialog(item.id)}>
                          No
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {totalPages > 1 && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              py: 1
            }}
          >
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size="small"
            />
          </Box>
        )}
      </Box>
    );
  }
);
