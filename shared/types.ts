export interface AddCategoryRequest {
  name: string;
  module: string;
  itemShape: Record<string, string | number>;
}

export interface AddCategoryResponse {
  id: number;
  name: string;
  itemShape: Record<string, string | number>;
}

export interface Module {
  module: string;
}

export interface renameCategoryRequest {
  categoryId: number;
  itemShape: Record<string, string | number>;
  categoryName: string;
}

export interface renameCategoryResponse {
  success: boolean;
  name: string;
}

export interface DeleteCategoryRequest {
  categoryId: number;
}

export interface DeleteCategoryResponse {
  categoryName: string;
}

export interface AddItemResponse {
  success: boolean;
  data: Item;
}

export interface PingResponse {
  message: string;
}

export type GetCategoriesResponse = Category[];

export interface Category {
  id: number;
  name: string;
  itemShape: Record<string, string | number>;
  items: Item[];
}

export interface Item {
  id: number;
  item_data: Record<string, string | number>;
}

export interface AddColumnRequest {
  categoryId: number;
  itemShape: Record<string, string | number>;
  categoryName: string;
}

export interface AddColumnResponse {
  success: boolean;
  updatedCategory: Category;
}

export interface UpdateItemRequest {
  categoryId: number;
  itemId: number;
  updatedItem: Record<string, string | number>;
}

export interface UpdateItemResponse {
  id: number;
  categoryId: number;
  data: Record<string, string | number>;
}

// For Views and Filters:

export interface BaseFilterConfig {
  id: string | number;
  type: string;
}

export interface PropertyFilterConfig extends BaseFilterConfig {
  type: "equals";
  property: string;
  value: string;
}

export interface AndFilterConfig extends BaseFilterConfig {
  type: "and";
  filters: FilterConfig[];
}

export type FilterConfig = PropertyFilterConfig | AndFilterConfig;

export interface ViewConfig {
  name: string;
  module: string;
  filterConfig: FilterConfig;
}

export const moduleOptions = {
  Inventory: "inventory",
  CRM: "crm",
} as const;
export type ModuleOption = (typeof moduleOptions)[keyof typeof moduleOptions];
export type View = Omit<Category, "itemShape">;
export type CreateViewRequest = ViewConfig;
export type CreateViewResponse = object;
export type GetViewsRequest = ModuleOption;
export type GetViewsResponse = View[];
