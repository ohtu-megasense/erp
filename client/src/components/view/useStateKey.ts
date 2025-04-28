import { useContext } from 'react';
import { StateKeyContext } from './StateKeyContext';

export const useStateKey = () => {
  const context = useContext(StateKeyContext);
  if (context === undefined) {
    throw new Error('useStateKey must be used within a StateKeyProvider');
  }
  return context;
};
