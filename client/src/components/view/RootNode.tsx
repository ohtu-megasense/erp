import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { createDefaultRoot } from './createViewSlice';
import { Node } from './Node';
import { AddButton } from './AddButton';

export const RootNode = () => {
  const nodes = useAppSelector((state) => state.createView.nodes);
  const root = nodes.length > 0 ? nodes[0] : null;
  const isInitialized = useRef(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!root && !isInitialized.current) {
      dispatch(createDefaultRoot());
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
        <>
          <AddButton parentId={-1} text="+ Filter" />
        </>
      )}
    </>
  );
};
