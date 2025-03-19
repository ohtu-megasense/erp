import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AddCategoryRequest, AddCategoryResponse } from '../../../shared/types';
import { addNotification } from './notificationSlice';

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
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api'
  }),
  tagTypes: ['Category', 'Item'],
  endpoints: (builder) => ({
    getPing: builder.query<PingResponse, void>({
      query: () => 'ping'
    }),
    getCategories: builder.query<Category[], void>({
      query: () => 'manage/categories',
      providesTags: ['Category']
    }),
    //mutation used for POST requests to server/backend.
    //CategoryResponse = expected response from server/backend
    //Category = category_name to be sent to server/backend
    addCategory: builder.mutation<AddCategoryResponse, AddCategoryRequest>({
      query: (category) => ({
        url: 'manage/categories',
        method: 'POST',
        body: category
      }),
      invalidatesTags: ['Category'],
      async onQueryStarted(_, mutationLifeCycleApi) {
        try {
          await mutationLifeCycleApi.queryFulfilled;

          mutationLifeCycleApi.dispatch(
            addNotification({
              id: crypto.randomUUID(),
              message: `New category created`,
              severity: 'info'
            })
          );
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          mutationLifeCycleApi.dispatch(
            addNotification({
              id: crypto.randomUUID(),
              message: `Failed to add category: ${error.error.data.error}.`,
              severity: 'error'
            })
          );
        }
      }
    }),
    addItem: builder.mutation<ItemResponse, Item>({
      query: (item) => ({
        url: 'items',
        method: 'POST',
        body: item
      }),
      invalidatesTags: ['Item', 'Category']
    }),
    deleteItem: builder.mutation<ItemResponse, number>({
      query: (id) => ({
        url: `items/${id}`,
        method: 'DELETE',
        body: id
      }),
      invalidatesTags: ['Item', 'Category']
    })
  })
});

export const {
  useGetPingQuery,
  useGetCategoriesQuery,
  useAddCategoryMutation,
  useAddItemMutation,
  useDeleteItemMutation
} = apiSlice;
