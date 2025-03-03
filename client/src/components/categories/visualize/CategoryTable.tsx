import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { Category } from '../../../features/categoryDataSlice';

interface CategoryTableProps {
  category: Category;
}

export const CategoryTable = ({ category }: CategoryTableProps) => {
  const isShapeDefined = Object.keys(category.itemShape).length > 0;

  if (!isShapeDefined) {
    return (
      <Box>
        <Typography mb={2}>{category.name}</Typography>
        <Paper sx={{ p: 2 }}>
          <Typography variant="caption">No shape defined</Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box>
      <Typography mb={2}>{category.name}</Typography>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              {Object.keys(category.itemShape).map((key, index) => (
                <TableCell key={index}>{key}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {category.items.map((item, index) => {
              return (
                <TableRow key={index}>
                  {Object.values(item.data).map((value, index) => (
                    <TableCell key={index}>{value}</TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};
