import { Paper, Typography } from '@mui/material';
import { CategoryShapes } from '../CategoryShapes';

export const CategoryShapesSection = () => {
  return (
    <>
      <Typography
        sx={{
          mb: 2,
          fontWeight: 300,
          fontSize: 22
        }}
      >
        Current Category Shapes
      </Typography>
      <Paper>
        <CategoryShapes />
      </Paper>
    </>
  );
};
