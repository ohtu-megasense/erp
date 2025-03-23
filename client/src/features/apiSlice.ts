import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  AddCategoryRequest,
  AddCategoryResponse,
  Category,
  Item,
  AddItemResponse,
  PingResponse,
  //ATTEMPT TO ADD ENDPOINT FOR ADDING COLUMN STARTS
  AddColumnRequest,
  AddColumnResponse
  //ATTEMPT TO ADD ENDPOINT FOR ADDING COLUMN STARTS
} from '../../../shared/types';
import { addNotification } from './notificationSlice';

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
        }  catch (error: unknown) {
          const err = error as { error?: { data?: { error?: string } } };
          mutationLifeCycleApi.dispatch(
            addNotification({
              id: crypto.randomUUID(),
              message: `Failed to add category: ${err.error?.data?.error ?? 'Unknown error'}.`,
              severity: 'error'
            })
          );
        }
      }
    }),
    addItem: builder.mutation<AddItemResponse, Item>({
      query: (item) => ({
        url: 'items',
        method: 'POST',
        body: item
      }),
      invalidatesTags: ['Item', 'Category']
    }),
    deleteItem: builder.mutation<AddItemResponse, number>({
      query: (id) => ({
        url: `items/${id}`,
        method: 'DELETE',
        body: id
      }),
      invalidatesTags: ['Item', 'Category']
    }),
    addColumn: builder.mutation<AddColumnResponse, AddColumnRequest>({
      query: ({ categoryId, columnName }) => ({
        url: `manage/categories/${categoryId}/columns`, 
        method: 'POST', 
        body: { columnName }
      }),
      invalidatesTags: ['Category'],
      async onQueryStarted({ columnName }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            addNotification({
              id: crypto.randomUUID(),
              message: `Column "${columnName}" added successfully`,
              severity: 'info'
            })
          );
        } catch (error: unknown) {
          const err = error as { error?: { data?: { error?: string } } };
          dispatch(
            addNotification({
              id: crypto.randomUUID(),
              message: `Failed to add column: ${err.error?.data?.error ?? 'Unknown error'}`,
              severity: 'error'
            })
          );
        }
      }
    })
  })
});

export const {
  useGetPingQuery,
  useGetCategoriesQuery,
  useAddCategoryMutation,
  useAddItemMutation,
  useDeleteItemMutation,
  useAddColumnMutation
} = apiSlice;
