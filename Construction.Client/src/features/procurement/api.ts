import { api } from '@/store/api';
import type {
  ProcurementRequestDto,
  CreateProcurementRequest,
  UpdateProcurementRequest,
} from '@/types';

export const procurementApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProcurementRequestsByProject: builder.query<ProcurementRequestDto[], string>({
      query: (projectId) => `/procurement/project/${projectId}`,
      providesTags: ['Procurement'],
    }),

    getProcurementRequest: builder.query<ProcurementRequestDto, string>({
      query: (id) => `/procurement/${id}`,
      providesTags: ['Procurement'],
    }),

    createProcurementRequest: builder.mutation<ProcurementRequestDto, CreateProcurementRequest>({
      query: (body) => ({ url: '/procurement', method: 'POST', body }),
      invalidatesTags: ['Procurement', 'Dashboard'],
    }),

    updateProcurementRequest: builder.mutation<ProcurementRequestDto, { id: string; data: UpdateProcurementRequest }>({
      query: ({ id, data }) => ({ url: `/procurement/${id}`, method: 'PUT', body: data }),
      invalidatesTags: ['Procurement'],
    }),

    submitProcurementRequest: builder.mutation<{ message: string }, string>({
      query: (id) => ({ url: `/procurement/${id}/submit`, method: 'POST' }),
      invalidatesTags: ['Procurement', 'Approvals'],
    }),

    deleteProcurementRequest: builder.mutation<void, string>({
      query: (id) => ({ url: `/procurement/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Procurement'],
    }),
  }),
});

export const {
  useGetProcurementRequestsByProjectQuery,
  useGetProcurementRequestQuery,
  useCreateProcurementRequestMutation,
  useUpdateProcurementRequestMutation,
  useSubmitProcurementRequestMutation,
  useDeleteProcurementRequestMutation,
} = procurementApi;
