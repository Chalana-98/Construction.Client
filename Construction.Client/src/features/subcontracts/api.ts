import { api } from '@/store/api';
import type {
  SubcontractDto,
  CreateSubcontractRequest,
  CreateSubcontractPaymentRequest,
  CreateSubcontractChangeOrderRequest,
} from '@/types';

export const subcontractsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSubcontractsByProject: builder.query<SubcontractDto[], string>({
      query: (projectId) => `/subcontracts/project/${projectId}`,
      providesTags: ['Subcontracts'],
    }),

    getSubcontract: builder.query<SubcontractDto, string>({
      query: (id) => `/subcontracts/${id}`,
      providesTags: ['Subcontracts'],
    }),

    createSubcontract: builder.mutation<SubcontractDto, CreateSubcontractRequest>({
      query: (body) => ({ url: '/subcontracts', method: 'POST', body }),
      invalidatesTags: ['Subcontracts', 'CostCodes', 'Dashboard'],
    }),

    recordSubcontractPayment: builder.mutation<
      { message: string },
      {
        id: string;
        data: CreateSubcontractPaymentRequest;
      }
    >({
      query: ({ id, data }) => ({
        url: `/subcontracts/${id}/payments`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Subcontracts', 'CostCodes', 'Dashboard'],
    }),

    addSubcontractChangeOrder: builder.mutation<
      { message: string },
      {
        id: string;
        data: CreateSubcontractChangeOrderRequest;
      }
    >({
      query: ({ id, data }) => ({
        url: `/subcontracts/${id}/change-orders`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Subcontracts', 'CostCodes'],
    }),

    approveSubcontractChangeOrder: builder.mutation<
      { message: string },
      { id: string; changeOrderId: string }
    >({
      query: ({ id, changeOrderId }) => ({
        url: `/subcontracts/${id}/change-orders/${changeOrderId}/approve`,
        method: 'POST',
      }),
      invalidatesTags: ['Subcontracts', 'CostCodes', 'Dashboard'],
    }),

    deleteSubcontract: builder.mutation<void, string>({
      query: (id) => ({ url: `/subcontracts/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Subcontracts', 'CostCodes'],
    }),
  }),
});

export const {
  useGetSubcontractsByProjectQuery,
  useGetSubcontractQuery,
  useCreateSubcontractMutation,
  useRecordSubcontractPaymentMutation,
  useAddSubcontractChangeOrderMutation,
  useApproveSubcontractChangeOrderMutation,
  useDeleteSubcontractMutation,
} = subcontractsApi;
