import {
  IconButton,
  Link,
  SvgIconProps,
  TableCell,
  TableRow,
} from "@mui/material";
import { ComponentType } from "react";

interface LocationTableRowProps {
  href: string;
  label: string;
  value?: string;
  Icon: ComponentType<SvgIconProps>;
}

export const LocationTableRow = ({
  href,
  label,
  value,
  Icon,
}: LocationTableRowProps) => {
  return (
    <TableRow>
      <TableCell>{label}</TableCell>
      <TableCell>
        <IconButton
          size="small"
          sx={{
            transform: "translateX(-10px)",
            color: "primary.light",
          }}
          LinkComponent={Link}
          href={href}
          target="_blank"
          rel="noreferrer"
        >
          {
            <Icon
              sx={{
                fontSize: 16,
              }}
            />
          }
        </IconButton>
        {value}
      </TableCell>
    </TableRow>
  );
};
