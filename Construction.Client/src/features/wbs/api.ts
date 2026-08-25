import { api } from '@/store/api';
import type { WbsNodeDto, CreateWbsNodeRequest, UpdateWbsNodeRequest } from '@/types';

export const wbsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getWbsTreeByProject: builder.query<WbsNodeDto[], string>({
      query: (projectId) => `/wbs/project/${projectId}/tree`,
      providesTags: ['Wbs'],
    }),

    getFlatWbsByProject: builder.query<WbsNodeDto[], string>({
      query: (projectId) => `/wbs/project/${projectId}`,
      providesTags: ['Wbs'],
    }),

    getWbsNode: builder.query<WbsNodeDto, string>({
      query: (id) => `/wbs/${id}`,
      providesTags: ['Wbs'],
    }),

    createWbsNode: builder.mutation<WbsNodeDto, CreateWbsNodeRequest>({
      query: (body) => ({ url: '/wbs', method: 'POST', body }),
      invalidatesTags: ['Wbs'],
    }),

    updateWbsNode: builder.mutation<WbsNodeDto, { id: string; data: UpdateWbsNodeRequest }>({
      query: ({ id, data }) => ({ url: `/wbs/${id}`, method: 'PUT', body: data }),
      invalidatesTags: ['Wbs'],
    }),

    updateWbsProgress: builder.mutation<void, { id: string; progressPercentage: number }>({
      query: ({ id, progressPercentage }) => ({
        url: `/wbs/${id}/progress`,
        method: 'PATCH',
        body: progressPercentage,
      }),
      invalidatesTags: ['Wbs', 'Dashboard'],
    }),

    deleteWbsNode: builder.mutation<void, string>({
      query: (id) => ({ url: `/wbs/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Wbs'],
    }),
  }),
});

export const {
  useGetWbsTreeByProjectQuery,
  useGetFlatWbsByProjectQuery,
  useGetWbsNodeQuery,
  useCreateWbsNodeMutation,
  useUpdateWbsNodeMutation,
  useUpdateWbsProgressMutation,
  useDeleteWbsNodeMutation,
} = wbsApi;
