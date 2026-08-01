import { api } from '@/store/api';
import type {
  TimesheetDto,
  CreateTimesheetDto,
  UpdateTimesheetDto,
  PagedResult,
} from '@/types';

export const timesheetsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTimesheets: builder.query<
      PagedResult<TimesheetDto>,
      {
        projectId?: string;
        page?: number;
        pageSize?: number;
      }
    >({
      query: ({ projectId, page = 1, pageSize = 10 }) => {
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('pageSize', String(pageSize));
        if (projectId) params.set('projectId', projectId);
        return `/timesheets?${params.toString()}`;
      },
      providesTags: ['Timesheets'],
    }),

    getTimesheet: builder.query<TimesheetDto, string>({
      query: (id) => `/timesheets/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Timesheets', id }],
    }),

    createTimesheet: builder.mutation<TimesheetDto, CreateTimesheetDto>({
      query: (body) => ({ url: '/timesheets', method: 'POST', body }),
      invalidatesTags: ['Timesheets'],
    }),

    updateTimesheet: builder.mutation<TimesheetDto, { id: string; data: UpdateTimesheetDto }>({
      query: ({ id, data }) => ({ url: `/timesheets/${id}`, method: 'PUT', body: data }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Timesheets', id },
        'Timesheets',
      ],
    }),

    approveTimesheet: builder.mutation<TimesheetDto, string>({
      query: (id) => ({ url: `/timesheets/${id}/approve`, method: 'POST' }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Timesheets', id },
        'Timesheets',
      ],
    }),

    deleteTimesheet: builder.mutation<void, string>({
      query: (id) => ({ url: `/timesheets/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Timesheets'],
    }),
  }),
});

export const {
  useGetTimesheetsQuery,
  useGetTimesheetQuery,
  useCreateTimesheetMutation,
  useUpdateTimesheetMutation,
  useApproveTimesheetMutation,
  useDeleteTimesheetMutation,
} = timesheetsApi;
