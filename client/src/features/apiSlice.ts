import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Category, Item } from "./categoryDataSlice";

interface PingResponse {
	message: string;
}

interface CategoryList {
	id: number;
	name: string;
	item_shape: Record<string, unknown>;
	count: number;
}

interface CategoryResponse {
	success: boolean; // true/false if the category was added successfully in backend/server
	data: Category; // added Category object
}

interface ItemResponse {
	success: boolean;
	data: Item;
}

export const apiSlice = createApi({
	reducerPath: "api",
	baseQuery: fetchBaseQuery({
		baseUrl: "/api",
	}),
	endpoints: (builder) => ({
		getPing: builder.query<PingResponse, void>({
			query: () => "ping",
		}),
		getCategories: builder.query<CategoryList, void>({
			query: () => "manage/categories",
		}),
		//mutation used for POST requests to server/backend.
		//CategoryResponse = expected response from server/backend
		//Category = category_name to be sent to server/backend
		addCategory: builder.mutation<CategoryResponse, Category>({
			query: (category) => ({
				url: "manage/categories",
				method: "POST",
				body: category,
			}),
		}),
		addItem: builder.mutation<ItemResponse, Item>({
			query: (item) => ({
				url: "manage/items",
				method: "POST",
				body: item,
			}),
		}),
	}),
});

export const {
	useGetPingQuery,
	useGetCategoriesQuery,
	useAddCategoryMutation,
	useAddItemMutation,
} = apiSlice;
