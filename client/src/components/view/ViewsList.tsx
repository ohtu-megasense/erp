import { Stack } from '@mui/material';
import { useAppSelector } from '../../app/hooks';
import { useGetViewsQuery } from '../../features/apiSlice';
import { View } from './View';

export const ViewsList = ({ showDelete = false }: { showDelete?: boolean }) => {
  const module = useAppSelector((state) => state.createView.module);
  const { data: views = [] } = useGetViewsQuery(module);
  const ordered = [...views].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Stack
      sx={{
        gap: 4
      }}
    >
      {ordered.map((view) => (
        <View key={view.id} view={view} showEditButtons={showDelete} />
      ))}
    </Stack>
  );
};
