import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { useGetCategoriesQuery } from '../../features/apiSlice';

export const InventoryDataSection = () => {
  const { data: categoriesData = [] } = useGetCategoriesQuery('inventory');

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell>Category Name</TableCell>
          <TableCell>Item Shape</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {categoriesData.map((items) => (
          <TableRow key={items.id}>
            <TableCell>{items.id}</TableCell>
            <TableCell>{items.name}</TableCell>
            <TableCell>
              {Object.entries(items.itemShape).map(([key, val]) => (
                <Typography key={key}>{`${key}: ${val}`}</Typography>
              ))}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
