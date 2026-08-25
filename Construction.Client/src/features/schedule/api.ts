import { api } from '@/store/api';
import type {
  ScheduleActivityDto,
  CreateScheduleActivityRequest,
  UpdateScheduleActivityRequest,
  ProjectGanttChartDto,
} from '@/types';

export const scheduleApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getScheduleActivities: builder.query<ScheduleActivityDto[], string>({
      query: (projectId) => `/schedule/project/${projectId}`,
      providesTags: ['Schedule'],
    }),

    getGanttChartData: builder.query<ProjectGanttChartDto, string>({
      query: (projectId) => `/schedule/project/${projectId}/gantt`,
      providesTags: ['Schedule', 'Wbs', 'Dashboard'],
    }),

    createActivity: builder.mutation<ScheduleActivityDto, CreateScheduleActivityRequest>({
      query: (body) => ({ url: '/schedule', method: 'POST', body }),
      invalidatesTags: ['Schedule', 'Wbs', 'Dashboard'],
    }),

    updateActivity: builder.mutation<ScheduleActivityDto, { id: string; data: UpdateScheduleActivityRequest }>({
      query: ({ id, data }) => ({ url: `/schedule/${id}`, method: 'PUT', body: data }),
      invalidatesTags: ['Schedule', 'Wbs', 'Dashboard'],
    }),

    addDependency: builder.mutation<
      { message: string },
      { predecessorId: string; successorId: string }
    >({
      query: ({ predecessorId, successorId }) => ({
        url: `/schedule/dependencies?predecessorId=${predecessorId}&successorId=${successorId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Schedule'],
    }),

    deleteActivity: builder.mutation<void, string>({
      query: (id) => ({ url: `/schedule/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Schedule'],
    }),
  }),
});

export const {
  useGetScheduleActivitiesQuery,
  useGetGanttChartDataQuery,
  useCreateActivityMutation,
  useUpdateActivityMutation,
  useAddDependencyMutation,
  useDeleteActivityMutation,
} = scheduleApi;
