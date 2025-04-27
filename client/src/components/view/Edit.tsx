import { useAppDispatch } from '../../app/hooks';
import { useEffect } from 'react';
import { populateFromView } from './createViewSlice';
import { Stack } from '@mui/material';
import { blueColor } from './colors';
import { RootNode } from './RootNode';
import { Name } from './Name';
import { View } from './View';
import { type View as IView } from '../../../../shared/types';
import { UpdateAndResetButtons } from './UpdateAndResetButtons';

export const Edit = (props: { view: IView }) => {
  const dispatch = useAppDispatch();
  const { view } = props;

  useEffect(() => {
    if (view) {
      dispatch(
        populateFromView({
          name: view.name,
          filterConfig: view.filterConfig
        })
      );
    }
  }, [dispatch, view]);

  return (
    <>
      <Stack
        sx={{
          mx: 2,
          mt: 2,
          borderRadius: 4,
          gap: 2
        }}
      >
        <Stack gap={2} mb={2}>
          <Stack
            sx={{
              border: '1px solid',
              borderColor: blueColor,
              borderRadius: 2,
              p: 2,
              gap: 2
            }}
          >
            <RootNode />
            <Name />
            <UpdateAndResetButtons view={props.view} />
          </Stack>
        </Stack>
        <View view={view} showDelete={false} />
      </Stack>
    </>
  );
};
