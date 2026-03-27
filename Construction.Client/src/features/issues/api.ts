import { api } from '@/store/api';
import type {
  IssueDto,
  IssueListDto,
  CreateIssueDto,
  UpdateIssueDto,
  PagedResult,
  IssueStatus,
  IssueType,
} from '@/types';

export const issuesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getIssues: builder.query<
      PagedResult<IssueListDto>,
      {
        projectId?: string;
        page?: number;
        pageSize?: number;
        type?: IssueType;
        status?: IssueStatus;
      }
    >({
      query: ({ projectId, page = 1, pageSize = 10, type, status }) => {
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('pageSize', String(pageSize));
        if (projectId) params.set('projectId', projectId);
        if (type !== undefined) params.set('type', String(type));
        if (status !== undefined) params.set('status', String(status));
        return `/issues?${params.toString()}`;
      },
      providesTags: ['Issues'],
    }),

    getIssue: builder.query<IssueDto, string>({
      query: (id) => `/issues/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Issues', id }],
    }),

    createIssue: builder.mutation<IssueDto, CreateIssueDto>({
      query: (body) => ({ url: '/issues', method: 'POST', body }),
      invalidatesTags: ['Issues', 'Projects', 'Dashboard'],
    }),

    updateIssue: builder.mutation<IssueDto, { id: string; data: UpdateIssueDto }>({
      query: ({ id, data }) => ({ url: `/issues/${id}`, method: 'PUT', body: data }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Issues', id },
        'Issues',
        'Projects',
        'Dashboard',
      ],
    }),

    deleteIssue: builder.mutation<void, string>({
      query: (id) => ({ url: `/issues/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Issues', 'Projects', 'Dashboard'],
    }),

    updateIssueStatus: builder.mutation<IssueDto, { id: string; status: IssueStatus }>({
      query: ({ id, status }) => ({
        url: `/issues/${id}/status`,
        method: 'PUT',
        body: status,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Issues', id },
        'Issues',
        'Dashboard',
      ],
    }),

    assignIssue: builder.mutation<IssueDto, { id: string; assignedToId: string }>({
      query: ({ id, assignedToId }) => ({
        url: `/issues/${id}/assign`,
        method: 'PUT',
        body: JSON.stringify(assignedToId),
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Issues', id }, 'Issues'],
    }),
  }),
});

export const {
  useGetIssuesQuery,
  useGetIssueQuery,
  useCreateIssueMutation,
  useUpdateIssueMutation,
  useDeleteIssueMutation,
  useUpdateIssueStatusMutation,
  useAssignIssueMutation,
} = issuesApi;
