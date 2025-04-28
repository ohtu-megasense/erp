import { Stack } from '@mui/material';
import { useAppSelector } from '../../app/hooks';
import { ResetButton } from './ResetButton';
import { UpdateViewButton } from './UpdateViewButton';
import { View } from '../../../../shared/types';
import { useStateKey } from './useStateKey';

export const UpdateAndResetButtons = (props: { view: View }) => {
  const stateKey = useStateKey();
  const nodeCount = useAppSelector(
    (state) => state.createView[stateKey].nodes.length
  );

  return (
    <>
      {nodeCount > 0 && (
        <Stack flexDirection="row" gap={2}>
          <UpdateViewButton view={props.view} />
          <ResetButton />
        </Stack>
      )}
    </>
  );
};
