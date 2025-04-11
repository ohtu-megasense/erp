import { useState } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { Box, Button, Menu, MenuItem, Stack, Typography } from '@mui/material';
import { addedXAxisField, addedYAxisField } from './barChartBuilderSlice';
import { testDataset } from './dataset';
import { addedField } from './datasetFieldsSlice';

export const SelectBarChartData = () => {
  return (
    <>
      <Stack
        sx={{
          gap: 1,
          p: 1
        }}
      >
        <SelectBarChartXAxisData />
        <SelectBarChartYAxisData />
      </Stack>
    </>
  );
};

const SelectBarChartXAxisData = () => {
  const { shape } = testDataset;
  const fields: string[] = [];

  // only string type fields are used
  // for x-axis

  for (const [key, value] of Object.entries(shape)) {
    if (value === 'string') {
      fields.push(key);
    }
  }

  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const isMenuOpen = Boolean(menuAnchor);

  const dispatch = useAppDispatch();

  const openMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const closeMenu = () => {
    setMenuAnchor(null);
  };

  const addField = (field: string) => {
    dispatch(addedXAxisField({ field }));
    dispatch(addedField({ field }));
    closeMenu();
  };

  return (
    <>
      <Stack>
        <Typography variant="body1">X-axis</Typography>
        <Box>
          <Button onClick={openMenu} variant="outlined">
            + Add data
          </Button>
        </Box>
      </Stack>
      {isMenuOpen && (
        <Menu
          anchorEl={menuAnchor}
          open={isMenuOpen}
          onClose={closeMenu}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left'
          }}
        >
          {fields.map((field) => {
            return (
              <MenuItem key={field} onClick={() => addField(field)}>
                {field}
              </MenuItem>
            );
          })}
        </Menu>
      )}
    </>
  );
};

const SelectBarChartYAxisData = () => {
  const { shape } = testDataset;
  const fields: string[] = [];

  // only number type fields are used
  // for y-axis

  for (const [key, value] of Object.entries(shape)) {
    if (value === 'number') {
      fields.push(key);
    }
  }

  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const isMenuOpen = Boolean(menuAnchor);

  const dispatch = useAppDispatch();

  const openMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const closeMenu = () => {
    setMenuAnchor(null);
  };

  const addField = (field: string) => {
    dispatch(addedYAxisField({ field }));
    dispatch(addedField({ field }));
    closeMenu();
  };

  return (
    <>
      <Stack>
        <Typography variant="body1">Y-axis</Typography>
        <Box>
          <Button onClick={openMenu} variant="outlined">
            + Add data
          </Button>
        </Box>
      </Stack>
      {isMenuOpen && (
        <Menu
          anchorEl={menuAnchor}
          open={isMenuOpen}
          onClose={closeMenu}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left'
          }}
        >
          {fields.map((field) => {
            return (
              <MenuItem key={field} onClick={() => addField(field)}>
                {field}
              </MenuItem>
            );
          })}
        </Menu>
      )}
    </>
  );
};
