import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IBarChartBuilder {
  xAxisField: string;
  yAxisField: string;
}

const initialState: IBarChartBuilder = {
  xAxisField: '',
  yAxisField: ''
};

const slice = createSlice({
  name: 'visualize',
  initialState,
  reducers: {
    addedXAxisField: (state, action: PayloadAction<{ field: string }>) => {
      state.xAxisField = action.payload.field;
    },
    addedYAxisField: (state, action: PayloadAction<{ field: string }>) => {
      state.yAxisField = action.payload.field;
    },
    removedXAxisField: (state) => {
      state.xAxisField = '';
    },
    removedYAxisField: (state) => {
      state.yAxisField = '';
    }
  }
});

export default slice.reducer;
export const {
  addedXAxisField,
  addedYAxisField,
  removedXAxisField,
  removedYAxisField
} = slice.actions;
