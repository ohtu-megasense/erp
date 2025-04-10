import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const chartOptions = {
  bar: 'bar',
  pie: 'pie'
} as const;

export type ChartType = (typeof chartOptions)[keyof typeof chartOptions];

interface ChartTypeSelectionSlice {
  chartType: ChartType;
}

const initialState: ChartTypeSelectionSlice = {
  chartType: 'bar'
};

const slice = createSlice({
  name: 'chartTypeSelection',
  initialState,
  reducers: {
    selectedChartType: (
      state,
      action: PayloadAction<{ chartType: ChartType }>
    ) => {
      state.chartType = action.payload.chartType;
    }
  }
});

export default slice.reducer;
export const { selectedChartType } = slice.actions;
