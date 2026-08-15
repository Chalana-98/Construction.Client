import { api } from '@/store/api';
import type {
  TaskDto,
  TaskListDto,
  CreateTaskDto,
  UpdateTaskDto,
  TaskCommentDto,
  PagedResult,
  TaskStatus,
  TaskPriority,
} from '@/types';

export const tasksApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query<
      PagedResult<TaskListDto>,
      {
        projectId?: string;
        page?: number;
        pageSize?: number;
        status?: TaskStatus;
        priority?: TaskPriority;
        assignedToId?: string;
      }
    >({
      query: ({ projectId, page = 1, pageSize = 10, status, priority, assignedToId }) => {
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('pageSize', String(pageSize));
        if (status !== undefined) params.set('status', String(status));
        if (priority !== undefined) params.set('priority', String(priority));
        if (assignedToId) params.set('assignedToId', assignedToId);
        if (projectId) {
          return `/tasks/project/${projectId}?${params.toString()}`;
        }
        return `/tasks?${params.toString()}`;
      },
      providesTags: ['Tasks'],
    }),

    getMyTasks: builder.query<TaskListDto[], TaskStatus | undefined>({
      query: (status) => {
        const params = new URLSearchParams();
        if (status !== undefined) params.set('status', String(status));
        return `/tasks/my-tasks?${params.toString()}`;
      },
      providesTags: ['Tasks'],
    }),

    getTask: builder.query<TaskDto, string>({
      query: (id) => `/tasks/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Tasks', id }],
    }),

    createTask: builder.mutation<TaskDto, CreateTaskDto>({
      query: (body) => ({ url: '/tasks', method: 'POST', body }),
      invalidatesTags: ['Tasks', 'Projects', 'Dashboard'],
    }),

    updateTask: builder.mutation<TaskDto, { id: string; data: UpdateTaskDto }>({
      query: ({ id, data }) => ({ url: `/tasks/${id}`, method: 'PUT', body: data }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Tasks', id },
        'Tasks',
        'Projects',
        'Dashboard',
      ],
    }),

    deleteTask: builder.mutation<void, string>({
      query: (id) => ({ url: `/tasks/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Tasks', 'Projects', 'Dashboard'],
    }),

    updateTaskStatus: builder.mutation<TaskDto, { id: string; status: TaskStatus }>({
      query: ({ id, status }) => ({
        url: `/tasks/${id}/status`,
        method: 'PATCH',
        body: status,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Tasks', id },
        'Tasks',
        'Projects',
        'Dashboard',
      ],
    }),

    assignTask: builder.mutation<TaskDto, { id: string; assignedToId: string | null }>({
      query: ({ id, assignedToId }) => ({
        url: `/tasks/${id}/assign`,
        method: 'PATCH',
        body: assignedToId,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Tasks', id }, 'Tasks'],
    }),

    getTaskComments: builder.query<TaskCommentDto[], string>({
      query: (taskId) => `/tasks/${taskId}/comments`,
      providesTags: (_result, _error, taskId) => [{ type: 'Tasks', id: `${taskId}-comments` }],
    }),

    addTaskComment: builder.mutation<TaskCommentDto, { taskId: string; content: string }>({
      query: ({ taskId, content }) => ({
        url: `/tasks/${taskId}/comments`,
        method: 'POST',
        body: JSON.stringify(content),
      }),
      invalidatesTags: (_result, _error, { taskId }) => [
        { type: 'Tasks', id: `${taskId}-comments` },
        { type: 'Tasks', id: taskId },
      ],
    }),

    deleteTaskComment: builder.mutation<void, { taskId: string; commentId: string }>({
      query: ({ commentId }) => ({
        url: `/tasks/comments/${commentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { taskId }) => [
        { type: 'Tasks', id: `${taskId}-comments` },
      ],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useGetMyTasksQuery,
  useGetTaskQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useUpdateTaskStatusMutation,
  useAssignTaskMutation,
  useGetTaskCommentsQuery,
  useAddTaskCommentMutation,
  useDeleteTaskCommentMutation,
} = tasksApi;
