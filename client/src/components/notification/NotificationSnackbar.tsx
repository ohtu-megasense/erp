import { useDispatch } from 'react-redux';
import {
  Snackbar,
  Alert,
  Badge,
  Box,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useAppSelector } from '../../app/hooks';
import { removeNotification } from '../../features/notificationSlice';

export const NotificationSnackbar = () => {
  const notifications = useAppSelector((state) => state.notification.queue);
  const dispatch = useDispatch();
  const theme = useTheme();
  const isSmallOrUnder = useMediaQuery(theme.breakpoints.down('sm'));

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
      anchorOrigin={{
        vertical: isSmallOrUnder ? 'bottom' : 'top',
        horizontal: 'center'
      }}
      sx={{ mt: isSmallOrUnder ? 0 : -2 }}
      message={currentNotification.message}
    >
      <Box sx={{ position: 'relative' }}>
        <Alert
          onClose={handleClose}
          severity={currentNotification.severity || 'info'}
          sx={{ width: '100%' }}
          color={currentNotification.severity}
        >
          {currentNotification.message}
        </Alert>

        {notifications.length > 1 && (
          <Badge
            badgeContent={notifications.length}
            color={currentNotification.severity}
            sx={{
              position: 'absolute',
              top: 5,
              right: 0
            }}
          />
        )}
      </Box>
    </Snackbar>
  );
};
