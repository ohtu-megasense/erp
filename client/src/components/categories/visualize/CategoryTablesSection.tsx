import { Typography } from '@mui/material';
import { CategoryTables } from './CategoryTables';

export const CategoryTablesSection = () => {
  return (
    <>
      <Typography
        sx={{
          fontSize: 24,
          mb: 2
        }}
      >
        Data Tables
      </Typography>
      <CategoryTables />
    </>
  );
};
