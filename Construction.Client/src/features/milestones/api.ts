import { api } from '@/store/api';
import type {
  MilestoneDto,
  CreateMilestoneDto,
  UpdateMilestoneDto,
  PagedResult,
} from '@/types';

export const milestonesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMilestones: builder.query<
      PagedResult<MilestoneDto>,
      { projectId?: string; page?: number; pageSize?: number }
    >({
      query: ({ projectId, page = 1, pageSize = 10 }) => {
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('pageSize', String(pageSize));
        if (projectId) {
          return `/milestones/project/${projectId}?${params.toString()}`;
        }
        return `/milestones?${params.toString()}`;
      },
      providesTags: ['Milestones'],
    }),

    getMilestone: builder.query<MilestoneDto, string>({
      query: (id) => `/milestones/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Milestones', id }],
    }),

    createMilestone: builder.mutation<MilestoneDto, CreateMilestoneDto>({
      query: (body) => ({ url: '/milestones', method: 'POST', body }),
      invalidatesTags: ['Milestones', 'Projects'],
    }),

    updateMilestone: builder.mutation<MilestoneDto, { id: string; data: UpdateMilestoneDto }>({
      query: ({ id, data }) => ({ url: `/milestones/${id}`, method: 'PUT', body: data }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Milestones', id }, 'Milestones'],
    }),

    deleteMilestone: builder.mutation<void, string>({
      query: (id) => ({ url: `/milestones/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Milestones', 'Projects'],
    }),

    completeMilestone: builder.mutation<MilestoneDto, string>({
      query: (id) => ({ url: `/milestones/${id}/complete`, method: 'POST' }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Milestones', id }, 'Milestones'],
    }),

    markPaymentReceived: builder.mutation<MilestoneDto, string>({
      query: (id) => ({ url: `/milestones/${id}/payment-received`, method: 'POST' }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Milestones', id }, 'Milestones'],
    }),
  }),
});

export const {
  useGetMilestonesQuery,
  useGetMilestoneQuery,
  useCreateMilestoneMutation,
  useUpdateMilestoneMutation,
  useDeleteMilestoneMutation,
  useCompleteMilestoneMutation,
  useMarkPaymentReceivedMutation,
} = milestonesApi;
