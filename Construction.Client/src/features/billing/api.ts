import { api } from '@/store/api';
import type {
  ProjectBillingApplicationDto,
  CreateBillingApplicationRequest,
} from '@/types';

export const billingApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getBillingApplicationsByProject: builder.query<ProjectBillingApplicationDto[], string>({
      query: (projectId) => `/billing/project/${projectId}`,
      providesTags: ['Billing'],
    }),

    getBillingApplication: builder.query<ProjectBillingApplicationDto, string>({
      query: (id) => `/billing/${id}`,
      providesTags: ['Billing'],
    }),

    createBillingApplication: builder.mutation<
      ProjectBillingApplicationDto,
      CreateBillingApplicationRequest
    >({
      query: (body) => ({ url: '/billing', method: 'POST', body }),
      invalidatesTags: ['Billing', 'Dashboard'],
    }),

    submitBillingApplication: builder.mutation<{ message: string }, string>({
      query: (id) => ({ url: `/billing/${id}/submit`, method: 'POST' }),
      invalidatesTags: ['Billing', 'Approvals'],
    }),

    approveBillingApplication: builder.mutation<
      { message: string },
      { id: string; invoiceNumber: string }
    >({
      query: ({ id, invoiceNumber }) => ({
        url: `/billing/${id}/approve?invoiceNumber=${encodeURIComponent(invoiceNumber)}`,
        method: 'POST',
      }),
      invalidatesTags: ['Billing', 'Dashboard', 'Approvals'],
    }),

    recordPayment: builder.mutation<
      { message: string },
      {
        id: string;
        data: {
          amount: number;
          paymentDate: string;
          paymentMethod: string;
          referenceNumber: string;
          notes?: string;
        };
      }
    >({
      query: ({ id, data }) => ({
        url: `/billing/${id}/payments`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Billing', 'Dashboard'],
    }),

    deleteBillingApplication: builder.mutation<void, string>({
      query: (id) => ({ url: `/billing/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Billing'],
    }),
  }),
});

export const {
  useGetBillingApplicationsByProjectQuery,
  useGetBillingApplicationQuery,
  useCreateBillingApplicationMutation,
  useSubmitBillingApplicationMutation,
  useApproveBillingApplicationMutation,
  useRecordPaymentMutation,
  useDeleteBillingApplicationMutation,
} = billingApi;
