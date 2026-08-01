import { api } from '@/store/api';
import type {
  ChangeOrderDto,
  CreateChangeOrderDto,
  UpdateChangeOrderDto,
  PagedResult,
  ChangeOrderStatus,
} from '@/types';

export const changeOrdersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getChangeOrders: builder.query<
      PagedResult<ChangeOrderDto>,
      {
        projectId?: string;
        page?: number;
        pageSize?: number;
        status?: ChangeOrderStatus;
        search?: string;
      }
    >({
      query: ({ projectId, page = 1, pageSize = 10, status, search }) => {
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('pageSize', String(pageSize));
        if (projectId) params.set('projectId', projectId);
        if (status !== undefined) params.set('status', String(status));
        if (search) params.set('search', search);
        return `/change-orders?${params.toString()}`;
      },
      providesTags: ['ChangeOrders'],
    }),

    getChangeOrder: builder.query<ChangeOrderDto, string>({
      query: (id) => `/change-orders/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'ChangeOrders', id }],
    }),

    createChangeOrder: builder.mutation<ChangeOrderDto, CreateChangeOrderDto>({
      query: (body) => ({ url: '/change-orders', method: 'POST', body }),
      invalidatesTags: ['ChangeOrders', 'Projects', 'Dashboard'],
    }),

    updateChangeOrder: builder.mutation<ChangeOrderDto, { id: string; data: UpdateChangeOrderDto }>({
      query: ({ id, data }) => ({ url: `/change-orders/${id}`, method: 'PUT', body: data }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'ChangeOrders', id },
        'ChangeOrders',
        'Projects',
      ],
    }),

    approveChangeOrder: builder.mutation<ChangeOrderDto, string>({
      query: (id) => ({ url: `/change-orders/${id}/approve`, method: 'POST' }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'ChangeOrders', id },
        'ChangeOrders',
        'Projects',
        'Dashboard',
      ],
    }),

    rejectChangeOrder: builder.mutation<ChangeOrderDto, string>({
      query: (id) => ({ url: `/change-orders/${id}/reject`, method: 'POST' }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'ChangeOrders', id },
        'ChangeOrders',
      ],
    }),

    deleteChangeOrder: builder.mutation<void, string>({
      query: (id) => ({ url: `/change-orders/${id}`, method: 'DELETE' }),
      invalidatesTags: ['ChangeOrders', 'Projects', 'Dashboard'],
    }),
  }),
});

export const {
  useGetChangeOrdersQuery,
  useGetChangeOrderQuery,
  useCreateChangeOrderMutation,
  useUpdateChangeOrderMutation,
  useApproveChangeOrderMutation,
  useRejectChangeOrderMutation,
  useDeleteChangeOrderMutation,
} = changeOrdersApi;
