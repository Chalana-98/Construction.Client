import { api } from '@/store/api';
import type {
  PhysicalProgressRecordDto,
  CreatePhysicalProgressRequest,
  UpdatePhysicalProgressRequest,
  ProjectProgressSummaryDto,
} from '@/types';

export const physicalProgressApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProgressByProject: builder.query<PhysicalProgressRecordDto[], string>({
      query: (projectId) => `/physical-progress/project/${projectId}`,
      providesTags: ['PhysicalProgress'],
    }),

    getProjectProgressSummary: builder.query<ProjectProgressSummaryDto, string>({
      query: (projectId) => `/physical-progress/project/${projectId}/summary`,
      providesTags: ['PhysicalProgress', 'Wbs', 'Schedule', 'Dashboard'],
    }),

    logProgress: builder.mutation<PhysicalProgressRecordDto, CreatePhysicalProgressRequest>({
      query: (body) => ({ url: '/physical-progress', method: 'POST', body }),
      invalidatesTags: ['PhysicalProgress', 'Wbs', 'Schedule', 'Dashboard'],
    }),

    updateProgress: builder.mutation<PhysicalProgressRecordDto, { id: string; data: UpdatePhysicalProgressRequest }>({
      query: ({ id, data }) => ({ url: `/physical-progress/${id}`, method: 'PUT', body: data }),
      invalidatesTags: ['PhysicalProgress', 'Wbs', 'Schedule', 'Dashboard'],
    }),

    deleteProgress: builder.mutation<void, string>({
      query: (id) => ({ url: `/physical-progress/${id}`, method: 'DELETE' }),
      invalidatesTags: ['PhysicalProgress', 'Wbs', 'Dashboard'],
    }),
  }),
});

export const {
  useGetProgressByProjectQuery,
  useGetProjectProgressSummaryQuery,
  useLogProgressMutation,
  useUpdateProgressMutation,
  useDeleteProgressMutation,
} = physicalProgressApi;
