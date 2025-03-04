import { Box, Paper, Stack, Typography } from '@mui/material';
import { useAppSelector } from '../../../app/hooks';
import { UpdateItem } from './UpdateItem';

export const UpdateItems = () => {
  const categories = useAppSelector(
    (state) => state.categoryData.categoriesData
  );

  return (
    <Box>
      {categories.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No categories available
        </Typography>
      ) : (
        <Stack gap={2}>
          {categories.map((category) => (
            <Paper
              sx={{
                p: 2
              }}
            >
              <UpdateItem key={category.id} category={category} />
            </Paper>
          ))}
        </Stack>
      )}
    </Box>
  );
};
