interface Filter {
  apply(items: any[]): any[];
  getDescription(): string;
}

class PropertyFilter implements Filter {
  constructor(
    private property: string,
    private value: string
  ) {}

  apply(items: any[]): any[] {
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

  apply(items: any[]): any[] {
    return this.filters.reduce((result, filter) => filter.apply(result), items);
  }

  getDescription(): string {
    return `${this.filters.map((filter) => filter.getDescription()).join(' AND ')}`;
  }
}

export { Filter, PropertyFilter, AndFilter };
