import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface PingResponse {
  message: string;
}

interface InventoryReport {
  total_sensors: number;
  active_sensors: number;
  inactive_sensors: number;
  total_cloud_resources: number;
  monthly_api_usage: number;
}

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api'
  }),
  endpoints: (builder) => ({
    getPing: builder.query<PingResponse, void>({
      query: () => 'ping'
    }),
    getInventory: builder.query<InventoryReport, void>({
      query: () => 'reports/inventory'
    })
  })
});

export const { useGetPingQuery, useGetInventoryQuery } = apiSlice;
