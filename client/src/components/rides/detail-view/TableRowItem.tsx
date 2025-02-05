import { TableCell, TableRow } from "@mui/material";

interface TableRowItemProps {
  property: string;
  value: string | number;
}

export const TableRowItem = ({ property, value }: TableRowItemProps) => {
  return (
    <TableRow>
      <TableCell>{property}</TableCell>
      <TableCell>{value}</TableCell>
    </TableRow>
  );
};
