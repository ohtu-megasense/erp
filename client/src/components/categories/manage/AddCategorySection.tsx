import { Paper, Stack, Typography } from '@mui/material';
import { AddCategoryForm } from './AddCategoryForm';

export const AddCategorySection = () => {
  return (
    <Paper
      sx={{
        p: 2
      }}
    >
      <Stack
        sx={{
          gap: 2
        }}
      >
        <Typography>Create new categories</Typography>
        <AddCategoryForm />
      </Stack>
    </Paper>
  );
};
