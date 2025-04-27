import { Box, Stack, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { ModuleOption } from '../../../../shared/types';
import { useEffect, useLayoutEffect } from 'react';
import { createDefaultRoot, setModule } from './createViewSlice';
import { blueColor, orangeColor } from './colors';
import { ViewsList } from './ViewsList';
import { LoadPropertyOptions } from './LoadPropertyOptions';
import { RootNode } from './RootNode';
import { Name } from './Name';
import { SaveAndResetButtons } from './SaveAndResetButtons';

const Heading = () => {
  const module = useAppSelector((state) => state.createView.module);

  return (
    <Stack>
      <Typography sx={{ color: blueColor, fontSize: 38, fontWeight: 500 }}>
        {module.toLocaleUpperCase()}
      </Typography>
      <Typography
        sx={{
          fontSize: 24,
          fontWeight: 500,
          color: orangeColor
        }}
      >
        Manage Views
      </Typography>
    </Stack>
  );
};

export const BuildViewPage = (props: { module: ModuleOption }) => {
  const dispatch = useAppDispatch();

  useLayoutEffect(() => {
    dispatch(setModule({ module: props.module }));
  }, [dispatch, props.module]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    dispatch(createDefaultRoot());
  }, [dispatch]);

  return (
    <>
      <LoadPropertyOptions />
      <Stack
        sx={{
          mx: 2,
          mt: 2,
          borderRadius: 4,
          gap: 2
        }}
      >
        <Box bgcolor={undefined} p={0}>
          <Heading />
        </Box>
        <Stack gap={2} mb={2}>
          <Typography fontSize={18}>Create New View</Typography>
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
            <SaveAndResetButtons />
          </Stack>
        </Stack>
        <ViewsList showDelete={true} />
      </Stack>
    </>
  );
};
