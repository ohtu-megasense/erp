import { createContext } from 'react';
import { StateKey } from './createViewSlice';

export const StateKeyContext = createContext<StateKey>('buildState');
