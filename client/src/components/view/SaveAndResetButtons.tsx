import { Stack } from '@mui/material';
import { useAppSelector } from '../../app/hooks';
import { ResetButton } from './ResetButton';
import { SaveViewButton } from './SaveViewButton';
import { useStateKey } from './useStateKey';

export const SaveAndResetButtons = () => {
  const stateKey = useStateKey();
  const nodeCount = useAppSelector(
    (state) => state.createView[stateKey].nodes.length
  );

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
