import { Item } from "../../../shared/types";

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

const supportedFilterTypes = ['equals', 'and'];

export { Filter, PropertyFilter, AndFilter, supportedFilterTypes };
