import { Box, Button, Stack } from '@mui/material';
import { View, ViewConfig } from '../../../../shared/types';
import { useAppSelector } from '../../app/hooks';
import { useUpdateViewMutation } from '../../features/apiSlice';
import { createView } from '../../features/createViewSlice';
import { greenColor } from './colors';
import { useStateKey } from './useStateKey';

export const UpdateViewButton = (props: { view: View }) => {
  const stateKey = useStateKey();
  const name = useAppSelector((state) => state.createView[stateKey].name);
  const module = useAppSelector((state) => state.createView.module);
  const nodes = useAppSelector((state) => state.createView[stateKey].nodes);
  const [apiUpdateView] = useUpdateViewMutation();

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
      const response = await apiUpdateView({
        id: props.view.id,
        viewConfig: view
      }).unwrap();
      console.log('View update', response);
    } catch (error) {
      console.log('Error updating view', error);
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
            Save Changes
          </Button>
        </Box>
      </Stack>
    </>
  );
};
