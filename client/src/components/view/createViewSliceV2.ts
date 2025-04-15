import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  DecoratorOption,
  FilterConfig,
  FilterOption,
  ModuleOption
} from '../../../../shared/types';

export type Id = string | number;

export interface Node {
  parentId: Id;
  filter: FilterConfig;
}

interface CreateViewSlice {
  module: ModuleOption;
  name: string;
  nodes: Node[];
  propertyOptions: string[];
}

const initialState: CreateViewSlice = {
  module: 'crm',
  name: '',
  nodes: [],
  propertyOptions: []
};

export const createNode = (
  type: FilterOption | DecoratorOption,
  parentId: Id
): Node => {
  const id = crypto.randomUUID();

  switch (type) {
    case 'and':
      return {
        parentId,
        filter: {
          id,
          type: 'and',
          filters: []
        }
      };
    case 'equals':
      return {
        parentId,
        filter: {
          id,
          type: 'equals',
          property: '',
          value: ''
        }
      };
    default:
      throw new Error('Unknown filter config');
  }
};

const slice = createSlice({
  name: 'createView',
  initialState,
  reducers: {
    setPropertyOptions: (
      state,
      action: PayloadAction<{ properties: string[] }>
    ) => {
      state.propertyOptions = action.payload.properties;
    },
    setModule: (state, action: PayloadAction<{ module: ModuleOption }>) => {
      state.module = action.payload.module;
    },
    addNode: (state, action: PayloadAction<{ node: Node }>) => {
      state.nodes.push(action.payload.node);
      console.log('Added new child for parent', action.payload.node.parentId);
    },
    reset: (state) => {
      state.name = '';
      state.nodes = [];
    }
  }
});

export default slice.reducer;
export const { setPropertyOptions, setModule, addNode, reset } = slice.actions;
