export interface AddCategoryRequest {
	name: string;
	module: string;
	itemShape: Record<string, string>;
}

export interface AddCategoryResponse {
	id: number;
	name: string;
	module: string;
	itemShape: Record<string, string>;
}

export interface renameCategoryRequest {
	categoryId: number;
	itemShape: Record<string, string>;
	categoryName: string;
}

export interface renameCategoryResponse {
	success: boolean;
	name: string;
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
	itemShape: Record<string, string>;
	items: Item[];
}

export interface Item {
	id: number;
	data: Record<string, string>;
}

export interface AddColumnRequest {
	categoryId: number;
	itemShape: Record<string, string>;
	categoryName: string;
}

export interface AddColumnResponse {
	success: boolean;
	updatedCategory: Category;
}

export interface UpdateItemRequest {
	categoryId: number;
	itemId: number;
	updatedItem: Record<string, string>;
}

export interface UpdateItemResponse {
	id: number;
	categoryId: number;
	data: Record<string, string>;
}
