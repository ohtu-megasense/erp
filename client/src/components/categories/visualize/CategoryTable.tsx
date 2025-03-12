import {
  Box,
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
        <Table size="small">
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
                  <IconButton
                    onClick={() => deleteItemMutation(item.id)}
                    size="small"
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
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
