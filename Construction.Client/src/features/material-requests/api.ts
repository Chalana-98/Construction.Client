import { api } from '@/store/api';
import type {
  MaterialRequestDto,
  CreateMaterialRequest,
} from '@/types';

export const materialRequestsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMaterialRequestsByProject: builder.query<MaterialRequestDto[], string>({
      query: (projectId) => `/materialrequests/project/${projectId}`,
      providesTags: ['MaterialRequests'],
    }),

    getMaterialRequest: builder.query<MaterialRequestDto, string>({
      query: (id) => `/materialrequests/${id}`,
      providesTags: ['MaterialRequests'],
    }),

    createMaterialRequest: builder.mutation<MaterialRequestDto, CreateMaterialRequest>({
      query: (body) => ({ url: '/materialrequests', method: 'POST', body }),
      invalidatesTags: ['MaterialRequests', 'Dashboard'],
    }),

    submitMaterialRequest: builder.mutation<{ message: string }, string>({
      query: (id) => ({ url: `/materialrequests/${id}/submit`, method: 'POST' }),
      invalidatesTags: ['MaterialRequests', 'Approvals'],
    }),

    approveMaterialRequest: builder.mutation<{ message: string }, string>({
      query: (id) => ({ url: `/materialrequests/${id}/approve`, method: 'POST' }),
      invalidatesTags: ['MaterialRequests', 'Approvals'],
    }),

    issueMaterialRequest: builder.mutation<
      { message: string },
      { id: string; issuedItems: { materialRequestItemId: string; quantityIssued: number }[] }
    >({
      query: ({ id, issuedItems }) => ({
        url: `/materialrequests/${id}/issue`,
        method: 'POST',
        body: issuedItems,
      }),
      invalidatesTags: ['MaterialRequests', 'Inventory', 'CostCodes', 'Materials', 'Dashboard'],
    }),

    deleteMaterialRequest: builder.mutation<void, string>({
      query: (id) => ({ url: `/materialrequests/${id}`, method: 'DELETE' }),
      invalidatesTags: ['MaterialRequests'],
    }),
  }),
});

export const {
  useGetMaterialRequestsByProjectQuery,
  useGetMaterialRequestQuery,
  useCreateMaterialRequestMutation,
  useSubmitMaterialRequestMutation,
  useApproveMaterialRequestMutation,
  useIssueMaterialRequestMutation,
  useDeleteMaterialRequestMutation,
} = materialRequestsApi;
