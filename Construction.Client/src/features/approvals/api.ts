import { api } from '@/store/api';
import type {
  ApprovalRequestDto,
  SubmitForApprovalRequest,
  ApproveDecisionRequest,
  RejectDecisionRequest,
} from '@/types';

export const approvalsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPendingApprovalsForMe: builder.query<ApprovalRequestDto[], void>({
      query: () => '/approvals/pending-for-me',
      providesTags: ['Approvals'],
    }),

    getApprovalsByProject: builder.query<ApprovalRequestDto[], string>({
      query: (projectId) => `/approvals/project/${projectId}`,
      providesTags: ['Approvals'],
    }),

    getApprovalById: builder.query<ApprovalRequestDto, string>({
      query: (id) => `/approvals/${id}`,
      providesTags: ['Approvals'],
    }),

    submitApproval: builder.mutation<ApprovalRequestDto, SubmitForApprovalRequest>({
      query: (body) => ({ url: '/approvals/submit', method: 'POST', body }),
      invalidatesTags: ['Approvals'],
    }),

    approveRequest: builder.mutation<{ message: string }, { id: string; data: ApproveDecisionRequest }>({
      query: ({ id, data }) => ({
        url: `/approvals/${id}/approve`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [
        'Approvals',
        'Expenses',
        'MaterialRequests',
        'PurchaseOrders',
        'Billing',
        'CostCodes',
        'Dashboard',
      ],
    }),

    rejectRequest: builder.mutation<{ message: string }, { id: string; data: RejectDecisionRequest }>({
      query: ({ id, data }) => ({
        url: `/approvals/${id}/reject`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Approvals', 'Expenses', 'MaterialRequests', 'PurchaseOrders', 'Dashboard'],
    }),
  }),
});

export const {
  useGetPendingApprovalsForMeQuery,
  useGetApprovalsByProjectQuery,
  useGetApprovalByIdQuery,
  useSubmitApprovalMutation,
  useApproveRequestMutation,
  useRejectRequestMutation,
} = approvalsApi;
