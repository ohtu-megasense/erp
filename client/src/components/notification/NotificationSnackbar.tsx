import { useDispatch } from 'react-redux';
import { Snackbar, Alert, Badge, Box } from '@mui/material';
import { useAppSelector } from '../../app/hooks';
import { removeNotification } from '../../features/notificationSlice';

export const NotificationSnackbar = () => {
  const notifications = useAppSelector((state) => state.notification.queue);
  const dispatch = useDispatch();

  const open = notifications.length > 0;
  const currentNotification =
    notifications.length > 0 ? notifications[0] : null;

  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    if (currentNotification) {
      dispatch(removeNotification(currentNotification.id));
    }
  };

  if (!currentNotification) return null;

  return (
    <Snackbar
      key={crypto.randomUUID()}
      open={open}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{ mt: -2 }}
      message={currentNotification.message}
    >
      <Box sx={{ position: 'relative' }}>
        <Alert
          onClose={handleClose}
          severity={currentNotification.severity || 'info'}
          sx={{ width: '100%' }}
          color={currentNotification.severity === 'error' ? 'error' : 'info'}
        >
          {currentNotification.message}
        </Alert>

        <Badge
          badgeContent={notifications.length}
          color="primary"
          sx={{
            position: 'absolute',
            top: 5,
            right: 0
          }}
        />
      </Box>
    </Snackbar>
  );
};
