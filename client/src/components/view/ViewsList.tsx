import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Stack, Typography, Box } from '@mui/material';
import { useAppSelector } from '../../app/hooks';
import { Item, type View } from '../../../../shared/types';
import { useGetViewsQuery } from '../../features/apiSlice';
import { ChangeEvent, useState } from 'react';
import { blueColor } from './colors';

interface Column {
  id: string | number;
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const PaginatedTable = (props: { shape: string[]; items: Item[] }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const columns: Column[] = props.shape.map((property) => {
    return {
      id: property,
      label: property,
      minWidth: 120
    };
  });

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Box
      sx={{
        width: '100%',
        overflow: 'hidden',
        border: '1.5px solid',
        borderColor: blueColor,
        borderRadius: 2
      }}
    >
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table" size="small">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {props.items
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((item) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={item.id}>
                    {columns.map((column) => {
                      const value = item.item_data[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={props.items.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

const View = (props: { view: View }) => {
  const { view } = props;

  const getShapes = (): Record<string, Item[]> => {
    const shapes: Record<string, Item[]> = {};

    for (const item of view.items) {
      const shape = Object.keys(item.item_data).toString();

      if (!shapes[shape]) {
        shapes[shape] = [];
      }

      shapes[shape].push(item);
    }

    return shapes;
  };

  const shapes = getShapes();
  const shapeCount = Object.keys(shapes).length;

  return (
    <Stack gap={2}>
      <Stack>
        <Typography
          sx={{
            fontSize: 18
          }}
        >
          {view.name}
        </Typography>
        {view.items.length === 0 && (
          <Typography variant="caption">No items found</Typography>
        )}
        {shapeCount > 0 && (
          <Typography variant="caption">
            {shapeCount} different row types
          </Typography>
        )}
      </Stack>
      <Stack gap={4}>
        {Object.entries(shapes).map(([shape, items], index) => {
          return (
            <PaginatedTable
              key={index}
              shape={shape.split(',')}
              items={items}
            />
          );
        })}
      </Stack>
    </Stack>
  );
};

export const ViewsList = () => {
  const module = useAppSelector((state) => state.createView.module);
  const { data: views = [] } = useGetViewsQuery(module);
  const ordered = [...views].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Stack
      sx={{
        gap: 4
      }}
    >
      {ordered.map((view) => (
        <View key={view.id} view={view} />
      ))}
    </Stack>
  );
};
