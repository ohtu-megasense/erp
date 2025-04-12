import { Filter } from './filters'
import { FilterFactory } from './filterFactory';
import logger from '../utils/logger';


export const generateFilterFromConfig = (config: any): Filter | undefined => {
  if (!config) return undefined;
  
  switch (config.type) {
    case 'equals':
      return FilterFactory.equals(config.property, config.value);
    case 'and': {
      if (!Array.isArray(config.filters)) throw new Error('AND requires array of filters');
      const andFilters = config.filters.map(filterConfig => generateFilterFromConfig(filterConfig)).filter(Boolean) as Filter[];
      return FilterFactory.and(...andFilters);
    }
    default:
      throw new Error(`Unknown filter type: ${config.type}`);
  }
};


