import { api } from '@/store/api';
import type { PagedResult } from '@/types';

export interface TenantUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: string;
  jobTitle?: string | null;
  phoneNumber?: string | null;
  isActive: boolean;
  emailVerified: boolean;
  lastLoginAt?: string | null;
  createdAt: string;
}

export interface CreateTenantUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  password?: string;
  role: string;
  jobTitle?: string;
  phoneNumber?: string;
}

export interface CreateTenantUserResult {
  user: TenantUser;
  /** Present only when the server generated the password; shown once. */
  temporaryPassword?: string | null;
}

export interface UpdateTenantUserRequest {
  firstName?: string;
  lastName?: string;
  role?: string;
  jobTitle?: string;
  phoneNumber?: string;
}

export const usersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<
      PagedResult<TenantUser>,
      { page?: number; pageSize?: number; search?: string; role?: string; includeInactive?: boolean } | void
    >({
      query: (params) => ({
        url: '/users',
        params: {
          page: params?.page ?? 1,
          pageSize: params?.pageSize ?? 100,
          search: params?.search || undefined,
          role: params?.role || undefined,
          includeInactive: params?.includeInactive ?? true,
        },
      }),
      providesTags: ['Users'],
    }),

    getUser: builder.query<TenantUser, string>({
      query: (id) => ({ url: `/users/${id}` }),
      providesTags: ['Users'],
    }),

    createUser: builder.mutation<CreateTenantUserResult, CreateTenantUserRequest>({
      query: (body) => ({ url: '/users', method: 'POST', body }),
      invalidatesTags: ['Users', 'ProjectMembers'],
    }),

    updateUser: builder.mutation<TenantUser, { id: string; body: UpdateTenantUserRequest }>({
      query: ({ id, body }) => ({ url: `/users/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Users', 'ProjectMembers'],
    }),

    deactivateUser: builder.mutation<void, string>({
      query: (id) => ({ url: `/users/${id}/deactivate`, method: 'POST' }),
      invalidatesTags: ['Users', 'ProjectMembers'],
    }),

    reactivateUser: builder.mutation<void, string>({
      query: (id) => ({ url: `/users/${id}/reactivate`, method: 'POST' }),
      invalidatesTags: ['Users', 'ProjectMembers'],
    }),

    resetUserPassword: builder.mutation<{ temporaryPassword: string }, string>({
      query: (id) => ({ url: `/users/${id}/reset-password`, method: 'POST' }),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeactivateUserMutation,
  useReactivateUserMutation,
  useResetUserPasswordMutation,
} = usersApi;
