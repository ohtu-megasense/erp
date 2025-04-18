import { Filter, PropertyFilter, AndFilter, OrFilter } from './filters';

export class FilterFactory {
  static equals(property: string, value: string): Filter {
    return new PropertyFilter(property, value);
  }
  static and(...filters: Filter[]): Filter {
    return new AndFilter(filters);
  }
  static or(...filters: Filter[]): Filter {
    return new OrFilter(filters);
  }
}
