import { Box, Button, Stack } from '@mui/material';
import { ViewConfig } from '../../../../shared/types';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useCreateViewMutation } from '../../features/apiSlice';
import { createDefaultRoot, createView } from './createViewSlice';
import { greenColor } from './colors';

export const SaveViewButton = () => {
  const name = useAppSelector((state) => state.createView.name);
  const module = useAppSelector((state) => state.createView.module);
  const nodes = useAppSelector((state) => state.createView.nodes);
  const dispatch = useAppDispatch();
  const [apiCreateView] = useCreateViewMutation();

  const getView = (): ViewConfig | null => {
    if (!name) {
      console.log('Invalid name');
      return null;
    }

    if (nodes.length === 0) {
      console.log('Add a filter first');
      return null;
    }

    return createView(module, name, nodes);
  };

  const onClick = async () => {
    const view = getView();
    if (view === null) return;
    try {
      const response = await apiCreateView(view).unwrap();
      dispatch(createDefaultRoot());
      console.log('Created a view', response);
    } catch (error) {
      console.log('Error creating a view', error);
    }
  };

  const isDisabled = nodes.length === 0 || Boolean(name) === false;

  return (
    <>
      <Stack gap={2}>
        <Box>
          <Button
            disabled={isDisabled}
            variant="outlined"
            fullWidth={false}
            onClick={onClick}
            sx={{
              color: isDisabled ? undefined : greenColor,
              outlineColor: isDisabled ? undefined : greenColor,
              outline: '1px solid',
              borderRadius: 1,
              px: 2
            }}
          >
            Save Filter as View
          </Button>
        </Box>
      </Stack>
    </>
  );
};
