import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '../features/apiSlice';
import drawerSlice from '../features/drawerSlice';
import categoryDataSlice from '../features/categoryDataSlice';
import notificationSlice from '../features/notificationSlice';
import { notificationMiddleware } from '../features/middleware/notificationMiddleware';

export const store = configureStore({
  reducer: {
    drawer: drawerSlice,
    categoryData: categoryDataSlice,
    notification: notificationSlice,
    [apiSlice.reducerPath]: apiSlice.reducer
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware()
      .prepend(notificationMiddleware.middleware)
      .concat(apiSlice.middleware);
  }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
