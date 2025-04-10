import { Grid2, IconButton } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { chartOptions, ChartType } from './datasetFieldsSlice';
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import { selectedChartType } from './chartTypeSlice';

export const ChartTypeSelection = () => {
  const chartType = useAppSelector((state) => state.chartType.chartType);

  const dispatch = useAppDispatch();

  const onClickChartType = (chartType: ChartType) => {
    dispatch(selectedChartType({ chartType }));
  };

  const getChartIcon = (type: ChartType) => {
    switch (type) {
      case 'bar':
        return <BarChartIcon />;
      case 'pie':
        return <PieChartIcon />;
      default:
        throw new Error('Invalid chart type');
    }
  };

  return (
    <Grid2 container spacing={0}>
      {Object.values(chartOptions).map((option) => {
        const isActive = option === chartType;
        return (
          <Grid2
            key={option}
            onClick={() => onClickChartType(option)}
            size={2}
            component={IconButton}
            disableRipple
            sx={{
              color: isActive ? 'primary.main' : undefined,
              borderRadius: 0,
              border: '1px solid',
              borderColor: isActive ? 'black' : 'transparent',
              aspectRatio: '1/1'
            }}
          >
            {getChartIcon(option)}
          </Grid2>
        );
      })}
    </Grid2>
  );
};
