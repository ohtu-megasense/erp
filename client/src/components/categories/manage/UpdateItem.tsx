import { useState } from 'react';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Pagination
} from '@mui/material';
import { Category, updateItem } from '../../../features/categoryDataSlice';
import { useAppDispatch } from '../../../app/hooks';

interface UpdateItemProps {
  category: Category;
}

export const UpdateItem = ({ category }: UpdateItemProps) => {
  const [formValues, setFormValues] = useState<
    Record<number, Record<string, string>>
  >(
    category.items.reduce(
      (acc, item) => {
        acc[item.id] = { ...item.data };
        return acc;
      },
      {} as Record<number, Record<string, string>>
    )
  );
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const dispatch = useAppDispatch();

  const handleInputChange = (itemId: number, key: string, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [key]: value
      }
    }));
  };

  const handleSave = () => {
    Object.entries(formValues).forEach(([itemId, updatedItem]) => {
      dispatch(
        updateItem({
          categoryId: category.id,
          itemId: Number(itemId),
          updatedItem
        })
      );
    });
  };

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = category.items.slice(startIndex, endIndex);

  const totalPages = Math.ceil(category.items.length / itemsPerPage);

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
    setPage(newPage);
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

  if (category.items.length === 0) {
    return (
      <Box>
        <Typography variant="subtitle1" gutterBottom>
          {category.name}
        </Typography>
        <Typography variant="body2">No items added</Typography>
      </Box>
    );
  }

  const headers = ['ID', ...Object.keys(category.itemShape)];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          {category.name}
        </Typography>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </Box>
      <Table size="small">
        <TableHead>
          <TableRow>
            {headers.map((header) => (
              <TableCell key={header}>
                <Typography variant="subtitle2">{header}</Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              {Object.keys(category.itemShape).map((key) => (
                <TableCell key={key}>
                  <TextField
                    value={formValues[item.id]?.[key] || ''}
                    onChange={(e) =>
                      handleInputChange(item.id, key, e.target.value)
                    }
                    variant="outlined"
                    size="small"
                    fullWidth
                    sx={{
                      '& .MuiInputBase-root': {
                        height: '32px'
                      }
                    }}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};
