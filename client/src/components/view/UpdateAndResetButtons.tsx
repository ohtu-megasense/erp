import { Stack } from '@mui/material';
import { useAppSelector } from '../../app/hooks';
import { ResetButton } from './ResetButton';
import { UpdateViewButton } from './UpdateViewButton';
import { View } from '../../../../shared/types';

export const UpdateAndResetButtons = (props: { view: View }) => {
  const nodeCount = useAppSelector((state) => state.createView.nodes.length);

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
