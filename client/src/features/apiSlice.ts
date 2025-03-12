
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Category, Item } from './categoryDataSlice';


interface PingResponse {
  message: string;
}

interface ItemResponse {
  success: boolean;
  data: Item;
}
export interface Item {
	id: number;
	data: Record<string, string>;
}

export interface Category {
	id: number;
	name: string;
	itemShape: Record<string, string>;
	items: Item[];
}

export const apiSlice = createApi({

	reducerPath: "api",
	baseQuery: fetchBaseQuery({
		baseUrl: "/api",
	}),
	tagTypes: ["Category", "Item"],
	endpoints: (builder) => ({
		getPing: builder.query<PingResponse, void>({
			query: () => "ping",
		}),
		getCategories: builder.query<Category[], void>({
			query: () => "manage/categories",
			providesTags: ["Category"],
		}),
		//mutation used for POST requests to server/backend.
		//CategoryResponse = expected response from server/backend
		//Category = category_name to be sent to server/backend
		addCategory: builder.mutation<Category, Category>({
			query: (category) => ({
				url: "manage/categories",
				method: "POST",
				body: category,
			}),
			invalidatesTags: ["Category"],
		}),
		addItem: builder.mutation<ItemResponse, Item>({
			query: (item) => ({
				url: "manage/items",
				method: "POST",
				body: item,
			}),
			invalidatesTags: ["Item"],
		}),
       deleteItem: builder.mutation<ItemResponse, number>({
      query: (id) => ({
        url: `items/${id}`,
        method: 'DELETE',
        body: id
        }),
      }),
	}),
});

export const {
  useGetPingQuery,
  useGetInventoryQuery,
  useAddCategoryMutation,
  useAddItemMutation,
  useDeleteItemMutation

});
} = apiSlice;
