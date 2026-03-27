import { api } from '@/store/api';
import type {
  ProjectDto,
  ProjectListDto,
  CreateProjectDto,
  UpdateProjectDto,
  ProjectStatisticsDto,
  DashboardDto,
  PagedResult,
  ProjectStatus,
} from '@/types';

export const projectsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query<
      PagedResult<ProjectListDto>,
      { page?: number; pageSize?: number; status?: ProjectStatus; search?: string }
    >({
      query: ({ page = 1, pageSize = 10, status, search }) => {
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('pageSize', String(pageSize));
        if (status !== undefined) params.set('status', String(status));
        if (search) params.set('search', search);
        return `/projects?${params.toString()}`;
      },
      providesTags: ['Projects'],
    }),

    getProject: builder.query<ProjectDto, string>({
      query: (id) => `/projects/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Projects', id }],
    }),

    createProject: builder.mutation<ProjectDto, CreateProjectDto>({
      query: (body) => ({ url: '/projects', method: 'POST', body }),
      invalidatesTags: ['Projects', 'Dashboard'],
    }),

    updateProject: builder.mutation<ProjectDto, { id: string; data: UpdateProjectDto }>({
      query: ({ id, data }) => ({ url: `/projects/${id}`, method: 'PUT', body: data }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Projects', id },
        'Projects',
        'Dashboard',
      ],
    }),

    deleteProject: builder.mutation<void, string>({
      query: (id) => ({ url: `/projects/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Projects', 'Dashboard'],
    }),

    updateProjectStatus: builder.mutation<ProjectDto, { id: string; status: ProjectStatus }>({
      query: ({ id, status }) => ({
        url: `/projects/${id}/status`,
        method: 'PATCH',
        body: status,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Projects', id },
        'Projects',
        'Dashboard',
      ],
    }),

    getProjectStatistics: builder.query<ProjectStatisticsDto, string>({
      query: (id) => `/projects/${id}/statistics`,
      providesTags: (_result, _error, id) => [{ type: 'Projects', id }],
    }),

    getDashboard: builder.query<DashboardDto, void>({
      query: () => '/projects/dashboard',
      providesTags: ['Dashboard'],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useUpdateProjectStatusMutation,
  useGetProjectStatisticsQuery,
  useGetDashboardQuery,
} = projectsApi;
