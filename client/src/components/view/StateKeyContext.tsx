import { createContext } from 'react';
import { StateKey } from '../../features/createViewSlice';

export const StateKeyContext = createContext<StateKey>('buildState');
