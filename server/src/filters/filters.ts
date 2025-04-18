import { Item } from '../../../shared/types';

interface Filter {
  apply(items: Item[]): Item[];
  getDescription(): string;
}

class PropertyFilter implements Filter {
  constructor(
    private property: string,
    private value: string
  ) {}

  apply(items: Item[]): Item[] {
    return items.filter(
      (item) =>
        item.item_data[this.property] &&
        item.item_data[this.property] === this.value
    );
  }

  getDescription(): string {
    return `${this.property} is "${this.value}"`;
  }
}

class AndFilter implements Filter {
  constructor(private filters: Filter[]) {}

  apply(items: Item[]): Item[] {
    return this.filters.reduce((result, filter) => filter.apply(result), items);
  }

  getDescription(): string {
    return `${this.filters.map((filter) => filter.getDescription()).join(' AND ')}`;
  }
}

class OrFilter implements Filter {
  constructor(private filters: Filter[]) {}

  apply(items: Item[]): Item[] {
    return items.filter((item) => {
      this.filters.some((filter) => {
        if (filter.apply([item]).length !== 0) {
          return true;
        }
      });
    });
  }

  getDescription(): string {
    return `${this.filters.map((filter) => filter.getDescription()).join(' OR ')}`;
  }
}

const supportedFilterTypes = ['equals', 'and', 'or'];

export { Filter, PropertyFilter, AndFilter, OrFilter, supportedFilterTypes };
