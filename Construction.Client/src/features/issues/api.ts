import { api } from '@/store/api';
import type {
  IssueDto,
  IssueListDto,
  CreateIssueDto,
  UpdateIssueDto,
  PagedResult,
  IssueStatus,
  IssueType,
  IssuePriority,
} from '@/types';

export interface IssueCommentDto {
  id: string;
  issueId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

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
        priority?: IssuePriority;
      }
    >({
      query: ({ projectId, page = 1, pageSize = 10, type, status, priority }) => {
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('pageSize', String(pageSize));
        if (type !== undefined) params.set('type', String(type));
        if (status !== undefined) params.set('status', String(status));
        if (priority !== undefined) params.set('priority', String(priority));
        if (projectId) {
          return `/issues/project/${projectId}?${params.toString()}`;
        }
        return `/issues?${params.toString()}`;
      },
      providesTags: ['Issues'],
    }),

    getMyIssues: builder.query<IssueListDto[], IssueStatus | undefined>({
      query: (status) => {
        const params = new URLSearchParams();
        if (status !== undefined) params.set('status', String(status));
        return `/issues/my-issues?${params.toString()}`;
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

    updateIssueStatus: builder.mutation<
      IssueDto,
      { id: string; status: IssueStatus; resolution?: string }
    >({
      query: ({ id, status, resolution }) => ({
        url: `/issues/${id}/status`,
        method: 'PATCH',
        body: { status, resolution },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Issues', id },
        'Issues',
        'Projects',
        'Dashboard',
      ],
    }),

    assignIssue: builder.mutation<IssueDto, { id: string; assignedToId: string | null }>({
      query: ({ id, assignedToId }) => ({
        url: `/issues/${id}/assign`,
        method: 'PATCH',
        body: { assignedToId },
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Issues', id }, 'Issues'],
    }),

    getIssueComments: builder.query<IssueCommentDto[], string>({
      query: (issueId) => `/issues/${issueId}/comments`,
      providesTags: (_result, _error, issueId) => [{ type: 'Issues', id: `${issueId}-comments` }],
    }),

    addIssueComment: builder.mutation<
      IssueCommentDto,
      { issueId: string; content: string }
    >({
      query: ({ issueId, content }) => ({
        url: `/issues/${issueId}/comments`,
        method: 'POST',
        body: { content },
      }),
      invalidatesTags: (_result, _error, { issueId }) => [
        { type: 'Issues', id: `${issueId}-comments` },
        { type: 'Issues', id: issueId },
      ],
    }),

    deleteIssueComment: builder.mutation<void, { issueId: string; commentId: string }>({
      query: ({ commentId }) => ({
        url: `/issues/comments/${commentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { issueId }) => [
        { type: 'Issues', id: `${issueId}-comments` },
      ],
    }),
  }),
});

export const {
  useGetIssuesQuery,
  useGetMyIssuesQuery,
  useGetIssueQuery,
  useCreateIssueMutation,
  useUpdateIssueMutation,
  useDeleteIssueMutation,
  useUpdateIssueStatusMutation,
  useAssignIssueMutation,
  useGetIssueCommentsQuery,
  useAddIssueCommentMutation,
  useDeleteIssueCommentMutation,
} = issuesApi;
