import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '../features/apiSlice';
import drawerSlice from '../features/drawerSlice';
import notificationSlice from '../features/notificationSlice';

export const store = configureStore({
  reducer: {
    drawer: drawerSlice,
    notification: notificationSlice,
    [apiSlice.reducerPath]: apiSlice.reducer
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(apiSlice.middleware);
  }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
