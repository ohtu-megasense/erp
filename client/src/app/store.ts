import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '../features/apiSlice';
import exampleSlice from '../features/exampleSlice';
import drawerSlice from '../features/drawerSlice';
import categorySlice from '../features/categorySlice';
import categoryDataSlice from '../features/categoryDataSlice';

export const store = configureStore({
  reducer: {
    example: exampleSlice,
    drawer: drawerSlice,
    category: categorySlice,
    categoryData: categoryDataSlice,
    [apiSlice.reducerPath]: apiSlice.reducer
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(apiSlice.middleware);
  }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
