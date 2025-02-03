import { createSlice } from "@reduxjs/toolkit";

interface DrawerState {
  isOpen: boolean;
}

const initialState: DrawerState = {
  isOpen: false,
};

const slice = createSlice({
  name: "drawer",
  initialState,
  reducers: {
    openedDrawer: (state) => {
      state.isOpen = true;
    },
    closedDrawer: (state) => {
      state.isOpen = false;
    },
  },
});

export default slice.reducer;
export const { openedDrawer, closedDrawer } = slice.actions;
