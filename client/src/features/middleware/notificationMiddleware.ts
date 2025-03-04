import { createListenerMiddleware } from '@reduxjs/toolkit';
import { addedCategory, addedItem, updateItem } from '../categoryDataSlice';
import { addNotification } from '../notificationSlice';

export const notificationMiddleware = createListenerMiddleware();

notificationMiddleware.startListening({
  actionCreator: updateItem,
  effect: async (_, listenerApi) => {
    listenerApi.dispatch(
      addNotification({
        id: crypto.randomUUID(),
        message: 'Item updated successfully.',
        severity: 'success',
        duration: 4000
      })
    );
  }
});

notificationMiddleware.startListening({
  actionCreator: addedItem,
  effect: async (_, listenerApi) => {
    listenerApi.dispatch(
      addNotification({
        id: crypto.randomUUID(),
        message: `New item added.`,
        severity: 'success',
        duration: 4000
      })
    );
  }
});

notificationMiddleware.startListening({
  actionCreator: addedCategory,
  effect: async (_, listenerApi) => {
    listenerApi.dispatch(
      addNotification({
        id: crypto.randomUUID(),
        message: `New category created.`,
        severity: 'success',
        duration: 4000
      })
    );
  }
});
