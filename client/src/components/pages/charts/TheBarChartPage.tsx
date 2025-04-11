import { Grid2, Typography } from '@mui/material';
import { useAppSelector } from '../../../app/hooks';
import { BarChart } from '@mui/x-charts';
import { validateDataset } from './dataset';

import { PieChartPreview } from './PieChartPreview';
import { BarChartPreview } from './BarChartPreview';
import { DatasetLoader } from './DatasetLoader';

const TheBarChart = () => {
  const xAxisField = useAppSelector(
    (state) => state.barChartBuilder.xAxisField
  );

  const yAxisField = useAppSelector(
    (state) => state.barChartBuilder.yAxisField
  );

  const datasetState = useAppSelector((state) => state.barChartBuilder.dataset);

  if (!yAxisField || !xAxisField || !datasetState) {
    return <BarChartPreview />;
  }

  const validation = validateDataset(
    datasetState.dataset,
    xAxisField,
    yAxisField
  );
  if (!validation.isValid) {
    return <Typography>Error: {validation.error}</Typography>;
  }

  const valueFormatter = (value: number | null) =>
    value === null ? 'N/A' : value.toLocaleString();

  return (
    <BarChart
      dataset={datasetState.dataset}
      xAxis={[{ scaleType: 'band', dataKey: xAxisField }]}
      series={[
        {
          dataKey: yAxisField,
          label: `Total ${yAxisField} by ${xAxisField}`,
          valueFormatter
        }
      ]}
      height={400}
    />
  );
};

export const TheBarChartPage = () => {
  const chartType = useAppSelector((state) => state.chartType.chartType);

  if (chartType === 'pie') {
    return <PieChartPreview />;
  }

  if (chartType === 'bar') {
    return (
      <>
        <DatasetLoader />
        <Grid2 container>
          <Grid2 size={12}>
            <TheBarChart />
          </Grid2>
        </Grid2>
      </>
    );
  }

  return <Typography>Invalid chart type</Typography>;
};
