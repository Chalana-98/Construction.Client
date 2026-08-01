import { api } from '@/store/api';
import type {
  VendorDto,
  CreateVendorDto,
  UpdateVendorDto,
  PagedResult,
} from '@/types';

export const vendorsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getVendors: builder.query<
      PagedResult<VendorDto>,
      {
        page?: number;
        pageSize?: number;
        search?: string;
      }
    >({
      query: ({ page = 1, pageSize = 10, search }) => {
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('pageSize', String(pageSize));
        if (search) params.set('search', search);
        return `/vendors?${params.toString()}`;
      },
      providesTags: ['Vendors'],
    }),

    getVendor: builder.query<VendorDto, string>({
      query: (id) => `/vendors/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Vendors', id }],
    }),

    createVendor: builder.mutation<VendorDto, CreateVendorDto>({
      query: (body) => ({ url: '/vendors', method: 'POST', body }),
      invalidatesTags: ['Vendors'],
    }),

    updateVendor: builder.mutation<VendorDto, { id: string; data: UpdateVendorDto }>({
      query: ({ id, data }) => ({ url: `/vendors/${id}`, method: 'PUT', body: data }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Vendors', id },
        'Vendors',
      ],
    }),

    deleteVendor: builder.mutation<void, string>({
      query: (id) => ({ url: `/vendors/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Vendors'],
    }),
  }),
});

export const {
  useGetVendorsQuery,
  useGetVendorQuery,
  useCreateVendorMutation,
  useUpdateVendorMutation,
  useDeleteVendorMutation,
} = vendorsApi;
