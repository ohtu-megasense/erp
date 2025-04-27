import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  AndFilterConfig,
  DecoratorOption,
  FilterConfig,
  FilterOption,
  ModuleOption,
  OrFilterConfig,
  PropertyFilterConfig,
  ViewConfig
} from '../../../../shared/types';

export type Id = string | number;
export type Invert = 'is' | 'not';
export type StateKey = 'buildState' | 'editState';

export interface Node {
  parentId: Id;
  filter: FilterConfig;
  invert: Invert;
}

interface ViewState {
  name: string;
  nodes: Node[];
}

interface State {
  buildState: ViewState;
  editState: ViewState;
  module: ModuleOption;
  propertyOptions: string[];
}

const initialState: State = {
  module: 'crm',
  propertyOptions: [],
  buildState: {
    name: '',
    nodes: []
  },
  editState: {
    name: '',
    nodes: []
  }
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
        invert: 'is',
        filter: {
          id,
          type: 'and',
          filters: []
        }
      };
    case 'or':
      return {
        parentId,
        invert: 'is',
        filter: {
          id,
          type: 'or',
          filters: []
        }
      };
    case 'equals':
      return {
        parentId,
        invert: 'is',
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

export const createView = (
  module: string,
  name: string,
  nodes: Node[]
): ViewConfig | null => {
  if (nodes.length === 0) {
    return null;
  }
  const rootId = nodes[0].filter.id;
  const filterConfig = createFilterConfig(rootId, nodes);

  if (!filterConfig) {
    console.log('Failed to build filter config from root');
    return null;
  }

  const view: ViewConfig = {
    module,
    name,
    filterConfig
  };

  return view;
};

const createFilterConfig = (id: Id, nodes: Node[]): FilterConfig | null => {
  const node = nodes.find((node) => node.filter.id === id);

  if (!node) {
    return null;
  }

  const filter = node.filter;

  if (filter.type === 'equals') {
    const eqFilter: PropertyFilterConfig = {
      id: filter.id,
      type: 'equals',
      property: filter.property,
      value: filter.value
    };

    if (node.invert === 'not') {
      return {
        id: filter.id,
        type: 'not',
        filter: eqFilter
      };
    }

    return eqFilter;
  }

  if (filter.type === 'and' || filter.type === 'or') {
    const childFilters: FilterConfig[] = [];

    const childNodes = nodes.filter((node) => node.parentId === id);

    for (const childNode of childNodes) {
      const childFilter = createFilterConfig(childNode.filter.id, nodes);
      if (childFilter) {
        childFilters.push(childFilter);
      }
    }

    const decorator: AndFilterConfig | OrFilterConfig = {
      id: filter.id,
      type: filter.type,
      filters: childFilters
    };

    if (node.invert === 'not') {
      return {
        id: filter.id,
        type: 'not',
        filter: decorator
      };
    }

    return decorator;
  }

  return null;
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
    setName: (
      state,
      action: PayloadAction<{ name: string; stateKey: StateKey }>
    ) => {
      const activeState = state[action.payload.stateKey];
      activeState.name = action.payload.name;
    },
    setInvert: (
      state,
      action: PayloadAction<{ id: Id; invert: Invert; stateKey: StateKey }>
    ) => {
      const id = action.payload.id;
      const activeState = state[action.payload.stateKey];
      const node = activeState.nodes.find((node) => node.filter.id === id);

      if (!node) {
        return;
      }

      node.invert = action.payload.invert;
    },
    addNode: (
      state,
      action: PayloadAction<{ node: Node; stateKey: StateKey }>
    ) => {
      const activeState = state[action.payload.stateKey];
      activeState.nodes.push(action.payload.node);
    },
    saveFilter: (
      state,
      action: PayloadAction<{
        id: Id;
        filter: PropertyFilterConfig;
        stateKey: StateKey;
      }>
    ) => {
      const id = action.payload.id;
      const activeState = state[action.payload.stateKey];
      const node = activeState.nodes.find((node) => node.filter.id === id);

      if (!node) {
        return;
      }

      node.filter = action.payload.filter;
    },
    setDecoratorType: (
      state,
      action: PayloadAction<{
        id: Id;
        type: DecoratorOption;
        stateKey: StateKey;
      }>
    ) => {
      const id = action.payload.id;
      const activeState = state[action.payload.stateKey];
      const node = activeState.nodes.find((node) => node.filter.id === id);

      if (!node) {
        return;
      }

      node.filter.type = action.payload.type;
    },
    deleteNode: (
      state,
      action: PayloadAction<{ id: Id; stateKey: StateKey }>
    ) => {
      const id = action.payload.id;

      const idsToRemove = new Set<Id>();
      idsToRemove.add(id);

      const activeState = state[action.payload.stateKey];

      const collectDescendantIds = (parentId: Id) => {
        activeState.nodes.forEach((node) => {
          if (node.parentId === parentId) {
            idsToRemove.add(node.filter.id);
            collectDescendantIds(node.filter.id);
          }
        });
      };

      collectDescendantIds(id);

      activeState.nodes = activeState.nodes.filter(
        (node) =>
          !idsToRemove.has(node.filter.id) && !idsToRemove.has(node.parentId)
      );

      if (activeState.nodes.length === 0) {
        activeState.name = '';
      }
    },
    createDefaultRoot: (
      state,
      action: PayloadAction<{ stateKey: StateKey }>
    ) => {
      const activeState = state[action.payload.stateKey];
      activeState.name = '';
      activeState.nodes = [];
      const rootNode = createNode('and', -1);
      const filterNode = createNode('equals', rootNode.filter.id);
      activeState.nodes.push(rootNode);
      activeState.nodes.push(filterNode);
    },
    populateFromView: (
      state,
      action: PayloadAction<{
        filterConfig: FilterConfig;
        name: string;
        stateKey: StateKey;
      }>
    ) => {
      const { filterConfig, name } = action.payload;
      const activeState = state[action.payload.stateKey];

      const nodes: Node[] = [];

      const traverseFilterConfig = (filter: FilterConfig, parentId: Id) => {
        const id = filter.id;

        if (filter.type === 'equals') {
          nodes.push({
            parentId,
            invert: 'is',
            filter: {
              id,
              type: 'equals',
              property: filter.property,
              value: filter.value
            }
          });
        } else if (filter.type === 'and' || filter.type === 'or') {
          nodes.push({
            parentId,
            invert: 'is',
            filter: {
              id,
              type: filter.type,
              filters: []
            }
          });

          filter.filters.forEach((childFilter) =>
            traverseFilterConfig(childFilter, id)
          );
        } else if (filter.type === 'not') {
          nodes.push({
            parentId,
            invert: 'not',
            filter: filter.filter
          });

          traverseFilterConfig(filter.filter, id);
        }
      };

      traverseFilterConfig(filterConfig, -1);

      activeState.name = name;
      activeState.nodes = nodes;
    }
  }
});

export default slice.reducer;
export const {
  setPropertyOptions,
  setModule,
  setName,
  setInvert,
  setDecoratorType,
  addNode,
  saveFilter,
  deleteNode,
  createDefaultRoot,
  populateFromView
} = slice.actions;
