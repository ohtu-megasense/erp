import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FilterConfig, ViewConfig } from '../../../../shared/types';

interface CreateViewSlice {
  filters: FilterConfig[];
  viewConfig: ViewConfig | null;
  module: 'inventory' | 'crm';
  propertyOptions: string[];
}

const initialState: CreateViewSlice = {
  filters: [],
  viewConfig: null,
  module: 'crm',
  propertyOptions: []
};

const slice = createSlice({
  name: 'createView',
  initialState,
  reducers: {
    removedFilter: (state, action: PayloadAction<{ id: string | number }>) => {
      const id = action.payload.id;
      state.filters = state.filters.filter((filter) => filter.id !== id);
    },
    addedFilter: (state, action: PayloadAction<{ filter: FilterConfig }>) => {
      state.filters.push(action.payload.filter);
    },
    createdView: (state, action: PayloadAction<{ view: ViewConfig }>) => {
      state.viewConfig = action.payload.view;
      state.filters = [];
      state.viewConfig = null;
    },
    setPropertyOptions: (
      state,
      action: PayloadAction<{ properties: string[] }>
    ) => {
      state.propertyOptions = action.payload.properties;
    }
  }
});

export default slice.reducer;
export const { removedFilter, addedFilter, setPropertyOptions } = slice.actions;
