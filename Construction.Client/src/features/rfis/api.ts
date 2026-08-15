import { api } from '@/store/api';
import type {
  RFIDto,
  RFICommentDto,
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
        if (status !== undefined) params.set('status', String(status));
        if (search) params.set('search', search);
        if (projectId) {
          return `/rfis/project/${projectId}?${params.toString()}`;
        }
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
      invalidatesTags: ['RFIs', 'Dashboard', 'Projects'],
    }),

    updateRFI: builder.mutation<RFIDto, { id: string; data: UpdateRFIDto }>({
      query: ({ id, data }) => ({ url: `/rfis/${id}`, method: 'PUT', body: data }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'RFIs', id },
        'RFIs',
        'Dashboard',
        'Projects',
      ],
    }),

    deleteRFI: builder.mutation<void, string>({
      query: (id) => ({ url: `/rfis/${id}`, method: 'DELETE' }),
      invalidatesTags: ['RFIs', 'Dashboard', 'Projects'],
    }),

    getRFIComments: builder.query<RFICommentDto[], string>({
      query: (rfiId) => `/rfis/${rfiId}/comments`,
      providesTags: (_result, _error, rfiId) => [{ type: 'RFIs', id: `${rfiId}-comments` }],
    }),

    addRFIComment: builder.mutation<RFICommentDto, { rfiId: string; content: string }>({
      query: ({ rfiId, content }) => ({
        url: `/rfis/${rfiId}/comments`,
        method: 'POST',
        body: JSON.stringify(content),
      }),
      invalidatesTags: (_result, _error, { rfiId }) => [
        { type: 'RFIs', id: `${rfiId}-comments` },
        { type: 'RFIs', id: rfiId },
      ],
    }),
  }),
});

export const {
  useGetRFIsQuery,
  useGetRFIQuery,
  useCreateRFIMutation,
  useUpdateRFIMutation,
  useDeleteRFIMutation,
  useGetRFICommentsQuery,
  useAddRFICommentMutation,
} = rfisApi;
