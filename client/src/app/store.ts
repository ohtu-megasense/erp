import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '../features/apiSlice';
import drawerSlice from '../features/drawerSlice';
import notificationSlice from '../features/notificationSlice';
import createViewSliceV2 from '../components/view/createViewSliceV2';

export const store = configureStore({
  reducer: {
    drawer: drawerSlice,
    notification: notificationSlice,
    createView: createViewSliceV2,
    [apiSlice.reducerPath]: apiSlice.reducer
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(apiSlice.middleware);
  }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
