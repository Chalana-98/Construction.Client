import { api } from '@/store/api';
import type {
  RFIDto,
  CreateRFIDto,
  UpdateRFIDto,
  PagedResult,
  RFIStatus,
} from '@/types';

export const rfisApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getRFIs: builder.query<
      PagedResult<RFIDto>,
      {
        projectId?: string;
        page?: number;
        pageSize?: number;
        status?: RFIStatus;
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
        return `/rfis?${params.toString()}`;
      },
      providesTags: ['RFIs'],
    }),

    getRFI: builder.query<RFIDto, string>({
      query: (id) => `/rfis/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'RFIs', id }],
    }),

    createRFI: builder.mutation<RFIDto, CreateRFIDto>({
      query: (body) => ({ url: '/rfis', method: 'POST', body }),
      invalidatesTags: ['RFIs', 'Dashboard'],
    }),

    updateRFI: builder.mutation<RFIDto, { id: string; data: UpdateRFIDto }>({
      query: ({ id, data }) => ({ url: `/rfis/${id}`, method: 'PUT', body: data }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'RFIs', id },
        'RFIs',
        'Dashboard',
      ],
    }),

    deleteRFI: builder.mutation<void, string>({
      query: (id) => ({ url: `/rfis/${id}`, method: 'DELETE' }),
      invalidatesTags: ['RFIs', 'Dashboard'],
    }),
  }),
});

export const {
  useGetRFIsQuery,
  useGetRFIQuery,
  useCreateRFIMutation,
  useUpdateRFIMutation,
  useDeleteRFIMutation,
} = rfisApi;
