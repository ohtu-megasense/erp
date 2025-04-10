import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// could represent a collection of selected fields
// accross any module and category
// which module, which category, which field

export const chartOptions = {
  bar: 'bar',
  pie: 'pie'
} as const;

export type ChartType = (typeof chartOptions)[keyof typeof chartOptions];

interface DatasetFieldsSlice {
  fields: string[];
}

const initialState: DatasetFieldsSlice = {
  fields: []
};

const slice = createSlice({
  name: 'datasetFields',
  initialState,
  reducers: {
    addedField: (state, action: PayloadAction<{ field: string }>) => {
      state.fields.push(action.payload.field);
    },
    removedField: (state, action: PayloadAction<{ field: string }>) => {
      state.fields = state.fields.filter((p) => p !== action.payload.field);
    }
  }
});

export default slice.reducer;
export const { addedField, removedField } = slice.actions;
