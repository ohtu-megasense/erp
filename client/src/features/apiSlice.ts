import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
	AddCategoryRequest,
	AddCategoryResponse,
	Category,
	Item,
	AddItemResponse,
	PingResponse,
	//ATTEMPT TO ADD ENDPOINT FOR ADDING COLUMN STARTS
	AddColumnRequest,
	AddColumnResponse,
	renameCategoryRequest,
	renameCategoryResponse,
	//ATTEMPT TO ADD ENDPOINT FOR ADDING COLUMN STARTS
	UpdateItemRequest,
	UpdateItemResponse,
} from "../../../shared/types";
import { addNotification } from "./notificationSlice";

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
			query: (module) => ({
				url: "manage/categories",
				method: "GET",
				module: module,
			}),
			providesTags: ["Category"],
		}),
		//mutation used for POST requests to server/backend.
		//CategoryResponse = expected response from server/backend
		//Category = category_name to be sent to server/backend
		addCategory: builder.mutation<AddCategoryResponse, AddCategoryRequest>({
			query: ({name, itemShape, module}) => ({
				url: "manage/categories",
				method: "POST",
				body: {name, itemShape, module},
			}),
			invalidatesTags: ["Category"],
			async onQueryStarted(_, mutationLifeCycleApi) {
				try {
					await mutationLifeCycleApi.queryFulfilled;

					mutationLifeCycleApi.dispatch(
						addNotification({
							id: crypto.randomUUID(),
							message: `New category created`,
							severity: "info",
						}),
					);
				} catch (error: unknown) {
					const err = error as { error?: { data?: { error?: string } } };
					mutationLifeCycleApi.dispatch(
						addNotification({
							id: crypto.randomUUID(),
							message: `Failed to add category: ${err.error?.data?.error ?? "Unknown error"}.`,
							severity: "error",
						}),
					);
				}
			},
		}),
		renameCategory: builder.mutation<
			renameCategoryResponse,
			renameCategoryRequest
		>({
			query: ({ categoryId, itemShape, categoryName }) => ({
				url: `manage/categories/${categoryId}`,
				method: "PUT",
				body: { itemShape, categoryName },
			}),
			invalidatesTags: ["Category"],
		}),
		addItem: builder.mutation<AddItemResponse, Item>({
			query: (item) => ({
				url: "items",
				method: "POST",
				body: item,
			}),
			invalidatesTags: ["Item", "Category"],
		}),
		deleteItem: builder.mutation<AddItemResponse, number>({
			query: (id) => ({
				url: `items/${id}`,
				method: "DELETE",
				body: id,
			}),
			invalidatesTags: ["Item", "Category"],
			async onQueryStarted(id, { dispatch, queryFulfilled }) {
				try {
					await queryFulfilled;
					dispatch(
						addNotification({
							id: crypto.randomUUID(),
							message: `Item #${id} successfully deleted`,
							severity: "success",
						}),
					);
				} catch (error: unknown) {
					const err = error as { error?: { data?: { error?: string } } };
					dispatch(
						addNotification({
							id: crypto.randomUUID(),
							message: `Failed to delete item: ${err.error?.data?.error ?? "Unknown error"}`,
							severity: "error",
						}),
					);
				}
			},
		}),
		updateItem: builder.mutation<UpdateItemResponse, UpdateItemRequest>({
			query: ({ categoryId, itemId, updatedItem }) => ({
				url: `items/${itemId}`,
				method: "PUT",
				body: {
					categoryId,
					data: updatedItem,
				},
			}),
			invalidatesTags: ["Item", "Category"],
			async onQueryStarted({ itemId }, { dispatch, queryFulfilled }) {
				try {
					await queryFulfilled;
					dispatch(
						addNotification({
							id: crypto.randomUUID(),
							message: `Item #${itemId} updated successfully`,
							severity: "success",
						}),
					);
				} catch (error: unknown) {
					const err = error as { error?: { data?: { error?: string } } };
					dispatch(
						addNotification({
							id: crypto.randomUUID(),
							message: `Failed to update item: ${err.error?.data?.error ?? "Unknown error"}`,
							severity: "error",
						}),
					);
				}
			},
		}),
		addColumn: builder.mutation<AddColumnResponse, AddColumnRequest>({
			query: ({ categoryId, itemShape, categoryName }) => ({
				url: `manage/categories/${categoryId}`,
				method: "PUT",
				body: { itemShape, categoryName },
			}),
			invalidatesTags: ["Category"],
			async onQueryStarted({ itemShape }, { dispatch, queryFulfilled }) {
				try {
					await queryFulfilled;
					dispatch(
						addNotification({
							id: crypto.randomUUID(),
							message: `Column "${Object.keys(itemShape)[Object.keys(itemShape).length - 1]}" added successfully`,
							severity: "info",
						}),
					);
				} catch (error: unknown) {
					const err = error as { error?: { data?: { error?: string } } };
					dispatch(
						addNotification({
							id: crypto.randomUUID(),
							message: `Failed to add column: ${err.error?.data?.error ?? "Unknown error"}`,
							severity: "error",
						}),
					);
				}
			},
		}),
	}),
});

export const {
	useGetPingQuery,
	useGetCategoriesQuery,
	useAddCategoryMutation,
	useAddItemMutation,
	useDeleteItemMutation,
	useAddColumnMutation,
	useUpdateItemMutation,
	useRenameCategoryMutation,
} = apiSlice;
