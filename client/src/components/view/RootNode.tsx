import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { createDefaultRoot } from '../../features/createViewSlice';
import { Node } from './Node';
import { AddButton } from './AddButton';
import { ResetButton } from './ResetButton';
import { Stack } from '@mui/material';
import { useStateKey } from './useStateKey';

export const RootNode = () => {
  const stateKey = useStateKey();
  const nodes = useAppSelector((state) => state.createView[stateKey].nodes);
  const root = nodes.length > 0 ? nodes[0] : null;
  const isInitialized = useRef(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!root && !isInitialized.current) {
      dispatch(createDefaultRoot({ stateKey }));
      isInitialized.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {root ? (
        <>
          <Node
            key={root.filter.id}
            filter={root.filter}
            parentId={root.parentId}
          />
        </>
      ) : (
        <Stack gap={2} flexDirection="row">
          <AddButton parentId={-1} text="+ Filter" />
          <ResetButton isSmall={true} />
        </Stack>
      )}
    </>
  );
};
