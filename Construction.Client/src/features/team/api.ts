import { api } from '@/store/api';
import type {
  ProjectMemberDto,
  CreateProjectMemberDto,
  UpdateProjectMemberDto,
  PagedResult,
} from '@/types';

export const projectMembersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProjectMembers: builder.query<
      PagedResult<ProjectMemberDto>,
      { projectId?: string; page?: number; pageSize?: number; role?: string }
    >({
      query: ({ projectId, page = 1, pageSize = 20, role }) => {
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('pageSize', String(pageSize));
        if (projectId) params.set('projectId', projectId);
        if (role) params.set('role', role);
        return `/projectmembers?${params.toString()}`;
      },
      providesTags: ['ProjectMembers'],
    }),

    getProjectMember: builder.query<ProjectMemberDto, string>({
      query: (id) => `/projectmembers/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'ProjectMembers', id }],
    }),

    addProjectMember: builder.mutation<ProjectMemberDto, CreateProjectMemberDto>({
      query: (body) => ({ url: '/projectmembers', method: 'POST', body }),
      invalidatesTags: ['ProjectMembers', 'Projects'],
    }),

    updateProjectMember: builder.mutation<
      ProjectMemberDto,
      { id: string; data: UpdateProjectMemberDto }
    >({
      query: ({ id, data }) => ({ url: `/projectmembers/${id}`, method: 'PUT', body: data }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'ProjectMembers', id },
        'ProjectMembers',
      ],
    }),

    removeProjectMember: builder.mutation<void, string>({
      query: (id) => ({ url: `/projectmembers/${id}`, method: 'DELETE' }),
      invalidatesTags: ['ProjectMembers', 'Projects'],
    }),

    deactivateProjectMember: builder.mutation<ProjectMemberDto, string>({
      query: (id) => ({ url: `/projectmembers/${id}/deactivate`, method: 'PUT' }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'ProjectMembers', id },
        'ProjectMembers',
      ],
    }),

    reactivateProjectMember: builder.mutation<ProjectMemberDto, string>({
      query: (id) => ({ url: `/projectmembers/${id}/reactivate`, method: 'PUT' }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'ProjectMembers', id },
        'ProjectMembers',
      ],
    }),
  }),
});

export const {
  useGetProjectMembersQuery,
  useGetProjectMemberQuery,
  useAddProjectMemberMutation,
  useUpdateProjectMemberMutation,
  useRemoveProjectMemberMutation,
  useDeactivateProjectMemberMutation,
  useReactivateProjectMemberMutation,
} = projectMembersApi;
