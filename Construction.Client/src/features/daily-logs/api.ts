import { api } from '@/store/api';
import type {
  DailyLogDto,
  DailyLogListDto,
  CreateDailyLogDto,
  UpdateDailyLogDto,
  PagedResult,
} from '@/types';

export const dailyLogsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDailyLogs: builder.query<
      PagedResult<DailyLogListDto>,
      { projectId?: string; page?: number; pageSize?: number; startDate?: string; endDate?: string }
    >({
      query: ({ projectId, page = 1, pageSize = 10, startDate, endDate }) => {
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('pageSize', String(pageSize));
        if (projectId) params.set('projectId', projectId);
        if (startDate) params.set('startDate', startDate);
        if (endDate) params.set('endDate', endDate);
        return `/dailylogs?${params.toString()}`;
      },
      providesTags: ['DailyLogs'],
    }),

    getDailyLog: builder.query<DailyLogDto, string>({
      query: (id) => `/dailylogs/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'DailyLogs', id }],
    }),

    createDailyLog: builder.mutation<DailyLogDto, CreateDailyLogDto>({
      query: (body) => ({ url: '/dailylogs', method: 'POST', body }),
      invalidatesTags: ['DailyLogs'],
    }),

    updateDailyLog: builder.mutation<DailyLogDto, { id: string; data: UpdateDailyLogDto }>({
      query: ({ id, data }) => ({ url: `/dailylogs/${id}`, method: 'PUT', body: data }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'DailyLogs', id }, 'DailyLogs'],
    }),

    deleteDailyLog: builder.mutation<void, string>({
      query: (id) => ({ url: `/dailylogs/${id}`, method: 'DELETE' }),
      invalidatesTags: ['DailyLogs'],
    }),

    approveDailyLog: builder.mutation<DailyLogDto, string>({
      query: (id) => ({ url: `/dailylogs/${id}/approve`, method: 'PUT' }),
      invalidatesTags: (_result, _error, id) => [{ type: 'DailyLogs', id }, 'DailyLogs'],
    }),
  }),
});

export const {
  useGetDailyLogsQuery,
  useGetDailyLogQuery,
  useCreateDailyLogMutation,
  useUpdateDailyLogMutation,
  useDeleteDailyLogMutation,
  useApproveDailyLogMutation,
} = dailyLogsApi;
