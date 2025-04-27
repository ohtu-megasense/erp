import { Stack } from '@mui/material';
import { useAppSelector } from '../../app/hooks';
import { ResetButton } from './ResetButton';
import { SaveViewButton } from './SaveViewButton';

export const SaveAndResetButtons = () => {
  const nodeCount = useAppSelector((state) => state.createView.nodes.length);

  return (
    <>
      {nodeCount > 0 && (
        <Stack flexDirection="row" gap={2}>
          <SaveViewButton />
          <ResetButton />
        </Stack>
      )}
    </>
  );
};
