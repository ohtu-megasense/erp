import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Dataset } from './dataset';

interface IBarChartBuilder {
  xAxisField: string;
  yAxisField: string;
  dataset: Dataset | null;
}

const initialState: IBarChartBuilder = {
  xAxisField: '',
  yAxisField: '',
  dataset: null
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
    },
    setDataset: (state, action: PayloadAction<{ dataset: Dataset }>) => {
      state.dataset = action.payload.dataset;
    }
  }
});

export default slice.reducer;
export const {
  addedXAxisField,
  addedYAxisField,
  removedXAxisField,
  removedYAxisField,
  setDataset
} = slice.actions;
