import { useEffect } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { setDataset } from './barChartBuilderSlice';
import { testDataset } from './dataset';

export const DatasetLoader = () => {
  // this component represents kind of a mock
  // "dataset loader" which sends the working dataset
  // to redux

  // in some component we could load categories from the api
  // -> the categories are still kind of "raw data"
  // which would be further processed for the visualization
  // and then sent to redux like in here

  const dispatch = useAppDispatch();

  const setBarChartDataset = () => {
    dispatch(setDataset({ dataset: testDataset }));
  };

  useEffect(() => {
    setBarChartDataset();
  });

  return null;
};
