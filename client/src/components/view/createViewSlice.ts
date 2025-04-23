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

export interface Node {
  parentId: Id;
  filter: FilterConfig;
  invert: Invert;
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
    setName: (state, action: PayloadAction<{ name: string }>) => {
      state.name = action.payload.name;
    },
    setInvert: (state, action: PayloadAction<{ id: Id; invert: Invert }>) => {
      const id = action.payload.id;
      const node = state.nodes.find((node) => node.filter.id === id);

      if (!node) {
        return;
      }

      node.invert = action.payload.invert;
    },
    addNode: (state, action: PayloadAction<{ node: Node }>) => {
      state.nodes.push(action.payload.node);
    },
    saveFilter: (
      state,
      action: PayloadAction<{ id: Id; filter: PropertyFilterConfig }>
    ) => {
      const id = action.payload.id;
      const node = state.nodes.find((node) => node.filter.id === id);

      if (!node) {
        return;
      }

      node.filter = action.payload.filter;
    },
    setDecoratorType: (
      state,
      action: PayloadAction<{ id: Id; type: DecoratorOption }>
    ) => {
      const id = action.payload.id;
      const node = state.nodes.find((node) => node.filter.id === id);

      if (!node) {
        return;
      }

      node.filter.type = action.payload.type;
    },
    deleteNode: (state, action: PayloadAction<{ id: Id }>) => {
      const id = action.payload.id;

      const idsToRemove = new Set<Id>();
      idsToRemove.add(id);

      const collectDescendantIds = (parentId: Id) => {
        state.nodes.forEach((node) => {
          if (node.parentId === parentId) {
            idsToRemove.add(node.filter.id);
            collectDescendantIds(node.filter.id);
          }
        });
      };

      collectDescendantIds(id);

      state.nodes = state.nodes.filter(
        (node) =>
          !idsToRemove.has(node.filter.id) && !idsToRemove.has(node.parentId)
      );

      if (state.nodes.length === 0) {
        state.name = '';
      }
    },
    reset: (state) => {
      state.name = '';
      state.nodes = [];
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
  reset
} = slice.actions;
