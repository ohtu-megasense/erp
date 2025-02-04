import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../features/apiSlice";
import exampleSlice from "../features/exampleSlice";
import drawerSlice from "../features/drawerSlice";

export const store = configureStore({
  reducer: {
    example: exampleSlice,
    drawer: drawerSlice,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(apiSlice.middleware);
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
