import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  AndFilterConfig,
  FilterConfig,
  ModuleOption
} from '../../../../shared/types';

interface CreateViewSlice {
  module: 'inventory' | 'crm';
  name: string;
  root: AndFilterConfig;
  propertyOptions: string[];
}

const initialState: CreateViewSlice = {
  module: 'crm',
  name: '',
  root: {
    id: 'root',
    type: 'and',
    filters: []
  },
  propertyOptions: []
};

const slice = createSlice({
  name: 'createView',
  initialState,
  reducers: {
    removedFilter: (state, action: PayloadAction<{ id: string | number }>) => {
      const id = action.payload.id;
      state.root.filters = state.root.filters.filter(
        (filter) => filter.id !== id
      );
    },
    addedFilter: (state, action: PayloadAction<{ filter: FilterConfig }>) => {
      state.root.filters.push(action.payload.filter);
    },
    setName: (state, action: PayloadAction<{ name: string }>) => {
      state.name = action.payload.name;
    },
    setPropertyOptions: (
      state,
      action: PayloadAction<{ properties: string[] }>
    ) => {
      state.propertyOptions = action.payload.properties;
    },
    setModule: (state, action: PayloadAction<{ module: ModuleOption }>) => {
      state.module = action.payload.module;
    },
    resetState: (state) => {
      state.name = '';
      state.root.filters = [];
    }
  }
});

export default slice.reducer;
export const {
  removedFilter,
  addedFilter,
  setPropertyOptions,
  setName,
  setModule,
  resetState
} = slice.actions;
