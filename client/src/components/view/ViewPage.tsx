import { Link, Stack, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { ModuleOption } from '../../../../shared/types';
import { useLayoutEffect as useEffect, useState } from 'react';
import { setModule } from '../../features/createViewSlice';
import { ViewsList } from './ViewsList';
import { blueColor, orangeColor } from './colors';
import { useGetViewsQuery } from '../../features/apiSlice';

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
        Views
      </Typography>
    </Stack>
  );
};

const NoViewsMessage = (props: { module: ModuleOption }) => {
  const { data: views = [] } = useGetViewsQuery(props.module);

  if (views.length > 0) {
    return null;
  }

  return (
    <Stack
      sx={{
        py: 4,
        px: 2,
        border: `1px solid ${blueColor}`,
        borderRadius: 2,
        gap: 2,
        textAlign: 'center',
        my: 4
      }}
    >
      <Typography
        sx={{
          fontSize: 18,
          fontWeight: 400,
          color: blueColor
        }}
      >
        No views found for this module.
      </Typography>
      <Link
        href="build"
        sx={{
          fontSize: 16,
          fontWeight: 500,
          color: orangeColor,
          textDecoration: 'underline',
          cursor: 'pointer',
          '&:hover': {
            color: blueColor
          }
        }}
      >
        Create a new view
      </Link>
    </Stack>
  );
};

export const ViewPage = (props: { module: ModuleOption }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setModule({ module: props.module }));
    setIsLoaded(true);
  }, [dispatch, props.module]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [isLoaded]);

  if (!isLoaded) {
    return null;
  }

  return (
    <Stack
      sx={{
        mx: 2,
        mt: 2,
        borderRadius: 4,
        gap: 2
      }}
    >
      <Heading />
      <NoViewsMessage module={props.module} />
      <ViewsList />
    </Stack>
  );
};
