import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface PingResponse {
  message: string;
}

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api'
  }),
  endpoints: (builder) => ({
    getPing: builder.query<PingResponse, void>({
      query: () => 'ping'
    })
  })
});

export const { useGetPingQuery } = apiSlice;
