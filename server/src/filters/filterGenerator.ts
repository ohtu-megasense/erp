import { Filter, supportedFilterTypes } from './filters';
import { FilterFactory } from './filterFactory';
import { FilterConfig } from '../../../shared/types';

export const generateFilterFromConfig = (config: FilterConfig | undefined): Filter | undefined => {
  if (!config) return undefined;

  if (!supportedFilterTypes.includes(config.type)) {
    throw new Error(`Unknown filter type: ${config.type}`)
  }

  switch (config.type) {
    case 'equals':
      return FilterFactory.equals(config.property, config.value);
    case 'and': {
      if (!Array.isArray(config.filters))
        throw new Error('AND requires array of filters');
      const andFilters = config.filters
        .map((filterConfig) => generateFilterFromConfig(filterConfig))
        .filter(Boolean) as Filter[];
      return FilterFactory.and(...andFilters);
    }
  }
};
