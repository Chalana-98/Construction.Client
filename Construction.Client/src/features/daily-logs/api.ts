import { api } from '@/store/api';
import type {
  DailyLogDto,
  DailyLogListDto,
  DailyLogPhotoDto,
  CreateDailyLogDto,
  UpdateDailyLogDto,
  PagedResult,
} from '@/types';

export interface AddDailyLogPhotoRequest {
  fileName: string;
  photoUrl: string;
  thumbnailUrl?: string;
  fileSize: number;
  caption?: string;
}

export const dailyLogsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDailyLogs: builder.query<
      PagedResult<DailyLogListDto>,
      { projectId?: string; page?: number; pageSize?: number; fromDate?: string; toDate?: string }
    >({
      query: ({ projectId, page = 1, pageSize = 10, fromDate, toDate }) => {
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('pageSize', String(pageSize));
        if (fromDate) params.set('fromDate', fromDate);
        if (toDate) params.set('toDate', toDate);
        if (projectId) {
          return `/dailylogs/project/${projectId}?${params.toString()}`;
        }
        return `/dailylogs?${params.toString()}`;
      },
      providesTags: ['DailyLogs'],
    }),

    getDailyLog: builder.query<DailyLogDto, string>({
      query: (id) => `/dailylogs/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'DailyLogs', id }],
    }),

    getDailyLogByDate: builder.query<DailyLogDto, { projectId: string; date: string }>({
      query: ({ projectId, date }) => `/dailylogs/project/${projectId}/date/${date}`,
      providesTags: (_result, _error, { projectId }) => [{ type: 'DailyLogs', id: projectId }],
    }),

    createDailyLog: builder.mutation<DailyLogDto, CreateDailyLogDto>({
      query: (body) => ({ url: '/dailylogs', method: 'POST', body }),
      invalidatesTags: ['DailyLogs', 'Projects'],
    }),

    updateDailyLog: builder.mutation<DailyLogDto, { id: string; data: UpdateDailyLogDto }>({
      query: ({ id, data }) => ({ url: `/dailylogs/${id}`, method: 'PUT', body: data }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'DailyLogs', id }, 'DailyLogs'],
    }),

    deleteDailyLog: builder.mutation<void, string>({
      query: (id) => ({ url: `/dailylogs/${id}`, method: 'DELETE' }),
      invalidatesTags: ['DailyLogs', 'Projects'],
    }),

    approveDailyLog: builder.mutation<DailyLogDto, string>({
      query: (id) => ({ url: `/dailylogs/${id}/approve`, method: 'POST' }),
      invalidatesTags: (_result, _error, id) => [{ type: 'DailyLogs', id }, 'DailyLogs'],
    }),

    addDailyLogPhoto: builder.mutation<
      DailyLogPhotoDto,
      { dailyLogId: string; data: AddDailyLogPhotoRequest }
    >({
      query: ({ dailyLogId, data }) => ({
        url: `/dailylogs/${dailyLogId}/photos`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (_result, _error, { dailyLogId }) => [
        { type: 'DailyLogs', id: dailyLogId },
        'DailyLogs',
      ],
    }),

    deleteDailyLogPhoto: builder.mutation<void, { dailyLogId: string; photoId: string }>({
      query: ({ photoId }) => ({
        url: `/dailylogs/photos/${photoId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { dailyLogId }) => [
        { type: 'DailyLogs', id: dailyLogId },
        'DailyLogs',
      ],
    }),
  }),
});

export const {
  useGetDailyLogsQuery,
  useGetDailyLogQuery,
  useGetDailyLogByDateQuery,
  useCreateDailyLogMutation,
  useUpdateDailyLogMutation,
  useDeleteDailyLogMutation,
  useApproveDailyLogMutation,
  useAddDailyLogPhotoMutation,
  useDeleteDailyLogPhotoMutation,
} = dailyLogsApi;
